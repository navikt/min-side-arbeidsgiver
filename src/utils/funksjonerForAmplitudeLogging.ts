import amplitude from "../utils/amplitude";
import {Tilgang} from "../App/LoginBoundary";
import {hentUnderenhet} from "../api/enhetsregisteretApi";
import {
    OrganisasjonFraEnhetsregisteret,
    tomEnhetsregOrg
} from "../Objekter/Organisasjoner/OrganisasjonFraEnhetsregisteret";

export const loggTilgangsKombinasjonAvTjenestebokser = (tilgangsArray: Tilgang[]) => {
    let skalLogges = "#min-side-arbeidsgiver";
    if (tilgangsArray[0] === Tilgang.TILGANG) {
        skalLogges +=" Syfo"
    }
    if (tilgangsArray[1] === Tilgang.TILGANG) {
        skalLogges +=" PAM"
    }

    if (tilgangsArray[2] === Tilgang.TILGANG) {
        skalLogges +=" IA"
    }
    if (tilgangsArray[3] === Tilgang.TILGANG) {
        skalLogges += " Arbeidstrening"
    }
    amplitude.logEvent(skalLogges);
};

export const loggTjenesteTrykketPa = (tjeneste: string) => {
    const skalLogges = "#min-side-arbeidsgiver " + tjeneste + " trykket pa";
    amplitude.logEvent(skalLogges);
};

export const loggBedriftsInfo = (orgnr: string) => {
    let infoFraEereg: OrganisasjonFraEnhetsregisteret = tomEnhetsregOrg;
    hentUnderenhet(orgnr).then(underenhet => {infoFraEereg = underenhet});
    if (infoFraEereg !== tomEnhetsregOrg) {
        if (infoFraEereg.naeringskode1.kode.startsWith('84') ) {
            amplitude.logEvent("#min-side-arbeidsgiver OFFENTLIG");
            if (infoFraEereg.institusjonellSektorkode.kode === '6500') {
                amplitude.logEvent("#min-side-arbeidsgiver Kommuneforvaltningen");
            }
            if (infoFraEereg.institusjonellSektorkode.kode === '6100') {
                amplitude.logEvent("#min-side-arbeidsgiver Statsforvaltningen");
            }
        }
        else {
            amplitude.logEvent("#min-side-arbeidsgiver PRIVAT")
        }
    }


};