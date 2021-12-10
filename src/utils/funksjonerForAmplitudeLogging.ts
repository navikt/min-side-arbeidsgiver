import amplitude from '../utils/amplitude';
import { OrganisasjonInfo, SyfoTilgang } from '../App/OrganisasjonerOgTilgangerProvider';
import { Innlogget } from '../App/LoginProvider';
import { basename } from '../paths';
import {
    OrganisasjonFraEnhetsregisteret,
} from '../Objekter/Organisasjoner/OrganisasjonFraEnhetsregisteret';
import { hentUnderenhet } from '../api/enhetsregisteretApi';

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
    antallAnsatte: string;
    sektor?: string;
}

const baseUrl = `https://arbeidsgiver.nav.no${basename}`;

interface AndreTilganger {
    tilgangTilSyfo: SyfoTilgang,
}

export const loggSidevisning = (pathname: string, innlogget: Innlogget) => {
    amplitude.logEvent('sidevisning', {
        url: `${baseUrl}${pathname}`,
        innlogget: innlogget === Innlogget.INNLOGGET,
    });
};

const finnAntallAnsattebøtte = (antall: number) => {
    switch (true) {
        case antall === 0:
            return '0';
        case antall < 5:
            return 'mindre en 5';
        case antall < 20:
            return 'mellom 5 og 20';
        case antall < 50:
            return 'mellom 20 og 50';
        case antall < 100:
            return 'mellom 50 og 100';
        case antall < 500:
            return 'mellom 100 og 500';
        case antall > 500:
            return 'over 500';
        default:
            return 'kunne ikke finne bucket for antall ansatte';
    }
};

const finnSektorNavn = (eregOrg: OrganisasjonFraEnhetsregisteret) => {
    if (eregOrg.naeringskode1) {
        if (eregOrg.naeringskode1.kode.startsWith('84')) {
            return 'OFFENTLIG';
            if (
                eregOrg?.institusjonellSektorkode?.kode === '6500'
            ) {
                return 'Kommuneforvaltningen';
            }
            if (
                eregOrg?.institusjonellSektorkode?.kode === '6100'
            ) {
                return 'Statsforvaltningen';
            }
        }
    } else {
        return 'PRIVAT';
    }
};

const hentInfoFraEreg = async (organisasjon: OrganisasjonInfo): Promise<EregInfo | undefined> => {
    return hentUnderenhet(organisasjon.organisasjon.OrganizationNumber).then(underenhet => {
        const antallAnsatte = finnAntallAnsattebøtte(Number(underenhet.antallAnsatte));
        const sektor = finnSektorNavn(underenhet);
        return { antallAnsatte, sektor };
    }).catch(e => {
        console.log(e);
        return undefined;
    });
};

export const loggBedriftValgtOgTilganger = async (
    org: OrganisasjonInfo | undefined,
) => {
    if (org === undefined) return;

    let tilgangskombinasjon = '';

    if (org.altinntilgang.pam) {
        tilgangskombinasjon += 'arbeidsplassen ';
    }
    if (org.altinntilgang.iaweb) {
        tilgangskombinasjon += 'sykefraværsstatistikk ';
    }
    if (org.altinntilgang.arbeidstrening) {
        tilgangskombinasjon += 'arbeidstrening ';
    }
    if (org.altinntilgang.arbeidsforhold) {
        tilgangskombinasjon += 'arbeidsforhold';
    }
    if (org.altinntilgang.midlertidigLønnstilskudd) {
        tilgangskombinasjon += 'midlertidig lønnstilskudd ';
    }
    if (org.altinntilgang.varigLønnstilskudd) {
        tilgangskombinasjon += 'varig lønnstilskudd';
    }
    const eregInfo = await hentInfoFraEreg(org);
    const virksomhetsinfo: any = {
        url: baseUrl,
        tilgangskombinasjon,
    };
    if (eregInfo == undefined) {
        amplitude.logEvent('virksomhet-valgt', virksomhetsinfo);
    } else {
        virksomhetsinfo.sektor = eregInfo.sektor;
        virksomhetsinfo.antallAnsatte = eregInfo.antallAnsatte;
        amplitude.logEvent('virksomhet-valgt', virksomhetsinfo);
    }
};

export const loggNavigasjon = (
    destinasjon: string | undefined,
    /* hvilken knapp sum ble trykket. burde være unik for siden. */
    lenketekst: string,
    currentPagePath?: string,
) => {

    if (destinasjon !== undefined && destinasjon !== '') {
        const { origin, pathname } = new URL(destinasjon, baseUrl);
        destinasjon = `${origin}${pathname}`;
    }

    const navigasjonsInfo: EventProps = {
        destinasjon: destinasjon,
        lenketekst,
        url: `${baseUrl}${currentPagePath ?? ''}`,
    };
    amplitude.logEvent('navigere', navigasjonsInfo);
};