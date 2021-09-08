import amplitude from '../utils/amplitude';
import {OrganisasjonInfo, SyfoTilgang} from '../App/OrganisasjonerOgTilgangerProvider';
import {Innlogget} from '../App/LoginProvider';
import {basename} from '../paths';

interface EventProps {
    url: string;
    innlogget?: boolean;
    tilgangskombinasjon?: string;
    kategori?: string;
    destinasjon?: string;
    lenketekst?: string;
}


const baseUrl = `https://arbeidsgiver.nav.no${basename}`

interface AndreTilganger {
    tilgangTilSyfo: SyfoTilgang,
}

export const loggSidevisning = (pathname: string, innlogget: Innlogget) => {
    amplitude.logEvent('sidevisning', {
        url: `${baseUrl}${pathname}`,
        innlogget: innlogget === Innlogget.INNLOGGET
    });
};

export const loggBedriftValgtOgTilganger = (
    org: OrganisasjonInfo | undefined
) => {
    if (org === undefined) return

    let tilgangskombinasjon = ''

    if (org.altinntilgang.pam.tilgang === 'ja') {
        tilgangskombinasjon += 'arbeidsplassen ';
    }
    if (org.altinntilgang.iaweb.tilgang === 'ja') {
        tilgangskombinasjon += 'sykefraværsstatistikk ';
    }
    if (org.altinntilgang.arbeidstrening.tilgang === 'ja') {
        tilgangskombinasjon += 'arbeidstrening ';
    }
    if (org.altinntilgang.arbeidsforhold.tilgang === 'ja') {
        tilgangskombinasjon += 'arbeidsforhold'
    }
    if (org.altinntilgang.midlertidigLønnstilskudd.tilgang === 'ja') {
        tilgangskombinasjon += 'midlertidig lønnstilskudd ';
    }
    if (org.altinntilgang.varigLønnstilskudd.tilgang === 'ja') {
        tilgangskombinasjon += 'varig lønnstilskudd';
    }

    const tilgangsinfo: EventProps = {
        url: baseUrl,
        tilgangskombinasjon
    };

    amplitude.logEvent('virksomhet-valgt', tilgangsinfo);
};

export const loggNavigasjon = (
    destinasjon: string | undefined,
    /* hvilken knapp sum ble trykket. burde være unik for siden. */
    lenketekst: string,
    currentPagePath?: string
) => {

    if (destinasjon !== undefined && destinasjon !== '') {
        const {origin, pathname} = new URL(destinasjon, baseUrl)
        destinasjon = `${origin}${pathname}`
    }

    const navigasjonsInfo: EventProps = {
        destinasjon: destinasjon,
        lenketekst,
        url: `${baseUrl}${currentPagePath ?? ""}`
    };
    amplitude.logEvent('navigere', navigasjonsInfo);
};