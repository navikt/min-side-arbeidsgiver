FROM gcr.io/distroless/nodejs20-debian11

WORKDIR /usr/src/app
COPY build/ build/
COPY server/ server/
COPY bruker.graphql .

WORKDIR /usr/src/app/server
USER apprunner

EXPOSE 8080
CMD ["server.js"]