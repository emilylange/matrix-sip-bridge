// @ts-expect-error wrtc has no types
import wrtc, { MediaStream } from 'wrtc';

const { RTCAudioSource, RTCAudioSink, RTCAudioData } = wrtc.nonstandard;

export default class webrtcMediaFactory {
  public invitingMediaStream: MediaStream;
  public invitingAudioSource: typeof RTCAudioSource;
  public answeringMediaStream: MediaStream;
  public answeringAudioSource: typeof RTCAudioSource;

  constructor() {
    this.invitingMediaStream = new MediaStream();
    this.answeringMediaStream = new MediaStream();

    this.addTracks();
  }

  public setAudioTrack(stream: MediaStream, destinationAudioSource: typeof RTCAudioSource) {
    const sink = new RTCAudioSink(stream.getAudioTracks()[0]);
    sink.ondata = (data: typeof RTCAudioData) => {
      destinationAudioSource.onData(data);
    };
  }

  public addTracks() {
    this.invitingAudioSource = new RTCAudioSource();
    const inviteTrack: MediaStreamTrack = this.invitingAudioSource.createTrack();
    this.invitingMediaStream.addTrack(inviteTrack);

    this.answeringAudioSource = new RTCAudioSource();
    const answerTrack: MediaStreamTrack = this.answeringAudioSource.createTrack();
    this.answeringMediaStream.addTrack(answerTrack);
  }

}
