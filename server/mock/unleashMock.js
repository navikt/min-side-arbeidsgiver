module.exports = {
    mock: (app) => {
        app.use(
            '/min-side-arbeidsgiver/api/feature',
            (req, res) => res.send({"msa.visMoteKalender": true})
        );
    }
}
