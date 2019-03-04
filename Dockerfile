FROM navikt/node-express:1.0.0

WORKDIR /app

COPY src/ src/
COPY public/ public/
COPY server.js server.js
COPY package.json package.json
COPY craco.config.js craco.config.js
COPY tsconfig.json tsconfig.json

RUN yarn
RUN yarn build

EXPOSE 3000
