import {Sykemelding} from "./sykemelding";

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
