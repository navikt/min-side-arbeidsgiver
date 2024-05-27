import amplitude from '../utils/amplitude';
import { OrganisasjonInfo } from '../Pages/OrganisasjonerOgTilgangerProvider';
import { Hovedenhet, useUnderenhet } from '../api/enhetsregisteretApi';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { NAVtjenesteId } from '../altinn/tjenester';

interface EventProps {
    url: string;
    innlogget?: boolean;
    tilgangskombinasjon?: string;
    kategori?: string;
    destinasjon?: string;
    lenketekst?: string;
    antallAnsatte?: string;
    sektor?: string;
}

interface EregInfo {
    antallAnsatte?: string;
    sektor?: string;
}

const baseUrl = `https://arbeidsgiver.nav.no/min-side-arbeidsgiver`;

export const loggSidevisning = (pathname: string) => {
    amplitude.logEvent('sidevisning', {
        url: `${baseUrl}${pathname}`,
        innlogget: true,
    });
};

const finnAntallAnsattebøtte = (antall: number | undefined) => {
    if (antall === undefined) {
        return undefined;
    }
    switch (true) {
        case antall === 0:
            return '0';
        case antall < 5:
            return '1-4';
        case antall < 20:
            return '5-19';
        case antall < 50:
            return '20-49';
        case antall < 100:
            return '50-99';
        case antall < 500:
            return '100-499';
        case antall > 500:
            return '500>';
        default:
            return undefined;
    }
};

const finnSektorNavn = (eregOrg: Hovedenhet) => {
    if (eregOrg.naeringskode1) {
        if (eregOrg.naeringskode1.kode.startsWith('84')) {
            return 'offentlig';
        } else {
            return 'privat';
        }
    }
};

export const useLoggBedriftValgtOgTilganger = (org: OrganisasjonInfo | undefined) => {
    const { underenhet, isLoading } = useUnderenhet(org?.organisasjon.OrganizationNumber);

    useEffect(() => {
        if (org === undefined) return;
        if (isLoading) return;

        const navtjenestetilganger = Object.entries(org.altinntilgang)
            .filter(([key, value]) => value === true && NAVtjenesteId.includes(key))
            .map(([key]) => key);

        const tilgangskombinasjon = [
            ...navtjenestetilganger,
            org.syfotilgang ? 'syfo-nærmesteleder' : null,
        ]
            .filter((e) => e)
            .sort()
            .join(' ');

        const virksomhetsinfo: any = {
            url: baseUrl,
            tilgangskombinasjon,
            organisasjonstypeForØversteLedd: org.organisasjonstypeForØversteLedd,
        };

        if (underenhet !== undefined) {
            virksomhetsinfo.sektor = finnSektorNavn(underenhet);
            virksomhetsinfo.antallAnsatte = finnAntallAnsattebøtte(underenhet.antallAnsatte);
        }

        amplitude.logEvent('virksomhet-valgt', virksomhetsinfo);
    }, [org, underenhet, isLoading]);
};

export const loggNavigasjon = (
    destinasjon: string | undefined,
    /* hvilken knapp sum ble trykket. burde være unik for siden. */
    lenketekst: string,
    currentPagePath?: string
) => {
    loggNavigasjonTags(destinasjon, lenketekst, currentPagePath ?? '', {});
};

export const loggNavigasjonTags = (
    destinasjon: string | undefined,
    /* hvilken knapp sum ble trykket. burde være unik for siden. */
    lenketekst: string,
    currentPagePath: string,
    tags: Record<string, string>
) => {
    if (destinasjon !== undefined && destinasjon !== '') {
        const { origin, pathname } = new URL(destinasjon, baseUrl);
        destinasjon = `${origin}${pathname}`;
    }

    const navigasjonsInfo: EventProps = {
        destinasjon: destinasjon,
        lenketekst,
        url: `${baseUrl}${currentPagePath}`,
        ...tags,
    };
    amplitude.logEvent('navigere', navigasjonsInfo);
};

export const useLoggKlikk = () => {
    const { pathname } = useLocation();
    return (knapp: string, annet: Record<string, any> = {}) =>
        amplitude.logEvent('klikk', {
            knapp,
            pathname,
            ...annet,
        });
};
