import React, {useContext, useEffect, useState} from 'react';
import {OrganisasjonsDetaljerContext} from '../../../OrganisasjonDetaljerProvider';
import {kandidatlisteURL} from '../../../../lenker';
import {Tjenesteboks} from "../Tjenesteboks";
import {hentAntallKandidater} from "../../../../api/presenterteKandidaterApi";
import ikon from "./kandidatlisteboks-ikon.svg";
import './Kandidatlisteboks.css';

const Kandidatlisteboks = () => {
    const {valgtOrganisasjon} = useContext(OrganisasjonsDetaljerContext);
    const [antallKandidater, setantallKandidater] = useState(0);
    useEffect(() => {
        if (valgtOrganisasjon)
            hentAntallKandidater(valgtOrganisasjon.organisasjon.OrganizationNumber).then(antallKandidater =>
                setantallKandidater(antallKandidater)
            );
    }, [valgtOrganisasjon]);
    const orgnummerFraUrl = new URLSearchParams(window.location.search).get('bedrift') ?? '';
    const href = kandidatlisteURL + (orgnummerFraUrl === '' ? '' : `?virksomhet=${orgnummerFraUrl}`);

    return antallKandidater === 0
        ? null
        : <Tjenesteboks
            ikon={ikon}
            href={href}
            tittel='Kandidater til dine stillinger'
            aria-label='Kandidater til dine stillinger. Se CV til personer NAV har sendt deg.'
        >
            <div className='kandidatlisteboks'>
                <span> <span className='kandidatlisteboks__antall'>{antallKandidater}</span>kandidater </span>
                <div className='kandidatlisteboks__bunntekst'></div>
            </div>
        </Tjenesteboks>
};

export default Kandidatlisteboks;
