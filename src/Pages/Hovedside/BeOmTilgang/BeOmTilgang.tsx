import React, { FC, FunctionComponent, MouseEventHandler } from 'react';
import { Ekspanderbartpanel } from '../../../GeneriskeElementer/Ekspanderbartpanel';
import { OrganisasjonInfo } from '../../OrganisasjonerOgTilgangerContext';
import Organisasjonsbeskrivelse from './Organisasjonsbeskrivelse';
import { BeOmSyfotilgang, BeOmTilgangBoks } from './TjenesteInfo';
import './BeOmTilgang.css';
import {
    Altinn3Tilgang,
    altinntjeneste,
    AltinntjenesteId,
    isAltinn2Tilgang,
    isAltinn3Tilgang,
} from '../../../altinn/tjenester';
import { opprettDelegationRequest } from '../../../altinn/tilganger';
import { LinkableFragment } from '../../../GeneriskeElementer/LinkableFragment';
import { Alert, Heading, LinkCard } from '@navikt/ds-react';
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

    inntektsmelding: 'visible',

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

const opprettSøknad = (
    altinn3Tilgang: Altinn3Tilgang,
    valgtOrganisasjon: OrganisasjonInfo
): MouseEventHandler<unknown> => {
    let harTrykket = false; /* ikke opprett to søknader hvis bruker klikker raskt på knappen. */
    return () => {
        if (harTrykket) {
            return;
        }
        harTrykket = true;
        opprettDelegationRequest({
            orgnr: valgtOrganisasjon.organisasjon.orgnr,
            altinn3Tilgang: altinn3Tilgang,
        })
            .then((response) => {
                const detailsLink = response?.links?.detailsLink;
                if (detailsLink != null && detailsLink !== '') {
                    window.location.href = detailsLink;
                }
            })
            .catch(() => {
                /* feil ved opprettelse av delegation request, brukeren kan prøve igjen */
                harTrykket = false;
            });
    };
};

const BeOmTilgang: FunctionComponent = () => {
    const { valgtOrganisasjon } = useOrganisasjonsDetaljerContext();

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
        for (let altinnId of tjenesteRekkefølge) {
            const tilgang = valgtOrganisasjon.altinntilgang[altinnId];
            const altinnTjeneste = altinntjeneste[altinnId];
            if (tilgang === true) {
                /* har tilgang -- ingen ting å vise */
            } else if (isAltinn3Tilgang(altinnTjeneste)) {
                tjenesteinfoBokser.push(
                    <BeOmTilgangBoks
                        altinnId={altinnId}
                        onClick={opprettSøknad(altinnTjeneste as Altinn3Tilgang, valgtOrganisasjon)}
                    />
                );
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
