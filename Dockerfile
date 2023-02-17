FROM navikt/node-express:16

WORKDIR /usr/src/app
COPY build/ build/
COPY server/ server/
COPY bruker.graphql .

WORKDIR /usr/src/app/server
USER root
RUN npm ci
USER apprunner

EXPOSE 8080
ENTRYPOINT ["node", "server.js"]