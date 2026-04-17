import React, { FC, FunctionComponent, useMemo, useState } from 'react';
import { Ekspanderbartpanel } from '../../../GeneriskeElementer/Ekspanderbartpanel';
import Organisasjonsbeskrivelse from './Organisasjonsbeskrivelse';
import { AltinntilgangAlleredeSøkt, BeOmSyfotilgang, BeOmTilgangBoks } from './TjenesteInfo';
import './BeOmTilgang.css';
import {
    Altinn3Tilgang,
    altinntjeneste,
    AltinntjenesteId,
    isAltinn2Tilgang,
    isAltinn3Tilgang,
} from '../../../altinn/tjenester';
import {
    DelegationRequestRow,
    opprettDelegationRequest,
    useDelegationRequests,
} from '../../../altinn/tilganger';
import { LinkableFragment } from '../../../GeneriskeElementer/LinkableFragment';
import { Alert, Heading, LinkCard, Tag } from '@navikt/ds-react';
import { useOrganisasjonsDetaljerContext } from '../../OrganisasjonsDetaljerContext';

type IsVisible = 'visible' | 'hidden';

const altinnLayout: Record<AltinntjenesteId, IsVisible> = {
    oppgiNarmesteleder: 'visible',

    sykefravarstatistikk: 'visible',

    rekruttering: 'hidden', // altinn 2 tjenesten er migrert og skjult fra be om tilgang. skal fjernes ette 1.mars 2026
    rekrutteringKandidater: 'visible',
    rekrutteringStillingsannonser: 'visible',

    arbeidsforhold: 'visible',

    permitteringOgNedbemanning: 'visible',

    inntektsmelding: 'hidden',
    inntektsmeldingSykepenger: 'visible',
    inntektsmeldingForeldrepenger: 'visible',
    inntektsmeldingSykdomIFamilien: 'visible',
    refusjonskravSykepengerAGP: 'visible',

    arbeidstrening: 'visible',
    yrkesskade: 'visible',
    midlertidigLønnstilskudd: 'visible',
    varigLønnstilskudd: 'visible',
    varigTilrettelagtArbeid: 'visible',
    sommerjobb: 'visible',
    ekspertbistand: 'visible',
    inkluderingstilskudd: 'visible',
    mentortilskudd: 'visible',
    tiltaksrefusjon: 'visible',
    tilskuddsbrev: 'hidden', // tilskuddsbrev vises ikke på min side i dag, derfor ble den fjernet ref: https://jira.adeo.no/browse/TAG-2179

    utsendtArbeidstakerEØS: 'hidden',
    endreBankkontonummerForRefusjoner: 'hidden', // dette skal aldri vises i be om tilgang
};

const tjenesteRekkefølge = Object.entries(altinnLayout)
    .filter(([_, v]) => v === 'visible')
    .map(([id]) => id as AltinntjenesteId);

// Statuser der brukeren venter på behandling eller har fått tilgang — vi viser "etterspurt" for disse.
// Draft håndteres separat: har forespørselen en detailsLink lenker vi dit, ellers kan brukeren sende på nytt.
// Rejected/Withdrawn lar vi falle tilbake til normal "be om tilgang"-knapp slik at brukeren kan prøve igjen.
const ETTERSPURT_STATUSER = new Set<string>(['None', 'Pending', 'Approved']);

const BeOmTilgang: FunctionComponent = () => {
    const { valgtOrganisasjon } = useOrganisasjonsDetaljerContext();
    const delegationRequests = useDelegationRequests();
    const [pågår, setPågår] = useState<Set<AltinntjenesteId>>(new Set());

    const requestByRessurs = useMemo(() => {
        const orgnr = valgtOrganisasjon.organisasjon.orgnr;
        const map = new Map<string, DelegationRequestRow>();
        for (const row of delegationRequests) {
            if (row.orgnr === orgnr) {
                // sorted newest first by backend — keep first seen
                if (!map.has(row.resourceReferenceId)) {
                    map.set(row.resourceReferenceId, row);
                }
            }
        }
        return map;
    }, [delegationRequests, valgtOrganisasjon.organisasjon.orgnr]);

    const opprettSøknad = (altinnId: AltinntjenesteId, altinn3Tilgang: Altinn3Tilgang) => {
        if (pågår.has(altinnId)) {
            return;
        }
        setPågår((prev) => new Set(prev).add(altinnId));
        opprettDelegationRequest({
            orgnr: valgtOrganisasjon.organisasjon.orgnr,
            altinn3Tilgang: altinn3Tilgang,
        })
            .then((response) => {
                // Altinn returnerer Draft + detailsLink når brukeren må fullføre forespørselen i Altinn.
                const detailsLink = response?.links?.detailsLink;
                if (
                    response?.status === 'Draft' &&
                    detailsLink !== undefined &&
                    detailsLink !== null &&
                    detailsLink !== ''
                ) {
                    window.location.assign(detailsLink);
                }
            })
            .catch(() => {
                /* feil ved opprettelse, brukeren kan prøve igjen */
            })
            .finally(() => {
                setPågår((prev) => {
                    const next = new Set(prev);
                    next.delete(altinnId);
                    return next;
                });
            });
    };

    const tjenesteinfoBokser: React.JSX.Element[] = [];

    if (valgtOrganisasjon.syfotilgang && !valgtOrganisasjon.vilkaarligAltinntilgang) {
        return (
            <TilgangContainer>
                <LinkCard>
                    <LinkCard.Title>
                        <LinkCard.Anchor href="https://www.nav.no/arbeidsgiver/tilganger#tilganger">
                            Du mangler tilgang i Altinn
                        </LinkCard.Anchor>
                    </LinkCard.Title>
                    <LinkCard.Description>
                        Noen i virksomheten må gi deg riktig tilgang i Altinn. Nå er du kun satt opp
                        som nærmeste leder.
                    </LinkCard.Description>
                </LinkCard>
            </TilgangContainer>
        );
    }

    if (!valgtOrganisasjon.syfotilgang) {
        tjenesteinfoBokser.push(<BeOmSyfotilgang />);
    }

    if (valgtOrganisasjon.vilkaarligAltinntilgang) {
        for (const altinnId of tjenesteRekkefølge) {
            const tilgang = valgtOrganisasjon.altinntilgang[altinnId];
            const altinnTjeneste = altinntjeneste[altinnId];
            if (tilgang === true) {
                /* har tilgang -- ingen ting å vise */
            } else if (isAltinn3Tilgang(altinnTjeneste)) {
                const altinn3 = altinnTjeneste as Altinn3Tilgang;
                const eksisterende = requestByRessurs.get(altinn3.ressurs);

                const draftDetailsLink =
                    eksisterende?.status === 'Draft' &&
                    eksisterende.detailsLink !== undefined &&
                    eksisterende.detailsLink !== null &&
                    eksisterende.detailsLink !== ''
                        ? eksisterende.detailsLink
                        : undefined;

                if (eksisterende && ETTERSPURT_STATUSER.has(eksisterende.status)) {
                    tjenesteinfoBokser.push(
                        <AltinntilgangAlleredeSøkt
                            altinnId={altinnId}
                            status="Tilgang etterspurt"
                            statusBeskrivelse="Du har bedt om tilgang. En administrator i virksomheten må godkjenne forespørselen."
                            type="suksess"
                        />
                    );
                } else if (draftDetailsLink !== undefined) {
                    // Draft med detailsLink → fortsett forespørselen i Altinn
                    tjenesteinfoBokser.push(
                        <BeOmTilgangBoks altinnId={altinnId} href={draftDetailsLink} eksternSide />
                    );
                } else if (eksisterende?.status === 'Rejected') {
                    tjenesteinfoBokser.push(
                        <>
                            <div className="header">
                                <Tag
                                    className="tilgang-avvist-etikett"
                                    variant="warning"
                                    size="medium"
                                >
                                    Forespørsel avvist
                                </Tag>
                            </div>
                            <BeOmTilgangBoks
                                altinnId={altinnId}
                                onClick={() => opprettSøknad(altinnId, altinn3)}
                            />
                        </>
                    );
                } else {
                    // ingen request, Withdrawn, eller Draft uten detailsLink → la brukeren sende (på nytt)
                    tjenesteinfoBokser.push(
                        <BeOmTilgangBoks
                            altinnId={altinnId}
                            onClick={() => opprettSøknad(altinnId, altinn3)}
                        />
                    );
                }
            } else if (isAltinn2Tilgang(altinnTjeneste)) {
                /* altinn 2 tjenester er ikke lenger søkbare via delegation request */
                tjenesteinfoBokser.push(<BeOmTilgangBoks altinnId={altinnId} />);
            }
        }
    }
    if (tjenesteinfoBokser.length <= 0) {
        return null;
    }

    return (
        <TilgangContainer>
            <Ekspanderbartpanel
                tittel="Tjenester du kan be om tilgang til"
                apen={
                    new URLSearchParams(window.location.search).get('fragment') === 'be-om-tilgang'
                }
            >
                <div className="be-om-tilgang__innhold">
                    <Alert variant="info" size="medium" className="be-om-tilgang__info">
                        Du har ikke rettighetene som kreves for å bruke disse tjenestene. Du kan be
                        om tilgang til de spesifikke tjenestene ved å følge lenkene under.
                    </Alert>
                    <Organisasjonsbeskrivelse
                        navn={valgtOrganisasjon.organisasjon.navn}
                        orgnummer={valgtOrganisasjon.organisasjon.orgnr}
                    />
                    <ul className="be-om-tilgang__tjenesteinfo-bokser">
                        {tjenesteinfoBokser.map((tjenesteinfoboks, index) => (
                            <li key={index} className="be-om-tilgang__tjenesteinfo">
                                {tjenesteinfoboks}
                            </li>
                        ))}
                    </ul>
                </div>
            </Ekspanderbartpanel>
        </TilgangContainer>
    );
};

const TilgangContainer: FC<{
    children: React.JSX.Element;
}> = ({ children }) => (
    <LinkableFragment fragment="be-om-tilgang">
        <div className="be-om-tilgang">
            <div className="be-om-tilgang__tittel">
                <div className="divider" />
                <Heading size="small" level="2" className="tekst">
                    Trenger du tilgang til flere tjenester?
                </Heading>
                <div className="divider" />
            </div>
            {children}
        </div>
    </LinkableFragment>
);

export default BeOmTilgang;
