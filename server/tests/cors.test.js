import express from 'express';
import { remoteStorageCorsMiddleware } from '../middlewares/cors.js';
import request from 'supertest';

let server;
let app;

const gyldigOrigin = "https://gyldig-subdomene.nav.no"
const ugyldigOrigin = "https://ugyldig.domene.no"

beforeAll(() => {
    app = express();
    app.use('/min-side-arbeidsgiver/api/storage', remoteStorageCorsMiddleware({
        allowedCorsOrigins: [gyldigOrigin],
        log: null
    }), (req, res, _) => {
        res.status(200).send('ok');
    });
    const port = 3000;
    server = app.listen(port);
});

afterAll(() => {
    server.close();
});

describe('med gyldig origin header', () => {
    it('CORS headers blir satt ved PREFLIGHT', () => {
        return request(app)
            .options(`/min-side-arbeidsgiver/api/storage`)
            .set('Origin', gyldigOrigin)
            .set('Access-Control-Request-Method', 'GET')
            .expect('Access-Control-Allow-Origin', gyldigOrigin)
            .expect('Access-Control-Allow-Credentials', 'true')
            .expect('Access-Control-Allow-Methods', 'GET,PUT,DELETE,OPTIONS')
            .expect('Access-Control-Allow-Headers', 'Accept,Accept-Language,Content-Language,Content-Type,Range')
            .expect('Access-Control-Expose-Headers', 'Cache-Control,Content-Language,Content-Length,Content-Type,Expires,Last-Modified,Pragma')
            .expect('Access-Control-Max-Age', '3600')
            .expect(200)
    });

    it('CORS headers blir satt ved GET', () => {
        return request(app)
            .get(`/min-side-arbeidsgiver/api/storage`)
            .set('Origin', gyldigOrigin)
            .set('Access-Control-Request-Method', 'GET')
            .expect('Access-Control-Allow-Origin', gyldigOrigin)
            .expect('Access-Control-Allow-Credentials', 'true')
            .expect(200)
    })

    it('CORS headers blir satt ved PUT', () => {
        return request(app)
            .put(`/min-side-arbeidsgiver/api/storage`)
            .set('Origin', gyldigOrigin)
            .expect('Access-Control-Allow-Origin', gyldigOrigin)
            .expect('Access-Control-Allow-Credentials', 'true')
            .expect(200)
    })

    it('CORS headers blir satt ved DELETE', () => {
        return request(app)
            .delete(`/min-side-arbeidsgiver/api/storage`)
            .set('Origin', gyldigOrigin)
            .expect('Access-Control-Allow-Origin', gyldigOrigin)
            .expect('Access-Control-Allow-Credentials', 'true')
            .expect(200)
    })

    it('CORS headers blir ikke satt ved POST', async () => {
        const res = await request(app)
            .post(`/min-side-arbeidsgiver/api/storage`)
            .set('Origin', gyldigOrigin)
            .expect(403, 'Forbidden by CORS policy')
        expect(res.headers['access-control-allow-origin']).toBeUndefined();
        expect(res.headers['access-control-allow-credentials']).toBeUndefined();
    })
});

describe('med ugyldig origin', () => {
    it('CORS headers blir ikke satt ved PREFLIGHT', async () => {
        const res = await request(app)
            .options(`/min-side-arbeidsgiver/api/storage`)
            .set('Origin', ugyldigOrigin)
            .expect(403, 'Forbidden by CORS policy')
        expect(res.headers['access-control-allow-origin']).toBeUndefined();
        expect(res.headers['access-control-allow-credentials']).toBeUndefined();
        expect(res.headers['access-control-allow-methods']).toBeUndefined();
        expect(res.headers['access-control-allow-headers']).toBeUndefined();
        expect(res.headers['access-control-expose-headers']).toBeUndefined();
        expect(res.headers['access-control-max-age']).toBeUndefined();
    })

    it('CORS headers blir ikke satt ved GET', async () => {
        const res = await request(app)
            .get(`/min-side-arbeidsgiver/api/storage`)
            .set('Origin', ugyldigOrigin)
            .expect(403, 'Forbidden by CORS policy')
        expect(res.headers['access-control-allow-origin']).toBeUndefined();
        expect(res.headers['access-control-allow-credentials']).toBeUndefined();
    })

    it('CORS headers blir ikke satt ved PUT', async () => {
        const res = await request(app)
            .put(`/min-side-arbeidsgiver/api/storage`)
            .set('Origin', ugyldigOrigin)
            .expect(403, 'Forbidden by CORS policy')
        expect(res.headers['access-control-allow-origin']).toBeUndefined();
        expect(res.headers['access-control-allow-credentials']).toBeUndefined();
    })

    it('CORS headers blir ikke satt ved DELETE', async () => {
        const res = await request(app)
            .delete(`/min-side-arbeidsgiver/api/storage`)
            .set('Origin', ugyldigOrigin)
            .expect(403, 'Forbidden by CORS policy')
        expect(res.headers['access-control-allow-origin']).toBeUndefined();
        expect(res.headers['access-control-allow-credentials']).toBeUndefined();
    })

    it('CORS headers blir ikke satt ved POST', async () => {
        const res = await request(app)
            .post(`/min-side-arbeidsgiver/api/storage`)
            .set('Origin', ugyldigOrigin)
            .expect(403, 'Forbidden by CORS policy')
        expect(res.headers['access-control-allow-origin']).toBeUndefined();
        expect(res.headers['access-control-allow-credentials']).toBeUndefined();
    })
});

describe('med tom origin header', () => {
    it('returnerer 401 ved tom origin header', async () => {
        const res = await request(app)
            .options(`/min-side-arbeidsgiver/api/storage`)
            .expect(401, "Missing origin header");
        expect(res.headers['access-control-allow-origin']).toBeUndefined();
        expect(res.headers['access-control-allow-credentials']).toBeUndefined();
        expect(res.headers['access-control-allow-methods']).toBeUndefined();
        expect(res.headers['access-control-allow-headers']).toBeUndefined();
        expect(res.headers['access-control-expose-headers']).toBeUndefined();
        expect(res.headers['access-control-max-age']).toBeUndefined();
    })
});
