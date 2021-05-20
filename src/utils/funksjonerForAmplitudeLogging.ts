import amplitude from '../utils/amplitude';
import { Tilgang } from '../App/LoginBoundary';
import { OrganisasjonInfo } from '../App/OrganisasjonerOgTilgangerProvider';

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
        if (org.altinntilgang.sommerjobb.tilgang === 'ja') {
            tilgangsKombinasjon += 'sommerjobb';
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

export const loggBrukerLoggetInn = () => {
    amplitude.logEvent('sidevisning', {
        url: 'https://arbeidsgiver.nav.no/min-side-arbeidsgiver/',
        erTilleggssInformasjon: false
    });
};

/*
export const loggBedriftsInfo = async (organisasjon: Organisasjon) => {

    amplitude.logEvent('#min-side-arbeidsgiver loggbedriftsinfo kallt');

    let infoFraEereg: OrganisasjonFraEnhetsregisteret = tomEnhetsregOrg;
    await hentUnderenhet(organisasjon.OrganizationNumber).then(underenhet => {
        infoFraEereg = underenhet;
    });

    if (infoFraEereg !== tomEnhetsregOrg) {
        let infoFraEeregJuridisk: OrganisasjonFraEnhetsregisteret = tomEnhetsregOrg;
        await hentOverordnetEnhet(organisasjon.ParentOrganizationNumber).then(enhet => {
            infoFraEeregJuridisk = enhet;
        });

        if (infoFraEereg?.naeringskode1?.kode.startsWith('84')) {
            amplitude.logEvent('#min-side-arbeidsgiver OFFENTLIG');
            if (
                infoFraEereg?.institusjonellSektorkode?.kode === '6500'
            ) {
                amplitude.logEvent('#min-side-arbeidsgiver Kommuneforvaltningen');
            }
            if (
                infoFraEereg?.institusjonellSektorkode?.kode === '6100'
            ) {
                amplitude.logEvent('#min-side-arbeidsgiver Statsforvaltningen');
            }
        } else {
            amplitude.logEvent('#min-side-arbeidsgiver PRIVAT');
        }

        const antallAnsatte = Number(infoFraEereg.antallAnsatte);
        const antallAnsatteJuridiske = Number(infoFraEeregJuridisk.antallAnsatte);
        switch (true) {
            case antallAnsatte < 20:
                amplitude.logEvent('#min-side-arbeidsgiver under 20 ansatte');
                break;
            case antallAnsatte > 3000:
                amplitude.logEvent('#min-side-arbeidsgiver over 3000 ansatte');
                break;
            case antallAnsatte > 1000:
                amplitude.logEvent('#min-side-arbeidsgiver over 1000 ansatte');
                break;
            case antallAnsatte > 500:
                amplitude.logEvent('#min-side-arbeidsgiver over 500 ansatte');
                break;
            case antallAnsatte > 100:
                amplitude.logEvent('#min-side-arbeidsgiver over 100 ansatte');
                break;
            case antallAnsatte > 20:
                amplitude.logEvent('#min-side-arbeidsgiver over 20 ansatte');
                break;
            default:
                break;
        }
        switch (true) {
            case antallAnsatteJuridiske < 20:
                amplitude.logEvent('#min-side-arbeidsgiver under 20 ansatte i juridisk enhet');
                break;
            case antallAnsatteJuridiske > 10000:
                amplitude.logEvent('#min-side-arbeidsgiver over 10000 ansatte i juridisk enhet');
                break;
            case antallAnsatteJuridiske > 8000:
                amplitude.logEvent('#min-side-arbeidsgiver over 8000 ansatte i juridisk enhet');
                break;
            case antallAnsatteJuridiske > 5000:
                amplitude.logEvent('#min-side-arbeidsgiver over 5000 ansatte i juridisk enhet');
                break;
            case antallAnsatteJuridiske > 3000:
                amplitude.logEvent('#min-side-arbeidsgiver over 3000 ansatte i juridisk enhet');
                break;
            case antallAnsatteJuridiske > 1000:
                amplitude.logEvent('#min-side-arbeidsgiver over 1000 ansatte i juridisk enhet');
                break;
            case antallAnsatteJuridiske > 500:
                amplitude.logEvent('#min-side-arbeidsgiver over 500 ansatte i juridisk enhet');
                break;
            case antallAnsatteJuridiske > 100:
                amplitude.logEvent('#min-side-arbeidsgiver over 100 ansatte i juridisk enhet');
                break;
            case antallAnsatteJuridiske > 20:
                amplitude.logEvent('#min-side-arbeidsgiver over 20 ansatte i juridisk enhet');
                break;
            default:
                break;
        }
    }
)


 */