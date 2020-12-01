import { altinnUrl } from '../lenker';
import environment from '../utils/environment';
import { navtjenester } from '../altinn/tjenester';

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
    antallUleste: string;
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

    if (lastRedirect < now - 60 * second) {
        sessionStorage.setItem(storageName, now.toString());
        const encodedUri = encodeURIComponent(returnUrl);
        window.location.replace(
            `${altinnUrl}/Pages/ExternalAuthentication/Redirect.aspx?returnUrl=${encodedUri}`
        );
    }
};

const altinnFetch = async (info: RequestInfo) => {
    const props: RequestInit = {
        redirect: 'manual',
        credentials: 'include',
        headers: {
            accept: 'application/hal+json',
            /* Apikeys av typen 'nettleserapplikasjon' er ikke hemmeligheter.
             * se https://altinn.github.io/docs/api/#api-key  */
            apikey:
                environment.MILJO === 'prod-sbs'
                    ? 'DE7173AF-3A43-47E3-A7A2-E8AB4D88C253'
                    : '2C585F91-5741-4568-8FD7-3807A45AFDD7',
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
        return error;
    }
};


const tilskuddsbrev = navtjenester.tilskuddsbrev

const tiltaksbrevFilter =
    `ServiceCode+eq+'${tilskuddsbrev.tjenestekode}'+and+ServiceEdition+eq+${tilskuddsbrev.tjenesteversjon}`;

export const hentMeldingsboks = async (meldingsboksUrl: string): Promise<Meldingsboks | Error> => {
    const hentBrev = async () => {
        const maksBrev = 10;
        const tiltaksbrevUrl = `${meldingsboksUrl}?$top=${maksBrev +
            1}&$orderby=CreatedDate+desc&$filter=${tiltaksbrevFilter}`;
        const tiltaksbrev = await altinnFetch(tiltaksbrevUrl);
        const alleBrevIRespons: AltinnBrev[] = tiltaksbrev._embedded.messages.map(
            (responsBrev: any): AltinnBrev => ({
                key: responsBrev.MessageId,
                tittel: responsBrev.Subject,
                status: responsBrev.Status,
                datoSendt: new Date(responsBrev.CreatedDate),
                portalview: responsBrev._links.portalview.href,
            })
        );

        const portalview: string = tiltaksbrev._links.portalview.href;
        const finnesFlereBrev = alleBrevIRespons.length >= maksBrev;
        const brev = alleBrevIRespons.slice(0, maksBrev);
        return { portalview, brev, finnesFlereBrev };
    };

    const hentAntallUleste = async () => {
        const ulesteTiltaksbrevUrl = `${meldingsboksUrl}?$top=10&$filter=${tiltaksbrevFilter}+and+Status+eq+'Ulest'`;
        const ulesteTiltaksbrev = await altinnFetch(ulesteTiltaksbrevUrl);
        const antallUlesteIRespons: number = ulesteTiltaksbrev._embedded.messages.length;
        const antallUleste = antallUlesteIRespons <= 9 ? antallUlesteIRespons.toString() : '9+';
        return { antallUleste };
    };

    try {
        const [brev, antallUleste] = await Promise.all([hentBrev(), hentAntallUleste()]);
        return { ...brev, ...antallUleste };
    } catch (error) {
        return error;
    }
};
