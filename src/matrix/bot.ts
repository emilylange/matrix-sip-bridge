import * as matrixSdk from 'matrix-js-sdk';
import { MatrixClient, MatrixEvent, MsgType } from 'matrix-js-sdk';
import { CallErrorCode, CallEvent, MatrixCall } from 'matrix-js-sdk/lib/webrtc/call';
import { SDPStreamMetadataPurpose } from 'matrix-js-sdk/lib/webrtc/callEventTypes';
import { CallFeed } from 'matrix-js-sdk/lib/webrtc/callFeed';
import webrtcMediaFactory from '../webrtc/mediaStreams';

interface IMatrixBot {
  homeserver: string;
  accessToken: string;
  userId: string,
  roomId: string;
  mediaStreams: webrtcMediaFactory;
}

export default class MatrixBot {
  private bot: MatrixClient;
  private roomId: string;
  private mediaStreams: webrtcMediaFactory;
  public call: MatrixCall;

  constructor({
    homeserver,
    accessToken,
    userId,
    roomId,
    mediaStreams,
  }: IMatrixBot,
  ){
    this.bot = matrixSdk.createClient({
      baseUrl: homeserver,
      accessToken,
      userId,
      useAuthorizationHeader: true, // Use Authorization header instead of query string
      forceTURN: true, // Force TURN for WebRTC
    });

    this.roomId = roomId;
    this.mediaStreams = mediaStreams;

    this.initListener();

    // TODO: Overwrite matrix logger
    // TODO: Add event filter
    // TODO: Add persistent store
    // TODO: Add e2ee support
    this.bot.startClient({
      initialSyncLimit: 0,
    });
  }

  public async placeCall() {
    const call = matrixSdk.createNewMatrixCall(
      this.bot,
      this.roomId,
    );

    // get remote audio stream and attach it to the call sip call
    call.on(CallEvent.FeedsChanged, (feeds: CallFeed[]) => {
      const remoteFeed = feeds.find((feed) => !feed.isLocal());
      if (remoteFeed !== undefined) {
        this.mediaStreams.setAudioTrack(remoteFeed.stream, this.mediaStreams.invitingAudioSource);
      }
    });

    call.placeCallWithCallFeeds([
      new CallFeed({
        client: this.bot,
        roomId: call.roomId,
        userId: this.bot.getUserId(),
        stream: this.mediaStreams.answeringMediaStream,
        purpose: SDPStreamMetadataPurpose.Usermedia,
        audioMuted: false,
        videoMuted: true,
      }),
    ]);

    this.call = call;
  }

  public async destroy() {
    try {
      this.call.hangup(CallErrorCode.UserHangup, true);
    } catch { // ignore error since we are exiting }
      this.bot.stopClient();
    }
  }

  private initListener() {
    this.bot.on('Room.timeline', async (event: MatrixEvent) => {
      if (event.getType() === 'm.room.message') {
        if (event.getContent().msgtype === MsgType.Text) {
          console.log(event.getContent());
          await this.bot.sendNotice(
            event.getRoomId(),
            `Hi! 👋
This is a little proof of concept to receive and answer real-world SIP calls from your matrix.org client.
Current limitations:
* one-to-one calls only (no group calls)
* you cannot place an SIP call from Matrix (SIP -> Matrix only)
* room must be unencrypted
`,
          );
        }
      }});

    this.bot.on('Call.incoming', (call: MatrixCall) => {
      console.log(`Cannot handle outgoing calls yet (abort incomming matrix call in ${call.roomId})`);
      call.reject();
      this.bot.sendNotice(call.roomId, 'Outgoing calls from Matrix to SIP are not yet supported.');
    });
  }
}
