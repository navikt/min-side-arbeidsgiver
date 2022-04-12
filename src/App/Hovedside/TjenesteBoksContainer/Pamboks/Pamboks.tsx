import React, {useContext, useEffect, useState} from 'react';
import {OrganisasjonsDetaljerContext} from '../../../OrganisasjonDetaljerProvider';
import {arbeidsplassenURL} from '../../../../lenker';
import PamboksIkon from './pamboks-ikon.svg';
import './Pamboks.less';
import {Tjenesteboks} from "../Tjenesteboks";

const Pamboks = () => {
    const { antallAnnonser } = useContext(OrganisasjonsDetaljerContext);
    const [stillingsAnnonseTekst, setStillingsAnnonseTekst] = useState('Lag ny stillingsannonse');

    const TekstUtenTall = () =>
        <>Finn nye kandidater
            <br />Lag en stillingsannonse</>;

    const TekstMedTall = () =>
        <div className={'pamboks__bunntekst'}>
            <span> <span className={'pamboks__antall'}>{antallAnnonser}</span>stillingsannonser (aktive)</span>
            <div className={'pamboks__bunntekst'}>Finn nye kandidater
            </div>
        </div>;


    useEffect(() => {
        if (antallAnnonser > 0) {
            setStillingsAnnonseTekst('Stillingsannonser (' + antallAnnonser + ' aktive)');
        }
    }, [antallAnnonser]);

    return <Tjenesteboks
        ikon={PamboksIkon}
        href={arbeidsplassenURL}
        tittel={'Rekruttere'}
        aria-label={'Rekruttere, finn kandidater, ' + stillingsAnnonseTekst}>
            {antallAnnonser > 0 ? TekstMedTall() : TekstUtenTall()}
        </Tjenesteboks>;
};

export default Pamboks;
