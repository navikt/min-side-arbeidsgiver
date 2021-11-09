module.exports = {
    mock: (app) => {
        app.use(
            '/min-side-arbeidsgiver/mock/arbeidsplassen.nav.no/stillingsregistrering-api/api/stillinger/numberByStatus', (req, res) => {
                res.send({ tilgang: true })
            }
        );
    }
}
