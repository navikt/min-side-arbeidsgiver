import React, { useContext, useState } from 'react';
import Lukknapp from 'nav-frontend-lukknapp';
import { Alert, BodyShort, Heading } from '@navikt/ds-react';
import { OrganisasjonerOgTilgangerContext } from '../../OrganisasjonerOgTilgangerProvider';

const localStoreKey = 'InntektsmeldingUndersøkelse'

export const UndersokelseInntektsmelding = () => {
    const {organisasjoner} = useContext(OrganisasjonerOgTilgangerContext)
    const [vis, setVis] = useState(() => window.localStorage.getItem(localStoreKey) === null);

    const tilgangTilInntektsmelding = Object.values(organisasjoner)
        .some(org => org.altinntilgang.inntektsmelding)

    const lukk = () => {
        window.localStorage.setItem(localStoreKey, new Date().toDateString());
        setVis(false)
    }

    if (vis && tilgangTilInntektsmelding) {
        return (
            /* position: relative fordi Lukk-knappen posisjonerer seg absolutt i forhold til den. */
            <Alert variant='info' style={{position: 'relative'}}>
                <Heading spacing size="xsmall">
                    Har du ansvar for å sende inn inntektsmelding for din bedrift?
                </Heading>
                <BodyShort spacing>
                    Vi gjennomfører en spørreundersøkelse med mål om å forbedre inntektsmeldingen og vil
                    gjerne ha din hjelp. Det tar bare et par minutter å svare på spørreundersøkelsen og
                    svarene er helt anonyme. <a href='https://www.survey-xact.no/LinkCollector?key=PM9NGW79UP1J'>
                    Gå inn på spørreundersøkelsen her.
                </a>
                </BodyShort>

                <Lukknapp overstHjorne={true} className={'lukk-knapp'} onClick={lukk}>Lukk</Lukknapp>
            </Alert>
        );
    }
    return <></>;
};
