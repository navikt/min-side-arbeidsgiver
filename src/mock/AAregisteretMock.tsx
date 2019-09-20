import fetchMock from 'fetch-mock';
import {
    arbeidstaker,
    eksempel1,
    eksempel2,
    eksempel3,
    Mocksrespons,
    ObjektFraAAregisteret,
} from '../Objekter/Ansatte';

const mockObjekt: ObjektFraAAregisteret = Mocksrespons;

export const LagRespons = (
    liteObjekt: ObjektFraAAregisteret,
    antallArbeidsForhold: number
): ObjektFraAAregisteret => {
    let StortObjekt: ObjektFraAAregisteret = liteObjekt;

    for (let i: number = 0; i < antallArbeidsForhold / 4; i++) {
        StortObjekt.arbeidsforholdoversikter.push(eksempel1);
    }
    for (let i: number = antallArbeidsForhold / 4; i < antallArbeidsForhold / 2; i++) {
        StortObjekt.arbeidsforholdoversikter.push(eksempel2);
    }
    for (let i: number = antallArbeidsForhold / 2; i < antallArbeidsForhold; i++) {
        StortObjekt.arbeidsforholdoversikter.push(eksempel3);
    }

    return StortObjekt;
};

export const TestObjekt: ObjektFraAAregisteret = LagRespons(mockObjekt, 100);

fetchMock.get('https://www.facebook.com/', TestObjekt);
