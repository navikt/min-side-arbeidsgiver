import { altinnUrl } from '../lenker';
import environment from '../utils/environment';

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
    antallUleste: number | 'mange';
    portalview: string;
}

// Map fra organisasjons-nummer til url for reportee messages api endpoint
export type ReporteeMessagesUrls = {
    [orgnr: string]: string | undefined;
};

/* Apikeys av typen 'nettleserapplikasjon' er ikke hemmeligheter.
 * se https://altinn.github.io/docs/api/#api-key  */
const altinnApiKey = () =>
    environment.MILJO === 'prod-sbs'
        ? 'DE7173AF-3A43-47E3-A7A2-E8AB4D88C253'
        : '2C585F91-5741-4568-8FD7-3807A45AFDD7';

const fetchProps = (): RequestInit => ({
    redirect: 'manual',
    credentials: 'include',
    headers: {
        accept: 'application/hal+json',
        apikey: altinnApiKey(),
    },
});

const fetchJsonBody = async (info: RequestInfo, init?: RequestInit) => {
    const response = await fetch(info, init);
    if (response.ok) {
        return await response.json();
    } else {
        throw new Error(`fetch ${info}: http-status ${response.status}`);
    }
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
            `${altinnUrl()}/Pages/ExternalAuthentication/Redirect.aspx?returnUrl=${encodedUri}`
        );
    }
};

export const hentAltinnRaporteeIdentiteter: () => Promise<
    ReporteeMessagesUrls | Error
> = async () => {
    try {
        const body = await fetchJsonBody(`${altinnUrl()}/api/reportees`, fetchProps());
        const reportees = body['_embedded']['reportees'];
        const result: ReporteeMessagesUrls = {};
        reportees.forEach((element: any) => {
            const orgnr: string = element['OrganizationNumber'];
            result[orgnr] = element['_links']['messages']['href'];
        });
        return result;
    } catch (error) {
        console.error(error);
        return error;
    }
};

export const hentMeldingsboks = async (meldingsboksUrl: string): Promise<Meldingsboks | Error> => {
    const hentBrev = async () => {
        const maksBrev = 10;
        const tiltaksbrevUrl = `${meldingsboksUrl}?$top=${maksBrev +
            1}&$orderby=CreatedDate+desc&$filter=ServiceCode+eq+'5278'+and+ServiceEdition+eq+1`;
        const tiltaksbrev = await fetchJsonBody(tiltaksbrevUrl, fetchProps());

        const portalview: string = tiltaksbrev['_links']['portalview']['href'];
        const alleBrevIRespons: AltinnBrev[] = tiltaksbrev['_embedded']['messages'].map(
            (brev: any): AltinnBrev => ({
                key: brev['MessageId'],
                tittel: brev['Subject'],
                status: brev['Status'],
                datoSendt: new Date(brev['CreatedDate']),
                portalview: brev['_links']['portalview']['href'],
            })
        );
        const finnesFlereBrev = alleBrevIRespons.length >= maksBrev;
        const brev = alleBrevIRespons.slice(0, maksBrev);
        return { portalview, brev, finnesFlereBrev };
    };

    const hentAntallUleste = async () => {
        const ulesteTiltaksbrevUrl = `${meldingsboksUrl}?$top=10&$filter=ServiceCode+eq+'5278'+and+ServiceEdition+eq+1+and+Status+eq+'Ulest'`;
        const ulesteTiltaksbrev = await fetchJsonBody(ulesteTiltaksbrevUrl, fetchProps());
        const antallUlesteIRespons: number = ulesteTiltaksbrev['_embedded']['messages'].length;
        const antallUleste: number | 'mange' =
            antallUlesteIRespons <= 9 ? antallUlesteIRespons : 'mange';
        return { antallUleste };
    };

    try {
        const [brev, antallUleste] = await Promise.all([hentBrev(), hentAntallUleste()]);
        return { ...brev, ...antallUleste };
    } catch (error) {
        console.error(error);
        return error;
    }
};
