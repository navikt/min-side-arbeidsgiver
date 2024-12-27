import React from 'react';
import { syfoURL } from '../../../../lenker';
import syfoikon from './Sykmeldte.svg';
import { StortTall, Tjenesteboks } from '../Tjenesteboks';
import { useOrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';

const Sykmeldte = () => {
    const { valgtOrganisasjon } = useOrganisasjonsDetaljerContext();
    const antallSykmeldte = valgtOrganisasjon?.antallSykmeldte ?? 0;
    const orgnr = valgtOrganisasjon?.organisasjon?.OrganizationNumber;
    const url = orgnr !== undefined && orgnr !== '' ? `${syfoURL}?bedrift=${orgnr}` : syfoURL;
    return (
        <Tjenesteboks
            ikon={syfoikon}
            href={url}
            tittel="Sykmeldte"
            aria-label={`Sykemeldte, ${antallSykmeldte} ${antallSykmeldte === 1 ? 'sykmeldt' : 'sykmeldte'}. Se sykmeldte du har ansvar for å følge opp`}
        >
            {antallSykmeldte == 0 ? null : (
                <>
                    <StortTall>{antallSykmeldte}</StortTall>{' '}
                    {antallSykmeldte === 1 ? 'sykmeldt' : 'sykmeldte'}
                </>
            )}
            <p className="bunntekst">Se sykmeldte du har ansvar for å følge opp</p>
        </Tjenesteboks>
    );
};

export default Sykmeldte;
