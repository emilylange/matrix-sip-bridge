# matrix-sip-bridge
A bridge between [Matrix](https://matrix.org/) and VoIP via [SIP](https://en.wikipedia.org/wiki/Session_Initiation_Protocol) to answer (and in future make) phone calls from Matrix.

## Please be aware, that this is considered **early stage software**
There may or may not be a lot of bugs and breaking changes. 
But *especially* because of this, you will be able to influence how this project continues to develop.

Feel free to [file issues](https://github.com/IndeedNotJames/matrix-sip-bridge/issues/new), ask questions, provide feedback, [hang out in the official matrix room](#matrix-room) or contribute some code - or whatever! 😊

## Documentation
Documentation can be found in [`./docs`](https://github.com/IndeedNotJames/matrix-sip-bridge/tree/main/docs)
If you'd like to improve those, feel free to file a pull request or [let us know](#matrix-room) where some things were unclear to you.   

## Matrix Room
Feel free to ask questions, provide feedback or just hang out in the official Matrix room:

[#matrix-sip-bridge:indeednotjames.com](https://matrix.to/#/#matrix-sip-bridge:indeednotjames.com)

## Related Projects
* https://github.com/KB1RD/matrix-pstn-bridge 
  * Runs as [application service](https://www.matrix.org/docs/guides/application-services)
  * Uses Twilio instead of generic SIP
* https://github.com/alangecker/matrix-appservice-pstn
  * Runs as [application service](https://www.matrix.org/docs/guides/application-services)
  * Works with SIP providers that don't natively provide websocket endpoints
  * Integrates as dial pad into Element
