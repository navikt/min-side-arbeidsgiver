
module.exports = {
    mock: (app) => {
        app.use(
            '/min-side-arbeidsgiver/sykefravaer',
            (req, res) => {
                res.send({
                    "type": "BRANSJE",
                    "label": "Barnehager",
                    "prosent": 15.8
                })
            }
        )
    }
}