module.exports = {
    mock: (app) => {
        app.use(
            '/min-side-arbeidsgiver/api/feature?feature=msa.visMoteKalender',
            (req, res) => res.send({"msa.visMoteKalender": true})
        );
    }
}
