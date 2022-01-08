/**
 * Glue code/polyfill to use WebRTC for matrix-bot-sdk and sip.js in nodejs
 */

// @ts-expect-error wrtc has no types
import wrtc, { MediaStream } from 'wrtc';
import { WebSocket } from 'ws';

const {
  RTCPeerConnection,
  RTCRtpReceiver,
  RTCRtpSender,
} = wrtc;

// global.window.* is required for both matrix-js-sdk and sip.js
if (global.window === undefined) global.window = {} as never;

global.WebSocket = WebSocket as never;
global.MediaStream = MediaStream;
global.RTCPeerConnection = RTCPeerConnection;
global.RTCRtpReceiver = RTCRtpReceiver;
global.RTCRtpSender = RTCRtpSender;
global.window.RTCPeerConnection = RTCPeerConnection;

// matrix-js-sdk checks for global.document
if (global.document === undefined) global.document = {} as never;

// dummy MediaStreamTrackEvent class
// wtrc does not seems to have a MediaStreamTrackEvent class
// (used in node_modules/sip.js/lib/platform/web/session-description-handler)
global.MediaStreamTrackEvent = class MediaStreamTrackEvent {} as never;

// dummy window.addEventListener function if undefined
// (used in node_modules/sip.js/lib/platform/web/simple-user and probably elsewhere)
// eslint-disable-next-line @typescript-eslint/no-empty-function
if (global.window.addEventListener === undefined) global.window.addEventListener = () => {};
