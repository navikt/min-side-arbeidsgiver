module.exports = {
    mock: (app) => {
        app.use('/min-side-arbeidsgiver/api/antall-arbeidsforhold', (req, res) => {
            const antall = 502;
            const missing = Math.floor(Math.random() * Math.floor(10)) === 0;
            setTimeout(() => {
                res.send({first: '910825518', second: missing ? -1 : antall})
            }, 1000);
        });
    }
};