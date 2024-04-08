export const mock = (app) => {
    app.use('/min-side-arbeidsgiver/api/kontonummerStatus/v1', (req, res) => {
        res.send({
            status: Math.random() < 0.1 ? 'MANGLER_KONTONUMMER' : 'OK',
        });
    });
};
