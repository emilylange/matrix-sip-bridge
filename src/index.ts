import 'dotenv/config';
import './webrtc/polyfill';

import webrtcMediaFactory from './webrtc/mediaStreams';
import SipClient from './sip/sip';
import MatrixBot from './matrix/bot';
import { CallErrorCode, CallEvent, CallState } from 'matrix-js-sdk/lib/webrtc/call';

const mediaStreams = new webrtcMediaFactory();

const matrixBot = new MatrixBot({
  homeserver: process.env.MX_HOMESERVER,
  accessToken: process.env.MX_ACCESSTOKEN,
  userId: process.env.MX_USERID,
  roomId: process.env.MX_ROOMID,
  mediaStreams,
});

const sip = new SipClient({
  sipServer: process.env.SIP_SERVER,
  sipUri: process.env.SIP_URI,
  sipUser: process.env.SIP_USER,
  sipPassword: process.env.SIP_PASSWORD,
  mediaStreams,
});

sip.client.delegate.onCallReceived = async () => {
  await matrixBot.placeCall();

  // hangle matrix call state changes
  matrixBot.call.on(CallEvent.State, async (state) => {
    // answer SIP call after matrix call is answered
    if (state === CallState.Connecting) {
      await sip.client.answer({});
    }
  });

  // hangup SIP call when matrix call ends
  matrixBot.call.on(CallEvent.Hangup, async () => {
    // may fail when sip call already ended ("Session does not exist")
    try {
      await sip.client.hangup();
    } catch (e) {
      if (e.message !== 'Session does not exist') {
        console.error(e);
      }
    }
  });

  // handle matrix->sip hold
  matrixBot.call.on(CallEvent.RemoteHoldUnhold, async () => {
    if (matrixBot.call.isRemoteOnHold()) {
      await sip.client.hold();
    } else {
      await sip.client.unhold();
    }
  });
};

// handle sip->matrix hold
sip.client.delegate.onCallHold = async (held: boolean) => {
  matrixBot.call.setRemoteOnHold(held);
};

// handle sip->matrix hangup
sip.client.delegate.onCallHangup = async () => {
  await matrixBot.call.hangup(CallErrorCode.UserHangup, false);
};

const gracefulDisconnect = async () => {
  await sip.client.disconnect();
  await matrixBot.destroy();
};

// graceful stop
process.once('SIGINT', gracefulDisconnect);
process.once('SIGTERM', gracefulDisconnect);
