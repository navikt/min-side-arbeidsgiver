import amplitude from '../utils/amplitude';
import { OrganisasjonInfo, SyfoTilgang } from '../App/OrganisasjonerOgTilgangerProvider';
import { Innlogget } from '../App/LoginProvider';
import { basename } from '../paths';

interface EventProps {
    url: string;
    innlogget?: boolean;
    tilgangskombinasjon?: string;
    tjeneste?: string;
    destinasjon?: string;
    lenketekst?: string;
}

interface AndreTilganger {
    tilgangTilSyfo: SyfoTilgang,
}

export const loggSidevisning = (pathname: string, innlogget: Innlogget) => {
    amplitude.logEvent('sidevisning', {
        url: `https://arbeidsgiver.nav.no${basename}${pathname}`,
        innlogget: innlogget === Innlogget.INNLOGGET
    });
};

export const loggSidevisningOgTilgangsKombinasjonAvTjenestebokser = (
    org: OrganisasjonInfo | undefined,
    {tilgangTilSyfo}: AndreTilganger
) => {
    let tilgangskombinasjon = ''

    if (tilgangTilSyfo === SyfoTilgang.TILGANG) {
        tilgangskombinasjon += 'digisyfo ';
    }

    if (org) {
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
    }

    const tilgangsinfo: EventProps = {
        url: 'https://arbeidsgiver.nav.no/min-side-arbeidsgiver/',
        tilgangskombinasjon
    };

    amplitude.logEvent('virksomhet-valgt', tilgangsinfo);
};

export const loggTjenesteTrykketPa = (
    tjeneste: string,
    destinasjon: string,
    lenketekst: string
) => {
    const navigasjonsInfo: EventProps = {
        destinasjon: destinasjon,
        lenketekst: lenketekst,
        tjeneste: tjeneste,
        url: 'https://arbeidsgiver.nav.no/min-side-arbeidsgiver/'
    };
    amplitude.logEvent('navigere', navigasjonsInfo);
};