import fetchMock from 'fetch-mock';
import { Mocksrespons, ObjektFraAAregisteret } from '../Objekter/Ansatte';

const mockObjekt: ObjektFraAAregisteret = Mocksrespons;

export const LagRespons = (
    liteObjekt: ObjektFraAAregisteret,
    antallArbeidsForhold: number
): ObjektFraAAregisteret => {
    let StortObjekt: ObjektFraAAregisteret = liteObjekt;
    for (let i: number = 1; i < antallArbeidsForhold; i++) {
        StortObjekt.arbeidsforholdoversikter.push(liteObjekt.arbeidsforholdoversikter[0]);
        StortObjekt.arbeidsforholdoversikter[i].navn =
            liteObjekt.arbeidsforholdoversikter[0] + i.toString();
    }
    return StortObjekt;
};

export const TestObjekt: ObjektFraAAregisteret = LagRespons(mockObjekt, 1000);

fetchMock.get('https://www.facebook.com/', TestObjekt);
