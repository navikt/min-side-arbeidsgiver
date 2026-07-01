import React from 'react';
import ikon from './narmeste-leder-sykefravar-ikon-kontrast.svg';
import { StortTall, Tjenesteboks } from '../Tjenesteboks';
import { useAntallSykmeldteManglerLeder } from './useAntallSykmeldteManglerLeder';
import { useOrganisasjonsDetaljerContext } from '../../../OrganisasjonsDetaljerContext';
import { gittMiljo } from '../../../../utils/environment';

const NarmesteLederSykefravar = () => {
    const antall = useAntallSykmeldteManglerLeder();
    const { valgtOrganisasjon } = useOrganisasjonsDetaljerContext();

    // Lenkemål: nytt oversikt-frontend hos team-esyfo.
    // ?orgnr= (ikke ?bedrift=) er forventet av målappen.
    const href = `${gittMiljo({
        prod: 'https://www.nav.no/arbeidsgiver/ansatte/narmesteleder/oversikt',
        dev: 'https://www.ekstern.dev.nav.no/arbeidsgiver/ansatte/narmesteleder/oversikt',
        other: 'https://demo.ekstern.dev.nav.no/arbeidsgiver/ansatte/narmesteleder/oversikt',
    })}?orgnr=${valgtOrganisasjon.organisasjon.orgnr}`;

    return (
        <Tjenesteboks
            ikon={ikon}
            href={href}
            tittel="Oversikt over nærmeste leder sykefravær"
            aria-label={`Oversikt over nærmeste leder sykefravær, ${antall} sykmeldte mangler leder`}
        >
            <div>
                <StortTall>{antall}</StortTall>
                <div className="tjenesteboks_bunntekst">sykmeldte mangler leder</div>
            </div>
        </Tjenesteboks>
    );
};

export default NarmesteLederSykefravar;
