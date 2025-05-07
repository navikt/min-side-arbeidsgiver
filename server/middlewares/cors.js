const allowedMethods = ['GET', 'PUT', 'DELETE', 'OPTIONS'];
const allowedCorsHeaders = [
    'Accept',
    'Accept-Language',
    'Content-Language',
    'Content-Type',
    'Range',
];
const exposeCorsHeaders = [
    'Cache-Control',
    'Content-Language',
    'Content-Length',
    'Content-Type',
    'Expires',
    'Last-Modified',
    'Pragma',
];

function setPreflightCorsHeaders(origin, res) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Methods', allowedMethods.join(','));
    res.setHeader('Access-Control-Allow-Headers', allowedCorsHeaders.join(','));
    res.setHeader('Access-Control-Expose-Headers', exposeCorsHeaders.join(','));
    res.setHeader('Access-Control-Max-Age', '3600'); // 1 hour
}

function isValidCorsRequest(allowedOrigins, origin, method) {
    return allowedOrigins.includes(origin) && allowedMethods.includes(method);
}

function handleCorsPreflightRequest(origin, res) {
    setPreflightCorsHeaders(origin, res);
    res.status(200).send('OK');
}

function handleCorsMainRequest(origin, res, next) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', true);
    return next();
}

export const remoteStorageCorsMiddleware =
    ({ allowedCorsOrigins, log }) =>
    (req, res, next) => {
        const origin = req.headers["origin"]
        if (!origin) {
            res.status(401).send('Missing origin header');
            log.warn(`CORS: Missing origin header in request`);
            return;
        }

        if (!isValidCorsRequest(allowedCorsOrigins, origin, req.method)) {
            log?.warn(
                `CORS: Invalid CORS request. Origin: ${origin} Method: ${req.method}`
            );
            res.status(403).send('Forbidden by CORS policy');
        } else {
            return req.method === 'OPTIONS'
                ? handleCorsPreflightRequest(origin, res)
                : handleCorsMainRequest(origin, res, next);
        }
    };
