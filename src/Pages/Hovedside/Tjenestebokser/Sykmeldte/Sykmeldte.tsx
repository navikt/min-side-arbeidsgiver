import React from 'react';
import syfoikon from './sykmeldte-ikon-kontrast.svg';
import { StortTall, Tjenesteboks } from '../Tjenesteboks';
import './Sykemeldte.css';

import { useOrganisasjonsDetaljerContext } from '../../../OrganisasjonsDetaljerContext';
import { gittMiljo } from '../../../../utils/environment';

const Sykmeldte = () => {
    const { valgtOrganisasjon } = useOrganisasjonsDetaljerContext();
    const antallSykmeldte = valgtOrganisasjon.antallSykmeldte ?? 0;
    return (
        <Tjenesteboks
            ikon={syfoikon}
            href={`${gittMiljo({
                prod: 'https://www.nav.no/arbeidsgiver/sykmeldte',
                other: 'https://www.ekstern.dev.nav.no/arbeidsgiver/sykmeldte',
                demo: 'https://demo.ekstern.dev.nav.no/arbeidsgiver/sykmeldte',
            })}?bedrift=${valgtOrganisasjon.organisasjon.orgnr}`}
            tittel="Sykmeldte"
            aria-label={`Sykemeldte, du har ${antallSykmeldte} ${antallSykmeldte === 1 ? 'sykmeldt' : 'sykmeldte'} å følge opp`}
        >
            {antallSykmeldte === 0 ? (
                <div>
                    <div className="sykemeldteboks_bunntekst">
                        Du har ingen sykmeldte å følge opp
                    </div>
                </div>
            ) : (
                <div>
                    <StortTall>{antallSykmeldte}</StortTall>{' '}
                    {antallSykmeldte === 1 ? 'sykmeldt' : 'sykmeldte'}
                    <div className="sykemeldteboks_bunntekst">
                        Se sykmeldte du har ansvar for å følge opp
                    </div>
                </div>
            )}
        </Tjenesteboks>
    );
};

export default Sykmeldte;
