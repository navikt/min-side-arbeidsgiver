module.exports = {
    mock: (app) => {
        app.use('/min-side-arbeidsgiver/abtest', (req, res) => {
            return setTimeout(() => {
                res.send(false)
            }, 1000);
        });
    }
}