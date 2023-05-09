import {Issuer, errors} from 'openid-client';

const {
    TOKEN_X_WELL_KNOWN_URL,
    TOKEN_X_CLIENT_ID,
    TOKEN_X_PRIVATE_JWK
} = process.env;

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

const createTokenXClient = async () => {
    const issuer = await Issuer.discover(TOKEN_X_WELL_KNOWN_URL);
    return new issuer.Client(
        {
            client_id: TOKEN_X_CLIENT_ID,
            token_endpoint_auth_method: 'private_key_jwt',
        },
        {keys: [JSON.parse(TOKEN_X_PRIVATE_JWK)]}
    );
};

/**
 * onProxyReq does not support async, so using middleware for tokenx instead
 * ref: https://github.com/chimurai/http-proxy-middleware/issues/318
 */
export const tokenXMiddleware = (
    {
        audience,
        tokenXClientPromise = audience ? createTokenXClient() : null,
        log
    }
) => async (req, res, next) => {
    try {
        if (!audience) {
            next();
            return;
        }

        const subject_token = (req.headers.authorization || '').replace('Bearer', '').trim();
        if (subject_token === '') {
            log.info("no authorization header found, skipping tokenx.")
            next();
            return;
        }
        const {access_token} = await exchangeToken(await tokenXClientPromise, {
            subject_token,
            audience
        });
        req.headers.authorization = `Bearer ${access_token}`;
        log.info("tokenx completed. authorization header is set.")
        next();
    } catch (err) {
        if (err instanceof errors.OPError) {
            log.info(`token exchange feilet ${err.message}`, err);
            res.status(401).send();
        } else {
            next(err);
        }
    }
};