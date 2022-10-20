import React, {useContext, useEffect, useState} from 'react';
import {OrganisasjonsDetaljerContext} from '../../../OrganisasjonDetaljerProvider';
import {arbeidsplassenURL} from '../../../../lenker';
import PamboksIkon from './pamboks-ikon.svg';
import './Pamboks.css';
import {Tjenesteboks} from "../Tjenesteboks";

const Pamboks = () => {
    const { antallAnnonser } = useContext(OrganisasjonsDetaljerContext);
    const [stillingsAnnonseTekst, setStillingsAnnonseTekst] = useState('Lag ny stillingsannonse');

    const TekstUtenTall = () =>
        <>Lag et jobbtreff
            <br />Lag en stillingsannonse</>;

    const TekstMedTall = () =>
        <div className={'pamboks__bunntekst'}>
            <span> <span className={'pamboks__antall'}>{antallAnnonser}</span>stillingsannonser (aktive)</span>
            <div className={'pamboks__bunntekst'}>Lag et jobbtreff
            </div>
        </div>;


    useEffect(() => {
        if (antallAnnonser > 0) {
            setStillingsAnnonseTekst('Stillingsannonser (' + antallAnnonser + ' aktive)');
        }
        else {
            setStillingsAnnonseTekst('Lag ny stillingsannonse')
        }
    }, [antallAnnonser]);

    return <Tjenesteboks
        ikon={PamboksIkon}
        href={arbeidsplassenURL}
        tittel={'Rekruttere på arbeidsplassen.no'}
        aria-label={'Rekruttere på arbeidsplassen.no, ' + stillingsAnnonseTekst + ' og lag et jobbtreff'}>
            {antallAnnonser > 0 ? TekstMedTall() : TekstUtenTall()}
        </Tjenesteboks>;
};

export default Pamboks;
