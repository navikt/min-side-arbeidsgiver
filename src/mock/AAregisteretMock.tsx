import fetchMock from 'fetch-mock';
import { arbeidstaker, Mocksrespons, ObjektFraAAregisteret } from '../Objekter/Ansatte';

const mockObjekt: ObjektFraAAregisteret = Mocksrespons;

export const LagRespons = (
    liteObjekt: ObjektFraAAregisteret,
    antallArbeidsForhold: number
): ObjektFraAAregisteret => {
    let StortObjekt: ObjektFraAAregisteret = liteObjekt;
    let a: number = 0;
    for (let i: number = 0; i < antallArbeidsForhold; i++) {
        StortObjekt.arbeidsforholdoversikter.push(liteObjekt.arbeidsforholdoversikter[0]);
        a = a + 1;
        StortObjekt.arbeidsforholdoversikter[i].navn = 'Guro';
    }
    let id: number = 0;
    StortObjekt.arbeidsforholdoversikter.forEach(forhold => {
        forhold.navn = 'Kari' + id.toString();
        id++;
    });
    return StortObjekt;
};

export const TestObjekt: ObjektFraAAregisteret = LagRespons(mockObjekt, 100);

fetchMock.get('https://www.facebook.com/', TestObjekt);
