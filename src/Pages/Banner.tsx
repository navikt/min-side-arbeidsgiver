import React, { FunctionComponent, useCallback, useContext, useEffect } from 'react';
import Bedriftsmeny from '@navikt/bedriftsmeny';
import '@navikt/bedriftsmeny/lib/bedriftsmeny.css';
import { OrganisasjonsDetaljerContext } from './OrganisasjonDetaljerProvider';
import { useOrganisasjonerOgTilgangerContext } from './OrganisasjonerOgTilgangerProvider';
import * as Record from '../utils/Record';
import { NotifikasjonWidget } from '@navikt/arbeidsgiver-notifikasjon-widget';
import { useSearchParams } from 'react-router-dom';
import { Heading, Loader } from '@navikt/ds-react';
import './Banner.css';
import { LenkeMedLogging } from '../GeneriskeElementer/LenkeMedLogging';
import { HouseIcon } from '@navikt/aksel-icons';

interface OwnProps {
    sidetittel?: string;
}

export const SimpleBanner: FunctionComponent<OwnProps> = ({
    sidetittel = 'Min side – arbeidsgiver',
}) => {
    return <Bedriftsmeny sidetittel={'Min side – arbeidsgiver'} />;
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

export const BannerMedBedriftsmeny: FunctionComponent<OwnProps> = ({ sidetittel }) => {
    const { organisasjoner } = useOrganisasjonerOgTilgangerContext();
    const { endreOrganisasjon, valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);

    const [params, setParams] = useSearchParams();
    const orgnrFraUrl = params.get('bedrift');

    useEffect(() => {
        if (orgnrFraUrl === null) return;
        if (organisasjoner[orgnrFraUrl] !== undefined) {
            endreOrganisasjon(organisasjoner[orgnrFraUrl].organisasjon);
        }

        params.delete('bedrift');
        setParams(params, { replace: true });
    }, []);

    const useOrgnrHook: () => [string | null, (orgnr: string) => void] = useCallback(() => {
        const currentOrgnr = valgtOrganisasjon?.organisasjon.OrganizationNumber ?? null;
        return [
            currentOrgnr,
            (orgnr: string) => {
                if (organisasjoner[orgnr] !== undefined) {
                    endreOrganisasjon(organisasjoner[orgnr].organisasjon);
                }
            },
        ];
    }, [endreOrganisasjon, valgtOrganisasjon]);

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    const orgs = organisasjoner
        ? Record.mapToArray(organisasjoner, (orgnr, { organisasjon }) => organisasjon)
        : [];

    return (
        <Bedriftsmeny sidetittel={sidetittel} organisasjoner={orgs} orgnrSearchParam={useOrgnrHook}>
            <NotifikasjonWidget />
        </Bedriftsmeny>
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
