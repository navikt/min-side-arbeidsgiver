import { useContext } from 'react';
import { AltinnBrev, altinnFetch, autentiserAltinnBruker, Meldingsboks } from '../api/altinnApi';
import { navtjenester } from '../altinn/tjenester';
import {
    OrganisasjonerOgTilgangerContext,
    OrganisasjonInfo,
} from './OrganisasjonerOgTilgangerProvider';
import * as Sentry from '@sentry/browser';

const { reporteeMessagesUrls } = useContext(OrganisasjonerOgTilgangerContext);

export const useAltinnMeldingsboks = (
    valgtOrganisasjon: OrganisasjonInfo | undefined
): Meldingsboks | undefined => {
    if (valgtOrganisasjon === undefined) return;
    if (valgtOrganisasjon.altinntilgang.tilskuddsbrev) {
        const messagesUrl = reporteeMessagesUrls[valgtOrganisasjon.organisasjon.OrganizationNumber];
        if (messagesUrl === undefined) return;

        const hentBrev = async () => {
            const maksBrev = 10;
            const tiltaksbrevUrl = `${messagesUrl}?$top=${
                maksBrev + 1
            }&$orderby=CreatedDate+desc&$filter=${tiltaksbrevFilter}`;
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
            const ulesteTiltaksbrevUrl = `${messagesUrl}?$top=10&$filter=${tiltaksbrevFilter}+and+Status+eq+'Ulest'`;
            const ulesteTiltaksbrev = await altinnFetch(ulesteTiltaksbrevUrl);
            const antallUlesteIRespons: number = ulesteTiltaksbrev._embedded.messages.length;
            return { antallUleste: antallUlesteIRespons };
        };

        try {
            const [brev, antallUleste] = await Promise.all([hentBrev(), hentAntallUleste()]);
            return { ...brev, ...antallUleste };
        } catch (error) {
            autentiserAltinnBruker(window.location.href);
            Sentry.captureException(
                error instanceof Error ? error : new Error(`ukjent feil: ${error}`)
            );
        }
    }
};

const tilskuddsbrev = navtjenester.tilskuddsbrev;
const tiltaksbrevFilter = `ServiceCode+eq+'${tilskuddsbrev.tjenestekode}'+and+ServiceEdition+eq+${tilskuddsbrev.tjenesteversjon}`;
