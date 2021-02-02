import React, { useContext, useEffect, useState } from 'react';
import Lenkepanel from 'nav-frontend-lenkepanel';
import { Normaltekst } from 'nav-frontend-typografi';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import { linkTilArbeidsplassen } from '../../../../lenker';
import { loggTjenesteTrykketPa } from '../../../../utils/funksjonerForAmplitudeLogging';
import TjenesteBoksBanner from '../TjenesteBoksBanner/TjenesteBoksBanner';
import PamboksIkon from './pamboks-ikon.svg';

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
            <Lenkepanel
                className="pamboks__lenke"
                href={linkTilArbeidsplassen}
                onClick={() => loggTjenesteTrykketPa('PAM', linkTilArbeidsplassen, 'Rekruttere')}
                tittelProps="normaltekst"
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
