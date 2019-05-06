import { Sykemelding } from "./sykemelding";
import { SyfoOppgave } from "./syfoOppgaver";

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
  console.log("hent syfo oppgaver respons", responsBody);
  return responsBody;
}
