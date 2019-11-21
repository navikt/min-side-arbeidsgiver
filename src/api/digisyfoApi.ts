import { Sykemelding } from '../Objekter/sykemelding';
import { SyfoOppgave } from '../Objekter/syfoOppgaver';
import { AnsattSyfo } from '../Objekter/AnsattSyfo';
import { digisyfoSykemeldteLenke } from '../lenker';

export async function hentSykemeldinger(): Promise<Array<Sykemelding>> {
    let responsBody = {} as Array<Sykemelding>;
    const respons = await fetch('/min-side-arbeidsgiver/api/sykemeldinger', {
        method: 'GET',
        credentials: 'include',
    });
    if (respons.ok) {
        responsBody = await respons.json();
    }
    return responsBody;
}

export async function hentSyfoOppgaver(): Promise<Array<SyfoOppgave>> {
    let responsBody = {} as Array<SyfoOppgave>;
    const respons = await fetch('/min-side-arbeidsgiver/api/syfooppgaver', {
        method: 'GET',
        credentials: 'include',
    });
    if (respons.ok) {
        responsBody = await respons.json();
        return responsBody;
    }
    throw new Error('Feil ved kontakt med digisyfo oppgave api');

}

export async function hentNarmesteAnsate(): Promise<Array<AnsattSyfo>> {
    let responseBody = {} as Array<AnsattSyfo>;
    const response = await fetch(digisyfoSykemeldteLenke(), { method: 'GET' });
    if (response.ok) {
        responseBody = await response.json();
    }
    return responseBody;
}
