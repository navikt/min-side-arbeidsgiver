import amplitude from '../utils/amplitude';
import { OrganisasjonInfo } from '../App/OrganisasjonerOgTilgangerProvider';
import { Innlogget } from '../App/LoginProvider';
import { basename } from '../paths';
import { Enhet, hentUnderenhet } from '../api/enhetsregisteretApi';

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

const baseUrl = `https://arbeidsgiver.nav.no${basename}`;

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

const finnSektorNavn = (eregOrg: Enhet) => {
    if (eregOrg.naeringskode1) {
        if (eregOrg.naeringskode1.kode.startsWith('84')) {
            return 'offentlig';
        } else {
            return 'privat';
        }
    }
};

const hentInfoFraEreg = async (organisasjon: OrganisasjonInfo): Promise<EregInfo | undefined> => {
    try {
        const underenhet = await hentUnderenhet(organisasjon.organisasjon.OrganizationNumber)
        if (underenhet === undefined) {
            return undefined
        }
        const antallAnsatte = finnAntallAnsattebøtte(Number(underenhet.antallAnsatte));
        const sektor = finnSektorNavn(underenhet);
        return { antallAnsatte, sektor };
    } catch(e) {
        return undefined;
    }
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
    loggNavigasjonTags(destinasjon, lenketekst, currentPagePath ?? '', {});
};

export const loggNavigasjonTags = (
    destinasjon: string | undefined,
    /* hvilken knapp sum ble trykket. burde være unik for siden. */
    lenketekst: string,
    currentPagePath: string,
    tags: Record<string, string>,
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
}
