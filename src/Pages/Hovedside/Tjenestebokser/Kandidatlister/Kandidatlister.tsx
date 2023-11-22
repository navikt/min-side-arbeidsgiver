import React, { useContext } from 'react';
import { kandidatlisteURL } from '../../../../lenker';
import { Tjenesteboks } from '../Tjenesteboks';
import { useAntallKandidater } from './useAntallKandidater';
import ikon from './kandidatlisteboks-ikon.svg';
import './Kandidatlister.css';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';

const Kandidatlister = () => {
    const antallKandidater = useAntallKandidater();

    const orgnr =
        useContext(OrganisasjonsDetaljerContext).valgtOrganisasjon?.organisasjon
            .OrganizationNumber ?? '';

    const href = kandidatlisteURL + (orgnr === '' ? '' : `?virksomhet=${orgnr}`);

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

export default Kandidatlister;
