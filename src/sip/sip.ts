import { Web } from 'sip.js';
import webrtcMediaFactory from '../webrtc/mediaStreams';

interface ISipClient {
  sipServer: string;
  sipUri: string;
  sipUser: string;
  sipPassword: string;
  mediaStreams: webrtcMediaFactory;
}

export default class SipClient {
  public client: Web.SimpleUser;
  private mediaStreams: webrtcMediaFactory;

  constructor({
    sipServer,
    sipUri,
    sipUser,
    sipPassword,
    mediaStreams,
  }: ISipClient) {
    this.mediaStreams = mediaStreams;

    this.client = new Web.SimpleUser(sipServer, {
      aor: sipUri,
      media: {
        constraints: {
          audio: true,
          video: false,
        },
      },
      userAgentOptions: {
        sessionDescriptionHandlerFactory: Web.defaultSessionDescriptionHandlerFactory(async () => {
          return this.mediaStreams.invitingMediaStream;
        }),
        authorizationUsername: sipUser,
        authorizationPassword: sipPassword,
      },
    });

    this.init();
  }

  private async init() {
    this.client.delegate = {

      onCallAnswered: async () => {
        try {
          this.mediaStreams.setAudioTrack(this.client.remoteMediaStream, this.mediaStreams.answeringAudioSource);
        } catch (e) {
          console.error(e);
          await this.client.disconnect();
        }
      },
    };

    await this.client.connect();
    await this.client.register();
  }
}
