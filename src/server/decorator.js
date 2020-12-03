const jsdom = require('jsdom');
const request = require('request');
const NodeCache = require('node-cache');
const { JSDOM } = jsdom;

const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = SECONDS_PER_MINUTE * 60;

// Refresh cache every hour
const cache = new NodeCache({
    stdTTL: SECONDS_PER_HOUR,
    checkperiod: SECONDS_PER_MINUTE,
});

const url =
    process.env.NAIS_CLUSTER_NAME === 'prod-sbs'
    ? 'https://www.nav.no/dekoratoren/?context=arbeidsgiver&redirectToApp=true&chatbot=true&level=Level4'
    : process.env.DECORATOR_EXTERNAL_URL || 'https://www.nav.no/dekoratoren/?context=arbeidsgiver&redirectToApp=true&chatbot=true&level=Level4'
;

const getDecorator = () =>
    new Promise((resolve, reject) => {
        const cacheData = cache.get('main-cache');
        if (cacheData) {
            resolve(cacheData);
        } else {
            request(url, (error, response, body) => {
                if (!error && response.statusCode >= 200 && response.statusCode < 400) {
                    const { document } = new JSDOM(body).window;
                    const prop = 'innerHTML';
                    const data = {
                        HEADER: document.getElementById('header-withmenu')[prop],
                        FOOTER: document.getElementById('footer-withmenu')[prop],
                        STYLES: document.getElementById('styles')[prop],
                        SCRIPTS: document.getElementById('scripts')[prop],
                    };
                    cache.set('main-cache', data);
                    console.log(`Creating cache`);
                    resolve(data);
                } else {
                    const errorData = `url: ${url}, error: ${error}, body: ${body}`;
                    reject(new Error(`Failed to fetch decorator - ${errorData}`));
                }
            });
        }
    });

module.exports = getDecorator;