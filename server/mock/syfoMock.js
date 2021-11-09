module.exports = {
    mock: (app) => {
        app.use(
            '/mock/arbeidsplassen.nav.no/stillingsregistrering-api/api/stillinger/numberByStatus', (req, res) => {
                res.send({ tilgang: true })
            }
        );
    }
}
