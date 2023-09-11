import { caseMiljo, gittMiljo } from '../utils/environment';
import { navtjenester } from '../altinn/tjenester';
import { useEffect } from 'react';

export const altinnUrl = gittMiljo({
    prod: 'https://altinn.no',
    dev: 'https://tt02.altinn.no',
    other: '/min-side-arbeidsgiver/mock/tt02.altinn.no',
});

export enum Status {
    Ulest = 'Ulest',
    Lest = 'Lest',
}

export interface AltinnBrev {
    key: string;
    tittel: string;
    status: Status;
    portalview: string;
    datoSendt: Date;
}

export interface Meldingsboks {
    brev: AltinnBrev[];
    finnesFlereBrev: boolean;
    antallUleste: number;
    portalview: string;
}

// Map fra organisasjons-nummer til url for reportee messages api endpoint
export type ReporteeMessagesUrls = {
    [orgnr: string]: string | undefined;
};

/* Autentiserer mot altinn på nytt, men gjør ingen ting hvis
 * vi allerede har prøvd nylig.
 */
export const autentiserAltinnBruker = (returnUrl: string) => {
    const storageName = 'altinn-redirect-time';
    const lastRedirect = parseInt(sessionStorage.getItem(storageName) ?? '0');
    const now = Date.now();
    const second = 1_000; /* i millisekunder */

    caseMiljo({
        prod: () => {
            if (lastRedirect < now - 60 * second) {
                sessionStorage.setItem(storageName, now.toString());
                const encodedUri = encodeURIComponent(returnUrl);
                window.location.replace(
                    `${altinnUrl}/Pages/ExternalAuthentication/Redirect.aspx?returnUrl=${encodedUri}`
                );
            }
        },
        other: () => {
            /* disable redirect outside prod. enable if needed */
        },
    });
};

export const altinnFetch = async (info: RequestInfo) => {
    const props: RequestInit = {
        redirect: 'manual',
        credentials: 'include',
        headers: {
            accept: 'application/hal+json',
            /* Apikeys av typen 'nettleserapplikasjon' er ikke hemmeligheter.
             * se https://altinn.github.io/docs/api/#api-key  */
            apikey: gittMiljo({
                prod: 'DE7173AF-3A43-47E3-A7A2-E8AB4D88C253',
                other: '2C585F91-5741-4568-8FD7-3807A45AFDD7',
            }),
        },
    };

    const response = await fetch(info, props);
    if (response.ok) {
        return response.json();
    } else {
        throw new Error(`fetch ${info}: http-status ${response.status}`);
    }
};

export const hentAltinnRaporteeIdentiteter: () => Promise<
    ReporteeMessagesUrls | Error
> = async () => {
    try {
        const body = await altinnFetch(`${altinnUrl}/api/reportees`);
        const reportees = body._embedded.reportees;
        const result: ReporteeMessagesUrls = {};
        reportees.forEach((element: any) => {
            const orgnr: string = element.OrganizationNumber;
            result[orgnr] = element._links.messages.href;
        });
        return result;
    } catch (error) {
        return error instanceof Error ? error : new Error(`ukjent feil: ${error}`);
    }
};
