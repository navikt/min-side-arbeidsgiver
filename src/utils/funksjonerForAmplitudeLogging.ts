import amplitude from '../utils/amplitude';
import { OrganisasjonInfo } from '../Pages/OrganisasjonerOgTilgangerContext';
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

const baseUrl = `https://arbeidsgiver.nav.no/min-side-arbeidsgiver`;

export const loggSidevisning = (pathname: string) => {
    amplitude.logEvent('sidevisning', {
        url: `${baseUrl}${pathname}`,
        innlogget: true,
    });
};

export const finnBucketForAntall = (antall: number | undefined | null) => {
    if (antall === undefined) return;
    if (antall === null) return '0';

    switch (true) {
        case antall === 0:
            return '0';
        case antall < 5:
            return '1 - 4';
        case antall < 20:
            return '5 - 19';
        case antall < 50:
            return '20 - 49';
        case antall < 100:
            return '50 - 99';
        case antall < 500:
            return '100 - 499';
        case antall > 500:
            return '500 >';
        default:
            return undefined;
    }
};

export const finnAntallDagerTilDato = (date: Date) => {
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
    const now = new Date(); // antar at starttidspunkt er i fremtiden
    now.setHours(0, 0, 0, 0);
    const differenceInMilliseconds = date.getTime() - now.getTime();
    return Math.floor(differenceInMilliseconds / oneDayInMilliseconds);
};

export const finnBucketForDagerTilDato = (date: Date) => {
    const dager = finnAntallDagerTilDato(date);
    if (dager < 0) {
        return 'tidligere';
    } else if (dager === 0) {
        return 'samme dag';
    } else if (dager < 7) {
        return 'samme uke';
    } else {
        return 'mer enn en uke';
    }
};

const finnSektorNavn = (eregOrg: Hovedenhet) => {
    if (eregOrg.naeringskoder?.find((kode) => kode.startsWith('84')) !== null) {
        return 'offentlig';
    } else {
        return 'privat';
    }
};

export const useLoggBedriftValgtOgTilganger = (org: OrganisasjonInfo | undefined) => {
    const { underenhet, isLoading } = useUnderenhet(org?.organisasjon?.orgnr);

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
            .filter((e) => e !== null)
            .sort()
            .join(' ');

        const virksomhetsinfo: any = {
            url: baseUrl,
            tilgangskombinasjon,
            organisasjonstypeForØversteLedd: org.øversteLedd?.organisasjonsform,
        };

        if (underenhet !== undefined) {
            virksomhetsinfo.sektor = finnSektorNavn(underenhet);
            virksomhetsinfo.antallAnsatte = finnBucketForAntall(underenhet.antallAnsatte);
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

export const amplitudeChipClick = (kategori: string, filternavn: string) => {
    amplitude.logEvent('chip-click', {
        kategori: kategori,
        filternavn: filternavn,
    });
};
