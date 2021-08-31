import amplitude from '../utils/amplitude';
import { OrganisasjonInfo, SyfoTilgang } from '../App/OrganisasjonerOgTilgangerProvider';
import { Innlogget } from '../App/LoginProvider';
import { basename } from '../paths';


/*

sidevisning når hoved-component lastes
 - hovedside, ingen-tilgang, logg inn siden, bedriftsinformasjon, informasjon om tilgangsstyring
byttet-bedrift når bedrift byttes
navigasjon når lenker/knapper trykkes på

 */

interface EventProps {
    url: string;
    innlogget?: boolean;
    tilgangskombinasjon?: string;
    tjeneste?: string;
    destinasjon?: string;
    lenketekst?: string;
    erTilleggssInformasjon:boolean;
    ingenTilganger?: boolean;
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
    let tilgangsinfo: EventProps = {
        erTilleggssInformasjon: true,
        url: 'https://arbeidsgiver.nav.no/min-side-arbeidsgiver/',
    };

    let tilgangsKombinasjon = ''

    if (tilgangTilSyfo === SyfoTilgang.TILGANG) {
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
        url: 'https://arbeidsgiver.nav.no/min-side-arbeidsgiver/',
        erTilleggssInformasjon: false

    };
    amplitude.logEvent('navigere', navigasjonsInfo);
};