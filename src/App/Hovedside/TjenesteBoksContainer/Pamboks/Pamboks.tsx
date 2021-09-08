import React, { useContext, useEffect, useState } from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import { arbeidsplassenURL } from '../../../../lenker';
import TjenesteBoksBanner from '../TjenesteBoksBanner/TjenesteBoksBanner';
import PamboksIkon from './pamboks-ikon.svg';
import { LenkepanelMedLogging } from '../../../../GeneriskeElementer/LenkepanelMedLogging';

const Pamboks = () => {
    const { antallAnnonser } = useContext(OrganisasjonsDetaljerContext);
    const [stillingsAnnonseTekst, setStillingsAnnonseTekst] = useState('Lag ny stillingsannonse');

    useEffect(() => {
        if (antallAnnonser > 0) {
            setStillingsAnnonseTekst('Stillingsannonser (' + antallAnnonser + ' aktive)');
        }
    }, [antallAnnonser]);

    return (
        <div className="pamboks tjenesteboks-innhold">
            <TjenesteBoksBanner tittel="Rekruttere" imgsource={PamboksIkon} altTekst="" />
            <LenkepanelMedLogging
                className="pamboks__lenke"
                loggLenketekst="Rekruttere"
                href={arbeidsplassenURL}
                tittelProps="normaltekst"
                aria-label={'Rekruttere, finn kandidater, ' + stillingsAnnonseTekst}
            >
                <div className="pamboks-tekst">
                    <Normaltekst>Finn kandidater</Normaltekst>
                    {stillingsAnnonseTekst}
                </div>
            </LenkepanelMedLogging>
        </div>
    );
};

export default Pamboks;
