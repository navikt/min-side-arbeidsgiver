import React, { FC, FunctionComponent, ReactNode, useEffect } from 'react';
import { Banner, findRecursive, Virksomhetsvelger } from '@navikt/virksomhetsvelger';
import '@navikt/virksomhetsvelger/dist/assets/style.css';
import { useSearchParams } from 'react-router-dom';
import { Heading, Loader } from '@navikt/ds-react';
import './Banner.css';
import { useOrganisasjonsDetaljerContext } from './OrganisasjonsDetaljerContext';
import { useOrganisasjonerOgTilgangerContext } from './OrganisasjonerOgTilgangerContext';
import { setBreadcrumbs } from '@navikt/nav-dekoratoren-moduler';

export const SimpleBanner = () => {
    return <Banner tittel="Min side – arbeidsgiver" />;
};

export const SaksoversiktBanner = () => (
    <div className="banner__saksoversikt">
        <div className="banner__saksoversikt__tittel">
            <Heading level="1" size="xlarge">
                Saksoversikt
            </Heading>
        </div>
    </div>
);

export const BannerMedBedriftsmeny: FunctionComponent<{
    sidetittel: string;
    widget?: ReactNode;
}> = ({ sidetittel, widget }) => {
    const { organisasjonstre } = useOrganisasjonerOgTilgangerContext();
    const { endreOrganisasjon, valgtOrganisasjon } = useOrganisasjonsDetaljerContext();

    const [params, setParams] = useSearchParams();
    const orgnrFraUrl = params.get('bedrift');

    useEffect(() => {
        // TODO: vurder å fjerne støtte for orgnr i URL
        if (orgnrFraUrl === null) return;
        const orgFraUrl = findRecursive(organisasjonstre, (it) => it.orgnr === orgnrFraUrl);
        if (orgFraUrl !== undefined) {
            endreOrganisasjon(orgFraUrl);
        }

        params.delete('bedrift');
        setParams(params, { replace: true });
    }, []);

    return (
        <Banner tittel={sidetittel}>
            <Virksomhetsvelger
                organisasjoner={organisasjonstre}
                onChange={endreOrganisasjon}
                initValgtOrgnr={valgtOrganisasjon.organisasjon.orgnr}
            />
            {widget}
        </Banner>
    );
};

export type Brødsmule = {
    url: string;
    title: string;
    handleInApp?: boolean;
};

export const Brodsmulesti: FC<{ brødsmuler?: Brødsmule[] }> = ({ brødsmuler }) => {
    const rotBrødsmule = {
        url: '/min-side-arbeidsgiver',
        title: 'Min side - arbeidsgiver',
    };
    brødsmuler = brødsmuler ? [rotBrødsmule, ...brødsmuler] : [rotBrødsmule];
    useEffect(() => {
        setBreadcrumbs(brødsmuler);
    }, [brødsmuler]);
    return <></>;
};

export const Spinner = () => (
    <div className="app-laster-spinner">
        <Loader size="3xlarge" />
    </div>
);

export const SpinnerMedBanner = () => {
    return (
        <>
            <SimpleBanner />
            <Spinner />
        </>
    );
};
