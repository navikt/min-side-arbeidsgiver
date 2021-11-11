const { randomInt } = require('crypto');

const bedriftEllerBransjeRespons = () => {
    return randomInt(2) > 0 ?
        {
            'type': 'BRANSJE',
            'label': 'Barnehager',
            'prosent': 15.8,
        } :
        {
            'type': 'VIRKSOMHET',
            'label': 'MAURA OG KOLBU REGNSKAP',
            'prosent': 10.4,
        };

};

module.exports = {
    mock: (app) => {
        app.use(
            '/min-side-arbeidsgiver/sykefravaer',
            (req, res) => {
                res.send(bedriftEllerBransjeRespons());
            },
        );
    },
};