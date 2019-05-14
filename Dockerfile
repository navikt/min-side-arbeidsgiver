FROM node:alpine as builder

WORKDIR /app
RUN yarn add http-proxy-middleware fs-extra


FROM navikt/node-express:1.0.0
WORKDIR /app

COPY build/ build/
COPY src/server/ src/server/
COPY start.sh ./
FROM docker.adeo.no:5000/pus/decorator
ENV APPLICATION_NAME=ditt-nav-arbeidsgiver
COPY --from=builder /source/build /app


EXPOSE 3000
ENTRYPOINT ["/bin/sh", "start.sh"]

