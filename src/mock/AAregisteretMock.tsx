import fetchMock from 'fetch-mock';
import { Mocksrespons, ObjektFraAAregisteret } from '../Objekter/Ansatte';

const mockObjekt: ObjektFraAAregisteret = Mocksrespons;

export const LagRespons = (
    liteObjekt: ObjektFraAAregisteret,
    antallArbeidsForhold: number
): ObjektFraAAregisteret => {
    let StortObjekt: ObjektFraAAregisteret = liteObjekt;
    let a: number = 0;
    for (let i: number = 0; i < antallArbeidsForhold / 4; i++) {
        StortObjekt.arbeidsforholdoversikter.push(liteObjekt.arbeidsforholdoversikter[0]);
        a = a + 1;
        StortObjekt.arbeidsforholdoversikter[i].navn = 'Guro';
    }
    for (let j: number = 25; j < antallArbeidsForhold / 2; j++) {
        StortObjekt.arbeidsforholdoversikter.push(liteObjekt.arbeidsforholdoversikter[0]);
        a = a + 1;
        StortObjekt.arbeidsforholdoversikter[j].navn = 'Mons';
    }
    for (let k: number = 50; k < antallArbeidsForhold / (3 / 4); k++) {
        StortObjekt.arbeidsforholdoversikter.push(liteObjekt.arbeidsforholdoversikter[0]);
        a = a + 1;
        StortObjekt.arbeidsforholdoversikter[k].navn = 'Kjartan';
    }
    for (let l: number = 75; l < antallArbeidsForhold; l++) {
        StortObjekt.arbeidsforholdoversikter.push(liteObjekt.arbeidsforholdoversikter[0]);
        a = a + 1;
        StortObjekt.arbeidsforholdoversikter[l].navn = 'Kjartan';
    }
    return StortObjekt;
};

export const TestObjekt: ObjektFraAAregisteret = LagRespons(mockObjekt, 100);

fetchMock.get('https://www.facebook.com/', TestObjekt);
