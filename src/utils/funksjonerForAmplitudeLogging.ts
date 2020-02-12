import amplitude from "../utils/amplitude";
import {Tilgang} from "../App/LoginBoundary";

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
    console.log("amplitude - logging kallt");
};