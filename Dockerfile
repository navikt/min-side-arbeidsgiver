FROM navikt/node-express:16

WORKDIR /usr/src/app

COPY build/ build/

WORKDIR /usr/src/app/server
COPY server/ .

USER root
RUN npm ci
USER apprunner

EXPOSE 3000
ENTRYPOINT ["node", "server.js"]