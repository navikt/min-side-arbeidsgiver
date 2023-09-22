const sessions = {};
export const mock = function (app) {
    app.get('/min-side-arbeidsgiver/api/innlogget', (req, res) => {
        const token = sessions[req.ip];
        if (token) {
            console.log('innlogget? ja (session eksisterer)');
            res.status(200).send();
        } else {
            console.log('innlogget? nei (session mangler)');
            res.status(401).send();
        }
    });
    app.get('/min-side-arbeidsgiver/redirect-til-login', async (req, res) => {
        const response = await fetch('https://fakedings.intern.dev.nav.no/fake/custom', {
            method: 'POST',
            headers: {
                'Content-type': 'application/x-www-form-urlencoded',
            },
            body: `sub=00112233445&aud=${encodeURIComponent('bruker-api')}&acr=Level4`,
        });
        const token = await response.text();
        sessions[req.ip] = token;
        console.log(`login: setter session til ${token}`);
        res.redirect(req.get('referer'));
    });
};
