import React, { useContext, useEffect, useState } from 'react';
import Lenkepanel from 'nav-frontend-lenkepanel';
import { Normaltekst } from 'nav-frontend-typografi';
import { OrganisasjonsDetaljerContext } from '../../../../OrganisasjonDetaljerProvider';
import { linkTilArbeidsplassen } from '../../../../lenker';
import TjenesteBoksBanner from '../TjenesteBoksBanner/TjenesteBoksBanner';
import { loggTjenesteTrykketPa } from '../../../../utils/funksjonerForAmplitudeLogging';
import ArbeidsplassenIkon from './Arbeidsplassen-ikon';
import './Pamboks.less';

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
        <div onClick={loggAtKlikketPaArbeidstrening} className="pamboks">
            <TjenesteBoksBanner tittel="Rekruttere" imgsource={PamboksIkon} altTekst="" />
            <Lenkepanel
                className="pamboks__lenke"
                href={linkTilArbeidsplassen()}
                tittelProps="normaltekst"
                border={false}
            >
                <div className="pamboks-tekst">
                    <Normaltekst>Finn kandidater</Normaltekst>
                    {stillingsAnnonseTekst}
                </div>
                <div className="pamboks-logo">
                    <ArbeidsplassenIkon />
                </div>
            </Lenkepanel>
        </div>
    );
};

export default Pamboks;
