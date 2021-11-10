module.exports = {
    mock: (app) => {
        app.use(
            '/min-side-arbeidsgiver/api/narmesteleder', (req, res) => {
                res.send({ tilgang: true })
            }
        );
    }
}
