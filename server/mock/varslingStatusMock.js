import casual from 'casual';

export const mock = (app) => {
    app.use('/min-side-arbeidsgiver/api/varslingStatus/v1', (req, res) => {
        res.send({
            status: Math.random() < 0.1 ? 'MANGLER_KOFUVI' : 'OK',
            varselTimestamp: '2021-01-01T00:00:00',
            kvittertEventTimestamp: '2021-01-04T00:00:00Z',
        });
    });
};
