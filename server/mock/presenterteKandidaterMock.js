// https://presenterte-kandidater-api.intern.nav.no:9000/ekstern/antallkandidater?virksomhetsnummer=XXX
export const mock = (app) => {
    app.use(
        '/min-side-arbeidsgiver/presenterte-kandidater-api/ekstern/antallkandidater',
        (req, res) => {
            if (Math.random() < 0.1) {
                res.sendStatus(502);
            } else {
                res.send({
                    antallKandidater: Math.floor(Math.random() * 10),
                });
            }
        }
    );
};
