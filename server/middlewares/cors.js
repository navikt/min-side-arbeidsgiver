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
const allowedMethods = ['GET', 'PUT', 'DELETE'];
const originRegex = /^https:\/\/([a-z0-9-]+\.)+nav\.no$/;

function setPreflightCorsHeaders(origin, res) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Methods', allowedMethods.join(','));
    res.setHeader('Access-Control-Allow-Headers', allowedCorsHeaders.join(','));
    res.setHeader('Access-Control-Expose-Headers', exposeCorsHeaders.join(','));
    res.setHeader('Access-Control-Max-Age', '3600'); // 1 hour
}6

function preflightMiddleware(req, res, _) {
    const origin = req.headers.origin;
    if (originRegex.test(origin)) {
        setPreflightCorsHeaders(origin, res);
    }
    res.status(200).send('OK');
}

function regularMiddleware(req, res, next) {
    const origin = req.headers.origin;
    if (originRegex.test(origin) && allowedMethods.includes(req.method)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Credentials', true);
    }
    return next();
}

export const remoteStorageCorsMiddleware = (req, res, next) => {
    if (!req.headers.origin) {
        res.status(401).send('Missing origin header');
    }

    return req.method === 'OPTIONS'
        ? preflightMiddleware(req, res, next)
        : regularMiddleware(req, res, next);
};
