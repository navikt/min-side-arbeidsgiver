import React, { useContext, useEffect, useState } from 'react';
import Lenkepanel from 'nav-frontend-lenkepanel';
import { Normaltekst } from 'nav-frontend-typografi';
import { OrganisasjonsDetaljerContext } from '../../../../OrganisasjonDetaljerProvider';
import { linkTilArbeidsplassen } from '../../../../lenker';
import TjenesteBoksBanner from '../TjenesteBoksBanner/TjenesteBoksBanner';
import { loggTjenesteTrykketPa } from '../../../../utils/funksjonerForAmplitudeLogging';

const PamboksIkon = require('./pamboks-ikon.svg');

const Pamboks = () => {
    const { antallAnnonser } = useContext(OrganisasjonsDetaljerContext);
    const [stillingsAnnonseTekst, setStillingsAnnonseTekst] = useState('Lag ny stillingsannonse');

    useEffect(() => {
        if (antallAnnonser > 0) {
            setStillingsAnnonseTekst('Stillingsannonser (' + antallAnnonser + ' aktive)');
        }
    }, [antallAnnonser]);

    const loggAtKlikketPaArbeidstrening = () => {
        loggTjenesteTrykketPa('PAM');
    };

    return (
        <div className="pamboks tjenesteboks-innhold">
            <TjenesteBoksBanner tittel="Rekruttere" imgsource={PamboksIkon} altTekst="" />
            <Lenkepanel
                className="pamboks__lenke"
                href={linkTilArbeidsplassen()}
                onClick={loggAtKlikketPaArbeidstrening}
                tittelProps="normaltekst"
                border={false}
                aria-label={'Rekruttere, finn kandidater, ' + stillingsAnnonseTekst}
            >
                <div className="pamboks-tekst">
                    <Normaltekst>Finn kandidater</Normaltekst>
                    {stillingsAnnonseTekst}
                </div>
            </Lenkepanel>
        </div>
    );
};

export default Pamboks;
