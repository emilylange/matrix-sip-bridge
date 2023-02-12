# matrix-sip-bridge
A bridge between [Matrix](https://matrix.org/) and VoIP via [SIP](https://en.wikipedia.org/wiki/Session_Initiation_Protocol) to answer (and in future make) phone calls from Matrix.

## Current state of this project
I am planing to rewrite this _bot_ in go, soon™
The current NodeJS codebase is now considered deprecated and won't receive any future updates.

Current roadmap for the new rewrite:
- [ ] Support for SIP over port `:5060` and `:5061` (instead of requiring the SIP server to expose a webrtc/websocket endpoint)
- [ ] Receiving/making audio calls
- [ ] Displaying who is currently calling 👀
- [ ] End-to-End Encryption (e2ee)

## Matrix Room
Feel free to ask questions, provide feedback or just hang out in the official Matrix room:

[#matrix-sip-bridge:indeednotjames.com](https://matrix.to/#/#matrix-sip-bridge:indeednotjames.com)

## Please be aware, that this is considered **early stage software**
There may or may not be a lot of bugs and breaking changes. 
But *especially* because of this, you will be able to influence how this project continues to develop.

Feel free to [file issues](https://github.com/IndeedNotJames/matrix-sip-bridge/issues/new), ask questions, provide feedback, [hang out in the official matrix room](#matrix-room) or contribute some code - or whatever! 😊

## Documentation
Documentation can be found in [`./docs`](https://github.com/IndeedNotJames/matrix-sip-bridge/tree/main/docs)
If you'd like to improve those, feel free to file a pull request or [let us know](#matrix-room) where some things were unclear to you.   

## Related Projects
* https://github.com/KB1RD/matrix-pstn-bridge 
  * Runs as [application service](https://www.matrix.org/docs/guides/application-services)
  * Uses Twilio instead of generic SIP
* https://github.com/alangecker/matrix-appservice-pstn
  * Runs as [application service](https://www.matrix.org/docs/guides/application-services)
  * Works with SIP providers that don't natively provide websocket endpoints
  * Integrates as dial pad into Element
