export const mock = function (app) {
    app.get('/min-side-arbeidsgiver/api/innlogget', (req, res) => {
        res.status(200).send();
    });
    app.get('/min-side-arbeidsgiver/redirect-til-login', async (req, res) => {
        res.redirect(req.get('referer'));
    });
};
