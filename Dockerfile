## `wrtc` does not easily work with alpine
FROM node:17-slim AS builder
WORKDIR /app

COPY package* yarn.lock ./
RUN yarn install

COPY . .
RUN yarn run build


FROM node:17-slim
WORKDIR /app
LABEL org.opencontainers.image.url='https://github.com/IndeedNotJames/matrix-sip-bridge' \
      org.opencontainers.image.source='https://github.com/IndeedNotJames/matrix-sip-bridge.git' \
      org.opencontainers.image.licenses='AGPL-3.0'

COPY package* yarn.lock ./
RUN yarn install --production \
 && yarn cache clean

COPY --from=builder /app/dist ./dist
USER node

CMD ["yarn", "run", "start"]
