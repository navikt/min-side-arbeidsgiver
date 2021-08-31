import amplitude from '../utils/amplitude';
import { Tilgang } from '../App/LoginBoundary';
import { OrganisasjonInfo } from '../App/OrganisasjonerOgTilgangerProvider';


/*

sidevisning når hoved-component lastes
 - hovedside, ingen-tilgang, logg inn siden, bedriftsinformasjon, informasjon om tilgangsstyring
byttet-bedrift når bedrift byttes
navigasjon når lenker/knapper trykkes på

 */



interface EventProps {
    tilgangskombinasjon?: string;
    tjeneste?: string;
    destinasjon?: string;
    lenketekst?: string;
    url: string;
    erTilleggssInformasjon:boolean;
    ingenTilganger?: boolean;
}

interface AndreTilganger {
    tilgangTilSyfo: Tilgang,
}

export const loggSidevisning = (pathname: string) => {
    amplitude.logEvent('sidevisning', {});
};

export const loggSidevisningOgTilgangsKombinasjonAvTjenestebokser = (
    org: OrganisasjonInfo | undefined,
    {tilgangTilSyfo}: AndreTilganger
) => {
    let tilgangsinfo: EventProps = {
        erTilleggssInformasjon: true,
        url: 'https://arbeidsgiver.nav.no/min-side-arbeidsgiver/',
    };

    let tilgangsKombinasjon = ''

    if (tilgangTilSyfo === Tilgang.TILGANG) {
        tilgangsKombinasjon += 'digisyfo ';
    }

    if (org) {
        if (org.altinntilgang.pam.tilgang === 'ja') {
            tilgangsKombinasjon += 'arbeidsplassen ';
        }
        if (org.altinntilgang.iaweb.tilgang === 'ja') {
            tilgangsKombinasjon += 'sykefraværsstatistikk ';
        }
        if (org.altinntilgang.arbeidstrening.tilgang === 'ja') {
            tilgangsKombinasjon += 'arbeidstrening ';
        }
        if (org.altinntilgang.arbeidsforhold.tilgang === 'ja') {
            tilgangsKombinasjon += 'arbeidsforhold'
        }
        if (org.altinntilgang.midlertidigLønnstilskudd.tilgang === 'ja') {
            tilgangsKombinasjon += 'midlertidig lønnstilskudd ';
        }
        if (org.altinntilgang.varigLønnstilskudd.tilgang === 'ja') {
            tilgangsKombinasjon += 'varig lønnstilskudd';
        }
    }
    tilgangsinfo.tilgangskombinasjon = tilgangsKombinasjon

    if (tilgangsKombinasjon === '') {
        tilgangsinfo.ingenTilganger = true;
    }

    amplitude.logEvent('sidevisning', tilgangsinfo);
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
        url: 'https://arbeidsgiver.nav.no/min-side-arbeidsgiver/',
        erTilleggssInformasjon: false

    };
    amplitude.logEvent('navigere', navigasjonsInfo);
};