import { getToken, requestOboToken, validateToken } from '@navikt/oasis';

/**
 * onProxyReq does not support async, so using middleware for tokenx instead
 * ref: https://github.com/chimurai/http-proxy-middleware/issues/318
 */
export const tokenXMiddleware =
    ({ audience, log }) =>
    async (req, res, next) => {
        try {
            if (!audience) {
                next();
                return;
            }

            const subject_token = getToken(req);
            if (subject_token === '') {
                log.info('no subject_token found, skipping tokenx.');
                next();
                return;
            }

            const validation = await validateToken(subject_token);
            if (!validation.ok) {
                log.info('unauthorized request. subject_token is invalid.');
                res.status(401).send();
                return;
            }

            const obo = await requestOboToken(subject_token, audience);
            if (!obo.ok) {
                log.error('token exchange failed. could not obtain obo token.');
                res.status(401).send();
                return;
            }
            req.headers.authorization = `Bearer ${obo.token}`;
            next();
        } catch (err) {
            next(err);
        }
    };
