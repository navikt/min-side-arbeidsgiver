export const mock = (app) => {
    app.use('/min-side-arbeidsgiver/antall-arbeidsforhold', (req, res) => {
        const antall = 502;
        const missing = Math.floor(Math.random() * 10) === 0;
        setTimeout(() => {
            res.send({ first: '131488434', second: missing ? -1 : antall });
        }, 1000);
    });
};
