import React, { useContext, useEffect, useState } from 'react';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import { arbeidsplassenURL } from '../../../../lenker';
import TjenesteBoksBanner from '../TjenesteBoksBanner/TjenesteBoksBanner';
import PamboksIkon from './pamboks-ikon.svg';
import { LenkepanelMedLogging } from '../../../../GeneriskeElementer/LenkepanelMedLogging';
import './Pamboks.less';
import { EksperimentContext } from '../../../EksperimentProvider';


const Pamboks = () => {
    const { antallAnnonser } = useContext(OrganisasjonsDetaljerContext);
    const { visTall } = useContext(EksperimentContext);
    const [stillingsAnnonseTekst, setStillingsAnnonseTekst] = useState('Lag ny stillingsannonse');

    const TekstUtenTall = () =>
        <>Finn nye kandidater
            <br />Lag en stillingsannonse</>;

    const TekstMedTall = () =>
        <div className={'bunntekst'}>
            <span> <span className={'antall'}>{antallAnnonser}</span>stillingsannonser (aktive)</span>
            <div className={'bunntekst'}>Finn nye kandidater
            </div>
        </div>;


    useEffect(() => {
        if (antallAnnonser > 0) {
            setStillingsAnnonseTekst('Stillingsannonser (' + antallAnnonser + ' aktive)');
        }
    }, [antallAnnonser]);

    return (
        <div className='pamboks tjenesteboks-innhold'>
            <TjenesteBoksBanner tittel='Rekruttere' imgsource={PamboksIkon} altTekst='' />
            <LenkepanelMedLogging
                className='pamboks__lenke'
                loggLenketekst='Rekruttere'
                href={arbeidsplassenURL}
                tittelProps='normaltekst'
                aria-label={'Rekruttere, finn kandidater, ' + stillingsAnnonseTekst}
            >
                <div className='pamboks-tekst'>
                    {antallAnnonser > 0 && visTall === true ? TekstMedTall() : TekstUtenTall()}
                </div>
            </LenkepanelMedLogging>
        </div>
    );
};

export default Pamboks;
