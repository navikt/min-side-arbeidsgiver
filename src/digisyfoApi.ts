import { Sykemelding } from "./sykemelding";
import { SyfoOppgave } from "./syfoOppgaver";
import {AnsattSyfo} from "./AnsattSyfo";
import {digisyfoSykemeldteLenke} from "./lenker";

export async function hentSykemeldinger(): Promise<Array<Sykemelding>> {
  let responsBody = {} as Array<Sykemelding>;
  const respons = await fetch("/ditt-nav-arbeidsgiver/api/sykemeldinger", {
    method: "GET",
    credentials: "include"
  });
  if (respons.ok) {
    responsBody = await respons.json();
  }
  return responsBody;
}

export async function hentSyfoOppgaver(): Promise<Array<SyfoOppgave>> {
  let responsBody = {} as Array<SyfoOppgave>;
  const respons = await fetch("/ditt-nav-arbeidsgiver/api/syfooppgaver", {
    method: "GET",
    credentials: "include"
  });
  if (respons.ok) {
    responsBody = await respons.json();
  }
  return responsBody;
}

export async function hentNarmesteAnsate(): Promise<Array<AnsattSyfo>> {
  let responseBody={} as Array<AnsattSyfo>;
  const response = await fetch(digisyfoSykemeldteLenke(),{method:"GET"});
  if(response.ok){
    responseBody = await response.json();
  }
  return responseBody;
}
