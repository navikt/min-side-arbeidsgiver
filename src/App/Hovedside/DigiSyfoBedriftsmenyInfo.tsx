import React, {FunctionComponent, useContext} from 'react';
import {OrganisasjonerOgTilgangerContext, SyfoTilgang} from '../OrganisasjonerOgTilgangerProvider';
import {Alert, BodyShort, Heading} from "@navikt/ds-react";

export const DigiSyfoBedriftsmenyInfo: FunctionComponent = () => {
    const { tilgangTilSyfo } = useContext(OrganisasjonerOgTilgangerContext);

    if (tilgangTilSyfo !== SyfoTilgang.TILGANG) {
        return null;
    }

    return (
        <Alert variant="info">
            <Heading size="small" spacing={true}>
                Sykemeldte er nå koblet til virksomhetsvelgeren
            </Heading>
            <BodyShort>
                Velg virksomhet for å se sykemeldte du skal følge opp der. Boksen “Sykemeldte” vises bare når du har
                noen sykemeldt å følge opp på valgt virksomhet.
            </BodyShort>
        </Alert>
    );
};
