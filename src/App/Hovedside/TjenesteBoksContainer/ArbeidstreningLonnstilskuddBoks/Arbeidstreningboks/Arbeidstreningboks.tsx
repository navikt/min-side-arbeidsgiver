import React, { useContext } from 'react';
import Lenkepanel from 'nav-frontend-lenkepanel';
import { OrganisasjonsDetaljerContext } from '../../../../OrganisasjonDetaljerProvider';
import TjenesteBoksBanner from '../../TjenesteBoksBanner/TjenesteBoksBanner';
import { arbeidsAvtaleLink } from '../../../../../lenker';
import { loggTjenesteTrykketPa } from '../../../../../utils/funksjonerForAmplitudeLogging';
import {
    antallAvbrutte, antallAvsluttede,
    antallGjennomfores,
    antallKlareOppstart, antallPabegynt,
    antallTilGodkjenning, kunAvsluttedeOgAvbrutte,
    lagTekstBasertPaAntall,
} from '../ArbeidstreningLonnstilskudd-utils';

const arbeidstreningikon = require('./arbeidstreningboks-ikon.svg');

const Arbeidstreningboks = () => {
    const { arbeidstreningsavtaler} = useContext(OrganisasjonsDetaljerContext);

    return (
        <div className="arbeidstreningboks tjenesteboks-innhold">
            <TjenesteBoksBanner
                tittel="Arbeidstrening"
                imgsource={arbeidstreningikon}
                altTekst=""
            />

            <Lenkepanel
                className="arbeidstreningboks__info"
                href={arbeidsAvtaleLink}
                onClick={() => loggTjenesteTrykketPa('Arbeidstrening', arbeidsAvtaleLink, "Arbeidstrening")}
                tittelProps="normaltekst"
                linkCreator={(props: any) => <a {...props}>{props.children}</a>}
            >
                <>
                    {kunAvsluttedeOgAvbrutte(arbeidstreningsavtaler) ? (
                        <>
                            {lagTekstBasertPaAntall(antallAvbrutte(arbeidstreningsavtaler), 'er avbrutt')}
                            {lagTekstBasertPaAntall(antallAvsluttede(arbeidstreningsavtaler), 'er avsluttet')}
                        </>
                    ) : (
                        <>
                            {lagTekstBasertPaAntall(antallPabegynt(arbeidstreningsavtaler), 'er påbegynt')}
                            {lagTekstBasertPaAntall(antallTilGodkjenning(arbeidstreningsavtaler), 'mangler godkjenning')}
                            {lagTekstBasertPaAntall(antallKlareOppstart(arbeidstreningsavtaler), 'er godkjent')}
                            {lagTekstBasertPaAntall(antallGjennomfores(arbeidstreningsavtaler), 'gjennomføres')}
                        </>
                    )}
                </>
            </Lenkepanel>
        </div>
    );
};

export default Arbeidstreningboks;
