# matrix-sip-bridge documentation

The current documentation is somewhat suboptimal and there are many things to improve.
If you need any help, feel free to ask any questions in the [matrix room](https://github.com/IndeedNotJames/matrix-sip-bridge/blob/main/README.md#matrix-room)

## Install
As of now, the installation is pretty Docker centric, but it should be fine to just use `npm install`/`yarn install` with a *systemd* or *openrc* service.
It will improve in the future™

### Docker
How to install Docker is likely out of the scope of this document. Follow the [official Docker install](https://docs.docker.com/engine/install/) steps if you haven't already. Podman should in theory work just fine too.

The official container image is available both at https://github.com/indeednotjames/matrix-sip-bridge/pkgs/container/matrix-sip-bridge and https://hub.docker.com/r/indeednotjames/matrix-sip-bridge

#### Supported Docker tags
* `latest` is the latest stable release
* `x.y.z` is a specific `x.y.z` release (e.g. `:0.1.0`)
* `x.y` is a specific `x.y.*` release (e.g. `:0.1` would point `:0.1.0` or `:0.1.1`)
* `edge` is always the latest commit (unstable, "living on the edge")
* `sha-*` allows you to run a specific commit

At the time of writing, you have to use the `:edge` that, because there hasn't been a release yet:
- `ghcr.io/indeednotjames/matrix-sip-bridge:edge` or
- `indeednotjames/matrix-sip-bridge:edge` (`docker.io/indeednotjames/matrix-sip-bridge:edge`)

**An example [`docker-compose.yml`](https://github.com/IndeedNotJames/matrix-sip-bridge/blob/main/docker-compose.yml) is available to use at the projects root.**

Alternatively, you can build a huge `docker run` command like so:
See [Configure](#configure) for all required options.

```bash
❯ docker run \
    --restart=always \
    --name=matrix-sip-bridge \
    --env="MX_HOMESERVER=https://homeserver.example" \
    --env="MX_ACCESSTOKEN=See 'Configure' below" \
    --env="MX_USERID=@localpart:homeserver.example" \
    --env="MX_ROOMID=!roomId:homeserver.example" \
    --env="SIP_SERVER=wss://sip.sipgate.de" \
    --env="SIP_URI=sip:userAddress@sipgate.de" \
    --env="SIP_USER=your userAddress" \
    --env="SIP_PASSWORD=your sip user password" \
    ghcr.io/indeednotjames/matrix-sip-bridge:edge
```

## Configure
As of now, everything gets configured via environment variables and there is no persistent data volume needed.
However, there is a pretty high chance this will later down the road.

All those environment variables are listed in the [`.env-example` file](https://github.com/IndeedNotJames/matrix-sip-bridge/blob/main/.env-example).
In detail explanations will follow eventually.

### SIP
Your SIP server requires websocket support for now.

For example *sipgate.de* provides `wss://sip.sipgate.de` for you to use.

### Obtaining an access token
Follow https://t2bot.io/docs/access_tokens/ for way to get your bot account's access token via Element.
