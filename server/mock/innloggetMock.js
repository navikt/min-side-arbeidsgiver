/* Automatically picked up by react-script in development mode. */
import fetch from 'node-fetch';

export const mock = function(app) {
    app.get('/min-side-arbeidsgiver/api/innlogget', (req, res) => {
        const token = req.cookies.hasOwnProperty('selvbetjening-idtoken')
        if (token) {
            console.log("innlogget? ja (cookie selvbetjening-idtoken eksisterer)")
            res.status(200).send()
        } else {
            console.log("innlogget? nei (cookie selvbetjening-idtoken mangler)")
            res.status(401).send()
        }
    });
    app.get('/min-side-arbeidsgiver/redirect-til-login', async (req, res) => {
        const response = await fetch('https://fakedings.dev-gcp.nais.io/fake/custom', {
            method: 'POST',
            headers: {
                "Content-type": "application/x-www-form-urlencoded"
            },
            body: `sub=00112233445&aud=${encodeURIComponent("bruker-api")}&acr=Level4`
        });
        const token = await response.text()
        res.cookie("selvbetjening-idtoken", token)
        console.log(`login: setter selvbetjening-idtoken til ${token}`)
        res.redirect(req.get('referer'));
    });
}
