import amplitude from '../utils/amplitude';
import { Tilgang } from '../App/LoginBoundary';
import { Tilganger } from '../App/OrganisasjonDetaljerProvider';

interface TilgangsstyringEventProps {
    syfo?: string;
    PAM?: string;
    IA?: string;
    Arbeidstrening?: string;
    Arbeidsforhold?: string;
    MidlertidigLønnstilskudd?: string;
    Variglønnstilskudd?: string;
    url: string;
    ingenTilganger?: boolean;
}

interface NavigasjonsProps {
    tjeneste: string;
    destinasjon: string;
    lenketekst: string;
}

export const loggSidevisningOgTilgangsKombinasjonAvTjenestebokser = (
    tilganger: Tilganger | null
) => {
    let tilgangsinfo: TilgangsstyringEventProps = {
        url: 'https://arbeidsgiver.nav.no/min-side-arbeidsgiver/',
    };

    if (!tilganger) {
        tilgangsinfo.ingenTilganger = true;
    }

    if (tilganger?.tilgangTilSyfo === Tilgang.TILGANG) {
        tilgangsinfo.syfo = 'tilgang';
    }
    if (tilganger?.tilgangTilPam === Tilgang.TILGANG) {
        tilgangsinfo.PAM = 'tilgang';
    }
    if (tilganger?.tilgangTilIAWeb === Tilgang.TILGANG) {
        tilgangsinfo.IA = 'tilgang';
    }
    if (tilganger?.tilgangTilArbeidstreningsavtaler === Tilgang.TILGANG) {
        tilgangsinfo.Arbeidstrening = 'tilgang';
    }
    if (tilganger?.tilgangTilArbeidsforhold === Tilgang.TILGANG) {
        tilgangsinfo.Arbeidsforhold = 'tilgang';
    }
    if (tilganger?.tilgangTilMidlertidigLonnstilskudd === Tilgang.TILGANG) {
        tilgangsinfo.MidlertidigLønnstilskudd = 'tilgang';
    }
    if (tilganger?.tilgangTilVarigLonnstilskudd === Tilgang.TILGANG) {
        tilgangsinfo.Variglønnstilskudd = 'tilgang';
    }

    amplitude.logEvent('sidevisning', tilgangsinfo);
};

export const loggTjenesteTrykketPa = (
    tjeneste: string,
    destinasjon: string,
    lenketekst: string
) => {
    const navigasjonsInfo: NavigasjonsProps = {
        destinasjon: destinasjon,
        lenketekst: lenketekst,
        tjeneste: tjeneste,
    };
    amplitude.logEvent('navigere', navigasjonsInfo);
};

export const loggBrukerLoggetInn = () => {
    amplitude.logEvent('innlogget', { url: 'https://arbeidsgiver.nav.no/min-side-arbeidsgiver/' });
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
