import React, { useContext, useEffect, useState } from 'react';
import Lenkepanel from 'nav-frontend-lenkepanel';
import { Normaltekst } from 'nav-frontend-typografi';
import { OrganisasjonsDetaljerContext } from '../../../../OrganisasjonDetaljerProvider';
import { Arbeidsavtale } from '../../../../api/dnaApi';
import TjenesteBoksBanner from '../TjenesteBoksBanner/TjenesteBoksBanner';
import { arbeidsAvtaleLink } from '../../../../lenker';
import { loggTjenesteTrykketPa } from '../../../../utils/funksjonerForAmplitudeLogging';
import './Arbeidstreningboks.less';

const arbeidstreningikon = require('./koffert-tiltak.svg');

const loggAtKlikketPaArbeidstrening = () => {
    loggTjenesteTrykketPa('Arbeidstrening');
};

const lagTekstBasertPaAntall = (antall: number, typeTekst: string) => {
    if (antall === 0) {
        return;
    } else if (antall === 1) {
        return <Normaltekst>{`1 avtale ${typeTekst}`}</Normaltekst>;
    } else {
        return <Normaltekst>{`${antall} avtaler ${typeTekst}`}</Normaltekst>;
    }
};

const Arbeidstreningboks = () => {
    const { arbeidsavtaler } = useContext(OrganisasjonsDetaljerContext);
    const [kunAvsluttedeOgAvbrutte, setKunAvsluttedeOgAvbrutte] = useState<boolean>(false);

    const antallAvtalerPerStatus = (status: string): number =>
        arbeidsavtaler.filter((arbeidsavtale: Arbeidsavtale) => arbeidsavtale.status === status)
            .length;

    const antallKlareOppstart: number = antallAvtalerPerStatus('Klar for oppstart');
    const antallTilGodkjenning: number = antallAvtalerPerStatus('Mangler godkjenning');
    const antallPabegynt: number = antallAvtalerPerStatus('Påbegynt');
    const antallGjennomfores: number = antallAvtalerPerStatus('Gjennomføres');
    const antallAvbrutte: number = antallAvtalerPerStatus('Avbrutt');
    const antallAvsluttede: number = antallAvtalerPerStatus('Avsluttet');

    useEffect(() => {
        if (
            arbeidsavtaler.every(
                (arbeidsavtale: Arbeidsavtale) =>
                    arbeidsavtale.status === 'Avsluttet' || arbeidsavtale.status === 'Avbrutt'
            )
        ) {
            setKunAvsluttedeOgAvbrutte(true);
        }
    }, [arbeidsavtaler]);

    return (
        <div onClick={loggAtKlikketPaArbeidstrening} className="arbeidstreningboks">
            <TjenesteBoksBanner
                tittel="Arbeidstrening"
                imgsource={arbeidstreningikon}
                altTekst=""
            />

            <Lenkepanel
                className="arbeidstreningboks__info"
                href={arbeidsAvtaleLink()}
                tittelProps="normaltekst"
                linkCreator={(props: any) => <a {...props}>{props.children}</a>}
            >
                <>
                    {kunAvsluttedeOgAvbrutte ? (
                        <>
                            {lagTekstBasertPaAntall(antallAvbrutte, 'er avbrutt')}
                            {lagTekstBasertPaAntall(antallAvsluttede, 'er avsluttet')}
                        </>
                    ) : (
                        <>
                            {lagTekstBasertPaAntall(antallPabegynt, 'er påbegynt')}
                            {lagTekstBasertPaAntall(antallTilGodkjenning, 'mangler godkjenning')}
                            {lagTekstBasertPaAntall(antallKlareOppstart, 'er godkjent')}
                            {lagTekstBasertPaAntall(antallGjennomfores, 'gjennomføres')}
                        </>
                    )}
                    {arbeidsavtaler.length === 0 &&
                    <Normaltekst> Gi arbeidssøker mulighet til å prøve seg i arbeid, få relevant erfaring og skaffe seg en ordinær jobb.</Normaltekst>}
                </>
            </Lenkepanel>
        </div>
    );
};

export default Arbeidstreningboks;
