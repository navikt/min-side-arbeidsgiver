import { useContext } from 'react';
import { AltinnBrev, altinnFetch, autentiserAltinnBruker, Meldingsboks } from '../api/altinnApi';
import { navtjenester } from '../altinn/tjenester';
import {
    OrganisasjonerOgTilgangerContext,
    OrganisasjonInfo,
} from './OrganisasjonerOgTilgangerProvider';
import useSWR from 'swr';

export const useAltinnMeldingsboks = (
    valgtOrganisasjon: OrganisasjonInfo | undefined
): Meldingsboks | undefined => {
    const { reporteeMessagesUrls } = useContext(OrganisasjonerOgTilgangerContext);

    const messagesUrl =
        valgtOrganisasjon?.altinntilgang.tilskuddsbrev !== undefined
            ? reporteeMessagesUrls[valgtOrganisasjon.organisasjon.OrganizationNumber]
            : undefined;

    const { data: brev, error: brevError } = useSWR(
        messagesUrl !== undefined
            ? `${messagesUrl}?$orderby=CreatedDate+desc&$filter=${tiltaksbrevFilter}`
            : null,
        hentBrev
    );
    const { data: antallUleste, error: ulesteError } = useSWR(
        messagesUrl !== undefined
            ? `${messagesUrl}?$top=10&$filter=${tiltaksbrevFilter}+and+Status+eq+'Ulest'`
            : null,
        hentAntallUleste
    );

    if (brevError !== undefined || ulesteError !== undefined) {
        autentiserAltinnBruker(window.location.href);
    } else if (brev === undefined || antallUleste === undefined) {
        return;
    } else {
        return { ...brev, ...antallUleste };
    }
};

const tilskuddsbrev = navtjenester.tilskuddsbrev;
const tiltaksbrevFilter = `ServiceCode+eq+'${tilskuddsbrev.tjenestekode}'+and+ServiceEdition+eq+${tilskuddsbrev.tjenesteversjon}`;

const hentBrev = async (tiltaksbrevURL: string) => {
    const maksBrev = 10;
    const tiltaksbrev = await altinnFetch(`${tiltaksbrevURL}&$top=${maksBrev + 1}`);
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

const hentAntallUleste = async (ulesteTiltaksbrevUrl: string) => {
    const ulesteTiltaksbrev = await altinnFetch(ulesteTiltaksbrevUrl);
    const antallUlesteIRespons: number = ulesteTiltaksbrev._embedded.messages.length;
    return { antallUleste: antallUlesteIRespons };
};
