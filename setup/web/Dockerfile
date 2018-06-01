FROM keymetrics/pm2:latest-alpine
ENV NPM_CONFIG_LOGLEVEL error
ARG GIT_BRANCH=master

RUN mkdir /app
RUN mkdir /data
RUN mkdir /data/config

RUN echo "[Install system libraries]" \
 && apk update \
 && apk add openssh bash git mc make gcc g++ python build-base \
 && echo "[/Install system libraries]"
RUN echo "[Checkout & build the app]" \
 && cd /app \
 && git clone -b $GIT_BRANCH --single-branch https://github.com/ChronoBank/Labor-X laborx.platform.web \
 && cd laborx.platform.web \
 && git log -1 \
 && echo "laborx.platform.web/package.json" \
 && cat package.json \
 && NODE_ENV=develop yarn --no-lockfile \
 && yarn build \
 && echo "[/Checkout & build the app]"
RUN echo "[Link config files]" \
 && rm -f /app/laborx.platform.web/ecosystem.config.js \
 && rm -rf /app/laborx.platform.web/config \
 && ln -s /data/config/config /app/laborx.platform.web/config \
 && ln -s /data/config/ecosystem.config.js /app/laborx.platform.web/ecosystem.config.js \
 && echo "[/Link config files]"

EXPOSE 3000

VOLUME /data/config

WORKDIR /app/laborx.platform.web

CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "production"]
