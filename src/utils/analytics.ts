import { OrganisasjonInfo } from '../Pages/OrganisasjonerOgTilgangerContext';
import { Hovedenhet, useUnderenhet } from '../api/enhetsregisteretApi';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { NAVtjenesteId } from '../altinn/tjenester';
import { getAnalyticsInstance } from '@navikt/nav-dekoratoren-moduler';
import { gittMiljo } from './environment';

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

const mockGetAnalyticsInstance = (origin: string) => {
    return (eventName: string, eventData?: any) => {
        console.log(`Analytics Event Logged (Origin: ${origin}):`, eventName, eventData);
        return Promise.resolve(null);
    };
};

export const umamiLogger = gittMiljo({
    prod: () => getAnalyticsInstance('min-side-arbeidsgiver'),
    dev: () => getAnalyticsInstance('min-side-arbeidsgiver'),
    other: () => mockGetAnalyticsInstance('min-side-arbeidsgiver'),
})();

export const logAnalyticsEvent = (eventName: string, eventData: Record<string, any>) => {
    umamiLogger(eventName, { ...eventData, origin: 'min-side-arbeidsgiver' });
};

const baseUrl = `https://arbeidsgiver.nav.no/min-side-arbeidsgiver`;

export const loggSidevisning = (pathname: string) => {
    logAnalyticsEvent('sidevisning', {
        url: `${baseUrl}${pathname}`,
        innlogget: true,
    });
};


export const finnAntallDagerTilDato = (date: Date) => {
    const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
    const now = new Date(); // antar at starttidspunkt er i fremtiden
    now.setHours(0, 0, 0, 0);
    const differenceInMilliseconds = date.getTime() - now.getTime();
    return Math.floor(differenceInMilliseconds / oneDayInMilliseconds);
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

        const tilganger = Object.entries(org.altinntilgang)
            .filter(([key, value]) => value === true && NAVtjenesteId.includes(key))
            .map(([key]) => key);

        if (org.syfotilgang) {
            tilganger.push('syfo-nærmesteleder');
        }

        const virksomhetsinfo: any = {
            tilganger,
            organisasjonstypeForØversteLedd: org.øversteLedd?.organisasjonsform,
        };

        if (underenhet !== undefined) {
            virksomhetsinfo.sektor = finnSektorNavn(underenhet);
            virksomhetsinfo.antallAnsatte = underenhet.antallAnsatte;
        }

        logAnalyticsEvent('virksomhet-valgt', virksomhetsinfo);
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
    tags: Record<string, any>
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
    logAnalyticsEvent('navigere', navigasjonsInfo);
};

export const useLoggKlikk = () => {
    const { pathname } = useLocation();
    return (knapp: string, annet: Record<string, any> = {}) => {
        logAnalyticsEvent('klikk', {
            knapp,
            pathname,
            ...annet,
        });
    };
};

export const amplitudeChipClick = (kategori: string, filternavn: string) => {
    logAnalyticsEvent('chip-click', {
        kategori: kategori,
        filternavn: filternavn,
    });
};
