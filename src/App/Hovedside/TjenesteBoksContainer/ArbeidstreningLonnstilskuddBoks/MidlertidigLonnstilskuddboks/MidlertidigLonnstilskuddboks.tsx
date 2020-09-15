import React, { useContext } from 'react';
import Lenkepanel from 'nav-frontend-lenkepanel';
import { OrganisasjonsDetaljerContext } from '../../../../../OrganisasjonDetaljerProvider';
import TjenesteBoksBanner from '../../TjenesteBoksBanner/TjenesteBoksBanner';
import { arbeidsAvtaleLink } from '../../../../../lenker';
import { loggTjenesteTrykketPa } from '../../../../../utils/funksjonerForAmplitudeLogging';
import {
    antallAvbrutte,
    antallAvsluttede, antallGjennomfores, antallKlareOppstart,
    antallPabegynt,
    antallTilGodkjenning,
    kunAvsluttedeOgAvbrutte, lagTekstBasertPaAntall,
} from '../ArbeidstreningLonnstilskudd-utils';

const midlertidiglonnstilskuddikon = require('./midlertidig-lonnstilskudd-ikon.svg');

const MidlertidigLonnstilskuddboks = () => {
    const { midlertidigLonnstilskuddAvtaler } = useContext(OrganisasjonsDetaljerContext);

    return (
        <div className="arbeidstreningboks tjenesteboks-innhold">
            <TjenesteBoksBanner
                tittel="Midlertidig lønnstilskudd"
                imgsource={midlertidiglonnstilskuddikon}
                altTekst=""
            />

            <Lenkepanel
                className="arbeidstreningboks__info"
                href={arbeidsAvtaleLink()}
                onClick={() => loggTjenesteTrykketPa('Midlertidig lønnstilskudd', arbeidsAvtaleLink(), "Midlertidig lønnstilskudd")}
                tittelProps="normaltekst"
                linkCreator={(props: any) => <a {...props}>{props.children}</a>}
            >
                <>
                    {kunAvsluttedeOgAvbrutte(midlertidigLonnstilskuddAvtaler) ? (
                        <>
                            {lagTekstBasertPaAntall(antallAvbrutte(midlertidigLonnstilskuddAvtaler), 'er avbrutt')}
                            {lagTekstBasertPaAntall(antallAvsluttede(midlertidigLonnstilskuddAvtaler), 'er avsluttet')}
                        </>
                    ) : (
                        <>
                            {lagTekstBasertPaAntall(antallPabegynt(midlertidigLonnstilskuddAvtaler), 'er påbegynt')}
                            {lagTekstBasertPaAntall(antallTilGodkjenning(midlertidigLonnstilskuddAvtaler), 'mangler godkjenning')}
                            {lagTekstBasertPaAntall(antallKlareOppstart(midlertidigLonnstilskuddAvtaler), 'er godkjent')}
                            {lagTekstBasertPaAntall(antallGjennomfores(midlertidigLonnstilskuddAvtaler), 'gjennomføres')}
                        </>
                    )}
                </>
            </Lenkepanel>
        </div>
    );
};

export default MidlertidigLonnstilskuddboks;
