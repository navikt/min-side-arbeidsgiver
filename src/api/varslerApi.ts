export enum Varseltype {
    BESKJED = 'BESKJED',
    OPPGAVE = 'OPPGAVE'
}

export interface Varsel {
    dato: Date;
    type: string;
    beskjed: string;
    varseltype: Varseltype;
    href: string;
}


export async function hentVarsler(): Promise<Varsel[]> {
    const respons = await fetch('/min-side-arbeidsgiver/api/varsler');
    if (respons.ok) {
        return await respons.json();
    } else {
        throw new Error('Feil ved kontakt mot baksystem.');
    }
}