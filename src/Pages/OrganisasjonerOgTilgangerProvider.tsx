import React, { FunctionComponent, PropsWithChildren } from 'react';
import * as Record from '../utils/Record';
import { ManglerTilganger } from './ManglerTilganger/ManglerTilganger';
import { SpinnerMedBanner } from './Banner';
import {
    OrganisasjonerOgTilgangerContext,
    useBeregnOrganisasjonsInfo,
    useBeregnOrganisasjonstre,
} from './OrganisasjonerOgTilgangerContext';

export const OrganisasjonerOgTilgangerProvider: FunctionComponent<PropsWithChildren> = (props) => {
    const { organisasjonstre } = useBeregnOrganisasjonstre();
    const { organisasjonsInfo, organisasjonerFlatt, orgnrTilParentMap, orgnrTilChildrenMap } =
        useBeregnOrganisasjonsInfo();

    if (organisasjonsInfo === undefined || organisasjonstre === undefined) {
        return <SpinnerMedBanner />;
    }

    const harTilganger = Record.values(organisasjonsInfo).some(
        (org) => org.organisasjon.underenheter.length > 0
    );

    if (!harTilganger) {
        return <ManglerTilganger />;
    }

    return (
        <OrganisasjonerOgTilgangerContext.Provider
            value={{
                organisasjonstre,
                organisasjonerFlatt,
                orgnrTilParentMap,
                orgnrTilChildrenMap,
                organisasjonsInfo,
            }}
        >
            {props.children}
        </OrganisasjonerOgTilgangerContext.Provider>
    );
};
