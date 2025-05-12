import React, { FC, FunctionComponent, MouseEventHandler } from 'react';
import { Ekspanderbartpanel } from '../../../GeneriskeElementer/Ekspanderbartpanel';
import { OrganisasjonInfo } from '../../OrganisasjonerOgTilgangerContext';
import Organisasjonsbeskrivelse from './Organisasjonsbeskrivelse';
import { AltinntilgangAlleredeSøkt, BeOmSyfotilgang, BeOmTilgangBoks } from './TjenesteInfo';
import './BeOmTilgang.css';
import {
    Altinn2Tilgang,
    altinntjeneste,
    AltinntjenesteId,
    isAltinn2Tilgang,
    isAltinn3Tilgang,
} from '../../../altinn/tjenester';
import { opprettAltinnTilgangssøknad } from '../../../altinn/tilganger';
import { beOmTilgangIAltinnLink } from '../../../lenker';
import { LinkableFragment } from '../../../GeneriskeElementer/LinkableFragment';
import { Alert, BodyShort, Heading } from '@navikt/ds-react';
import { useOrganisasjonsDetaljerContext } from '../../OrganisasjonsDetaljerContext';
import { useOrganisasjonerOgTilgangerContext } from '../../OrganisasjonerOgTilgangerContext';

const altinnIdIRekkefølge: AltinntjenesteId[] = [
    'rekruttering',
    'forebyggefravar',
    'sykefravarstatistikk',
    'arbeidstrening',
    'arbeidsforhold',
    'yrkesskade',
    'midlertidigLønnstilskudd',
    'varigLønnstilskudd',
    'varigTilrettelagtArbeid',
    'sommerjobb',
    'ekspertbistand',
    'inkluderingstilskudd',
    'mentortilskudd',
    'inntektsmelding',
];

const beOmTilgangUrlFallback = (
    altinn2Tilgang: Altinn2Tilgang,
    valgtOrganisasjon: OrganisasjonInfo
): string => {
    return beOmTilgangIAltinnLink(
        valgtOrganisasjon.organisasjon.orgnr,
        altinn2Tilgang.tjenestekode,
        altinn2Tilgang.tjenesteversjon
    );
};

const opprettSøknad = (
    altinn2Tilgang: Altinn2Tilgang,
    valgtOrganisasjon: OrganisasjonInfo
): MouseEventHandler<unknown> => {
    let harTrykket = false; /* ikke opprett to søknader hvis bruker klikker raskt på knappen. */
    return () => {
        if (harTrykket) {
            return;
        }
        harTrykket = true;
        const redirectUrl = new URL(window.location.href);
        redirectUrl.searchParams.set('fragment', 'be-om-tilgang');
        opprettAltinnTilgangssøknad({
            orgnr: valgtOrganisasjon.organisasjon.orgnr,
            altinn2Tilgang: altinn2Tilgang,
            redirectUrl: redirectUrl.toString(),
        })
            .then((søknad) => {
                if (søknad === null) {
                    window.location.href = beOmTilgangUrlFallback(
                        altinn2Tilgang,
                        valgtOrganisasjon
                    );
                } else {
                    window.location.href = søknad.submitUrl;
                }
            })
            .catch(() => {
                window.location.href = beOmTilgangUrlFallback(altinn2Tilgang, valgtOrganisasjon);
            });
    };
};

const BeOmTilgang: FunctionComponent = () => {
    const { valgtOrganisasjon } = useOrganisasjonsDetaljerContext();
    const { altinnTilgangssøknad } = useOrganisasjonerOgTilgangerContext();

    const tjenesteinfoBokser: React.JSX.Element[] = [];

    if (valgtOrganisasjon.syfotilgang && !valgtOrganisasjon.reporteetilgang) {
        return (
            <TilgangContainer>
                <BodyShort>
                    Noen i virksomheten må gi deg riktig tilgang i Altinn. Nå er du kun satt opp som
                    nærmeste leder.
                </BodyShort>
            </TilgangContainer>
        );
    }

    if (!valgtOrganisasjon.syfotilgang) {
        tjenesteinfoBokser.push(<BeOmSyfotilgang />);
    }

    if (valgtOrganisasjon.reporteetilgang) {
        const tilgangssøknader = altinnTilgangssøknad?.[valgtOrganisasjon.organisasjon.orgnr];
        for (let altinnId of altinnIdIRekkefølge) {
            const tilgang = valgtOrganisasjon.altinntilgang[altinnId];
            const altinnTjeneste = altinntjeneste[altinnId];
            if (tilgang === true) {
                /* har tilgang -- ingen ting å vise */
            } else if (isAltinn2Tilgang(altinnTjeneste)) {
                const tilgangsøknad = tilgangssøknader?.[altinnId];
                if (tilgangsøknad === undefined || tilgangsøknad.tilgang === 'ikke søkt') {
                    tjenesteinfoBokser.push(
                        <BeOmTilgangBoks
                            altinnId={altinnId}
                            onClick={opprettSøknad(
                                altinnTjeneste as Altinn2Tilgang,
                                valgtOrganisasjon
                            )}
                            eksternSide={true}
                        />
                    );
                } else if (tilgangsøknad.tilgang === 'søknad opprettet') {
                    tjenesteinfoBokser.push(
                        <BeOmTilgangBoks
                            altinnId={altinnId}
                            href={tilgangsøknad.url}
                            eksternSide={true}
                        />
                    );
                } else if (tilgangsøknad.tilgang === 'søkt') {
                    tjenesteinfoBokser.push(
                        <AltinntilgangAlleredeSøkt
                            altinnId={altinnId}
                            type="info"
                            status="Tilgang etterspurt"
                            statusBeskrivelse={`
                            Du vil motta et varsel fra Altinn når
                            forespørselen er behandlet og tilganger er på plass.
                    `}
                        />
                    );
                } else if (tilgangsøknad.tilgang === 'godkjent') {
                    tjenesteinfoBokser.push(
                        <AltinntilgangAlleredeSøkt
                            altinnId={altinnId}
                            type="suksess"
                            status="Forespørsel godkjent"
                            statusBeskrivelse={`
                        Forespørselen er behandlet og er godkjent. Det kan
                        ta litt tid før tjenesten blir tilgjengelig for deg.
                    `}
                        />
                    );
                }
            } else if (isAltinn3Tilgang(altinnTjeneste)) {
                tjenesteinfoBokser.push(
                    <BeOmTilgangBoks
                        tittel={altinnTjeneste.navn}
                        beskrivelse={altinnTjeneste.beOmTilgangBeskrivelse}
                    />
                );
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
