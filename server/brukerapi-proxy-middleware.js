import {Issuer, errors} from 'openid-client';
import expressHttpProxy from 'express-http-proxy';

/**
 * @param {("prod-gcp"|"dev-gcp")} targetCluster
 * @param tokenXClientPromise
 * @param target
 * @param logProvider
 */
const createNotifikasjonBrukerApiProxyMiddleware = (
    {
        targetCluster = process.env?.NAIS_CLUSTER_NAME,
        target = 'http://notifikasjon-bruker-api.fager.svc.cluster.local',
        tokenXClientPromise = createTokenXClient(),
        log,
    }
) => {
    const audience = `${targetCluster}:fager:notifikasjon-bruker-api`;
    return expressHttpProxy(target, {
        proxyReqPathResolver: () => '/api/graphql',
        proxyReqOptDecorator: async (options, req) => {
            const tokenXClient = await tokenXClientPromise;
            const subject_token = req.cookies['selvbetjening-idtoken'];
            const {access_token} = await exchangeToken(tokenXClient, {subject_token, audience});

            options.headers.Authorization = `Bearer ${access_token}`;
            return options;
        },
        proxyErrorHandler: (err, res, next) => {
            if (err instanceof errors.OPError) {
                log.error(`token exchange feilet ${err.message}`);
                res.status(401).send();
            } else {
                next(err);
            }
        }
    });
}

const exchangeToken = async (tokenxClient, {subject_token, audience}) => {
    return await tokenxClient.grant(
        {
            grant_type: 'urn:ietf:params:oauth:grant-type:token-exchange',
            client_assertion_type: 'urn:ietf:params:oauth:client-assertion-type:jwt-bearer',
            subject_token_type: 'urn:ietf:params:oauth:token-type:jwt',
            audience,
            subject_token,
        },
        {
            clientAssertionPayload: {
                nbf: Math.floor(Date.now() / 1000),
                // TokenX only allows a single audience
                aud: [tokenxClient?.issuer.metadata.token_endpoint],
            },
        }
    );
};

const createTokenXClient = async (config = {
    discoveryUrl: process.env.TOKEN_X_WELL_KNOWN_URL,
    clientID: process.env.TOKEN_X_CLIENT_ID,
    privateJwk: process.env.TOKEN_X_PRIVATE_JWK,
}) => {
    const issuer = await Issuer.discover(config.discoveryUrl);
    return new issuer.Client(
        {
            client_id: config.clientID,
            token_endpoint_auth_method: 'private_key_jwt',
        },
        {keys: [JSON.parse(config.privateJwk)]}
    );
};

export {
    createNotifikasjonBrukerApiProxyMiddleware,
    createTokenXClient,
    exchangeToken
};