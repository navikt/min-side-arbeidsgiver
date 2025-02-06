import React, { FunctionComponent, useEffect } from 'react';
import { Banner, findRecursive, Virksomhetsvelger } from '@navikt/virksomhetsvelger';
import '@navikt/virksomhetsvelger/dist/assets/style.css';
import { NotifikasjonWidget } from '@navikt/arbeidsgiver-notifikasjon-widget';
import { useSearchParams } from 'react-router-dom';
import { Heading, Loader } from '@navikt/ds-react';
import './Banner.css';
import { LenkeMedLogging } from '../GeneriskeElementer/LenkeMedLogging';
import { HouseIcon } from '@navikt/aksel-icons';
import { useOrganisasjonsDetaljerContext } from './OrganisasjonsDetaljerContext';
import { useOrganisasjonerOgTilgangerContext } from './OrganisasjonerOgTilgangerContext';

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
}> = ({ sidetittel }) => {
    const { organisasjonstre } = useOrganisasjonerOgTilgangerContext();
    const { endreOrganisasjon } = useOrganisasjonsDetaljerContext();

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
            <Virksomhetsvelger organisasjoner={organisasjonstre} onChange={endreOrganisasjon} />
            <NotifikasjonWidget />
        </Banner>
    );
};

export const Brodsmulesti = () => {
    return (
        <div className="brodsmulesti">
            <LenkeMedLogging
                loggLenketekst={`Brødsmulesti - Min side - arbeidsgiver`}
                href={__BASE_PATH__}
            >
                <HouseIcon title="a11y-title" fontSize="1.5rem" />
                Min side – arbeidsgiver
            </LenkeMedLogging>
        </div>
    );
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
