export enum Varseltype {
    BESKJED = 'BESKJED',
    OPPGAVE = 'OPPGAVE',
}

export interface Varsel {
    //id: string;
    //dato: Date;
    //type: string;
    //beskjed: string;
    //varseltype: Varseltype;
    //href: string;
    //lest: boolean;
    merkelapp: string;
    tekst: string;
    lenke: string;
    opprettetTidspunkt: string;
}

export async function hentVarsler(): Promise<Varsel[]> {
    const respons = await fetch(
        '/api/graphql',{
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                query: `
                {
                    notifikasjoner {
                        ... on Beskjed {
                            tekst
                            lenke 
                            merkelapp
                            opprettetTidspunkt
                        }
                    }
                }
                `
            })
    });
    if (respons.ok) {
        const result = await respons.json();
        return result.data.notifikasjoner
    } else {
        throw new Error('Feil ved kontakt mot baksystem.');
    }
}

export async function settTrykketPaaBjelle(tidspunkt: string): Promise<string> {
    // const respons = await fetch(`/min-side-arbeidsgiver/api/varsler/harsettvarsler/${tidspunkt}`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(tidspunkt),
    //     credentials: 'include',
    // });
    // if (respons.status >= 200 && respons.status < 300) {
    //     return await respons.json();
    // } else {
    //     throw new Error('Feil ved kontakt mot baksystem.');
    // }
    return ""
}

export async function settVarselSomLest(id: string): Promise<string> {
    // const respons = await fetch(`/min-side-arbeidsgiver/api/varsler/erlest/${id}`, {
    //     method: 'POST',
    //     headers: { 'Content-Type': 'application/json' },
    //     body: JSON.stringify(id),
    //     credentials: 'include',
    // });
    // if (respons.status >= 200 && respons.status < 300) {
    //     return await respons.json();
    // } else {
    //     throw new Error('Feil ved kontakt mot baksystem.');
    // }
    return ""
}
