
const bedriftEllerBransjeRespons = () => {
    return Math.floor(Math.random() * 2) > 0 ?
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

export const mock = (app) => {
    app.use(
        `/min-side-arbeidsgiver/api/sykefravaerstatistikk/:orgnr`,
        (req, res) => {
            res.send(bedriftEllerBransjeRespons());
        },
    );
}