import amplitude from "../utils/amplitude";
import {Tilgang} from "../App/LoginBoundary";

export const loggTilgangsKombinasjonAvTjenestebokser = (tilgangsArray: Tilgang[]) => {
    let skalLogges = "#min-side-arbeidsgiver ";
    if (tilgangsArray[0] === Tilgang.TILGANG) {
        skalLogges +="tilgang-syfo"
    }
    else {
        skalLogges +="ikke-tilgang-syfo";
    }
    if (tilgangsArray[1] === Tilgang.TILGANG) {
        skalLogges +=" tilgang-PAM"
    }
    else {
        skalLogges += " ikke-tilgang-PAM";
    }
    if (tilgangsArray[2] === Tilgang.TILGANG) {
        skalLogges +=" tilgang-IA"
    }
    else {
        skalLogges +=" ikke-tilgang-tilgang-IA";
    }
    if (tilgangsArray[3] === Tilgang.TILGANG) {
        skalLogges += " tilgang-Arbeidstrening"
    }
    else {
        skalLogges +=" ikke-tilgang-arbeidstrening"
    }
    console.log(skalLogges);
    amplitude.logEvent(skalLogges);
};