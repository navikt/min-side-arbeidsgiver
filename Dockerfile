FROM navikt/node-express:1.0.0

WORKDIR /app

COPY src/ src/
COPY public/ public/
COPY server.js server.js
COPY package.json package.json
COPY craco.config.js craco.config.js
COPY tsconfig.json tsconfig.json

RUN npm install
RUN npm run build

EXPOSE 3000
