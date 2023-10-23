import React from 'react';
import { kandidatlisteURL } from '../../../../lenker';
import { Tjenesteboks } from '../Tjenesteboks';
import { useAntallKandidater } from './useAntallKandidater';
import ikon from './kandidatlisteboks-ikon.svg';
import './Kandidatlisteboks.css';

const Kandidatlisteboks = () => {
    const antallKandidater = useAntallKandidater();

    const orgnummerFraUrl = new URLSearchParams(window.location.search).get('bedrift') ?? '';
    const href =
        kandidatlisteURL + (orgnummerFraUrl === '' ? '' : `?virksomhet=${orgnummerFraUrl}`);

    return antallKandidater === 0 ? null : (
        <Tjenesteboks
            ikon={ikon}
            href={href}
            tittel="Kandidater til dine stillinger"
            aria-label="Kandidater til dine stillinger. Se CV til personer NAV har sendt deg."
        >
            <div className="kandidatlisteboks">
                <span>
                    {' '}
                    <span className="kandidatlisteboks__antall">
                        {antallKandidater}
                    </span>kandidater{' '}
                </span>
                <div className="kandidatlisteboks__bunntekst"></div>
            </div>
        </Tjenesteboks>
    );
};

export default Kandidatlisteboks;
