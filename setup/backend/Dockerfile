FROM keymetrics/pm2:latest-alpine
ENV NPM_CONFIG_LOGLEVEL error
ARG GIT_BRANCH=master

RUN mkdir /app
RUN mkdir /data
RUN mkdir /data/config
RUN mkdir /data/files

RUN echo "[Install system libraries]" \
 && apk update \
 && apk add openssh bash git mc make gcc g++ python build-base \
 && echo "[/Install system libraries]"
RUN echo "[Checkout & build the app]" \
 && cd /app \
 && git clone -b $GIT_BRANCH --single-branch https://github.com/ipavlenko/Labor-X-Backend laborx.platform.backend \
 && cd laborx.platform.backend \
 && git log -1 \
 && echo "laborx.platform.backend/package.json" \
 && cat package.json \
 && yarn --no-lockfile \
 && echo "[/Checkout & build the app]"
RUN echo "[Link config files]" \
 && rm -f /app/laborx.platform.backend/ecosystem.config.js \
 && rm -rf /app/laborx.platform.backend/config \
 && ln -s /data/config/config /app/laborx.platform.backend/config \
 && ln -s /data/config/ecosystem.config.js /app/laborx.platform.backend/ecosystem.config.js \
 && echo "[/Link config files]"

EXPOSE 3000

VOLUME /data/config /data/files

WORKDIR /app/laborx.platform.backend

CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "production"]
