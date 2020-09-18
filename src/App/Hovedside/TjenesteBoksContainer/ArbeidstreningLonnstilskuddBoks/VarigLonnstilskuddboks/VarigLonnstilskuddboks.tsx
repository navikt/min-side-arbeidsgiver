import React, { useContext } from 'react';
import Lenkepanel from 'nav-frontend-lenkepanel';
import { OrganisasjonsDetaljerContext } from '../../../../../OrganisasjonDetaljerProvider';
import TjenesteBoksBanner from '../../TjenesteBoksBanner/TjenesteBoksBanner';
import { arbeidsAvtaleLink } from '../../../../../lenker';
import { loggTjenesteTrykketPa } from '../../../../../utils/funksjonerForAmplitudeLogging';
import {
    antallAvbrutte,
    antallAvsluttede, antallGjennomfores, antallKlareOppstart,
    antallPabegynt, antallTilGodkjenning,
    kunAvsluttedeOgAvbrutte,
    lagTekstBasertPaAntall,
} from '../ArbeidstreningLonnstilskudd-utils';

const variglonnstilskuddikon = require('./varig-lonnstilskudd-ikon.svg');

const VarigLonnstilskuddboks = () => {
    const { varigLonnstilskuddAvtaler } = useContext(OrganisasjonsDetaljerContext);
    return (
        <div className="arbeidstreningboks tjenesteboks-innhold">
            <TjenesteBoksBanner
                tittel="Varig lønnstilskudd"
                imgsource={variglonnstilskuddikon}
                altTekst=""
            />

            <Lenkepanel
                className="arbeidstreningboks__info"
                href={arbeidsAvtaleLink}
                onClick={() => loggTjenesteTrykketPa('Varig lønnstilskudd', arbeidsAvtaleLink,"Varig lønnstilskudd" )}
                tittelProps="normaltekst"
                linkCreator={(props: any) => <a {...props}>{props.children}</a>}
            >
                <>
                    {kunAvsluttedeOgAvbrutte(varigLonnstilskuddAvtaler) ? (
                        <>
                            {lagTekstBasertPaAntall(antallAvbrutte(varigLonnstilskuddAvtaler), 'er avbrutt')}
                            {lagTekstBasertPaAntall(antallAvsluttede(varigLonnstilskuddAvtaler), 'er avsluttet')}
                        </>
                    ) : (
                        <>
                            {lagTekstBasertPaAntall(antallPabegynt(varigLonnstilskuddAvtaler), 'er påbegynt')}
                            {lagTekstBasertPaAntall(antallTilGodkjenning(varigLonnstilskuddAvtaler), 'mangler godkjenning')}
                            {lagTekstBasertPaAntall(antallKlareOppstart(varigLonnstilskuddAvtaler), 'er godkjent')}
                            {lagTekstBasertPaAntall(antallGjennomfores(varigLonnstilskuddAvtaler), 'gjennomføres')}
                        </>
                    )}
                </>
            </Lenkepanel>
        </div>
    );
};

export default VarigLonnstilskuddboks;
