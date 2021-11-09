module.exports = {
    mock: (app) => {
        app.use(
            '/min-side-arbeidsgiver/mock/arbeidsplassen.nav.no/stillingsregistrering-api/api/arbeidsgiver/:id',
            (req, res) => res.sendStatus(200)
        );
        app.use(
            '/min-side-arbeidsgiver/mock/arbeidsplassen.nav.no/stillingsregistrering-api/api/stillinger/numberByStatus',
            (req, res) => {
                res.send({
                    TIL_GODKJENNING: 17,
                    GODKJENT: 0,
                    PAABEGYNT: 42,
                    TIL_AVSLUTTING: 0,
                    AVSLUTTET: 5,
                    AVVIST: 0,
                    PUBLISERT: 5,
                });
            });
    }
}