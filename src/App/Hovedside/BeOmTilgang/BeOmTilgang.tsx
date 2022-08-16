import React, {FC, FunctionComponent, MouseEventHandler, useContext} from 'react';
import {Ekspanderbartpanel} from '../../../GeneriskeElementer/Ekspanderbartpanel';
import AlertStripeInfo from 'nav-frontend-alertstriper/lib/info-alertstripe';
import {
    OrganisasjonInfo,
} from '../../OrganisasjonerOgTilgangerProvider';
import {OrganisasjonsDetaljerContext} from '../../OrganisasjonDetaljerProvider';
import Organisasjonsbeskrivelse from './Organisasjonsbeskrivelse/Organisasjonsbeskrivelse';
import {
    AltinntilgangAlleredeSøkt,
    BeOmTilgangBoks,
    BeOmSyfotilgang,
} from './TjenesteInfo/TjenesteInfo';
import './BeOmTilgang.less';
import {altinntjeneste, AltinntjenesteId} from '../../../altinn/tjenester';
import {opprettAltinnTilgangssøknad} from '../../../altinn/tilganger';
import {beOmTilgangIAltinnLink} from '../../../lenker';
import {LinkableFragment} from '../../../GeneriskeElementer/LinkableFragment';
import {BodyShort, Heading} from "@navikt/ds-react";

const altinnIdIRekkefølge: AltinntjenesteId[] = [
    'pam',
    'iaweb',
    'arbeidstrening',
    'arbeidsforhold',
    'midlertidigLønnstilskudd',
    'varigLønnstilskudd',
    'sommerjobb',
    'ekspertbistand',
    'inkluderingstilskudd',
    'mentortilskudd',
    'inntektsmelding',
    'tilskuddsbrev',
];

const beOmTilgangUrlFallback = (
    altinnId: AltinntjenesteId,
    valgtOrganisasjon: OrganisasjonInfo,
): string => {
    const tjeneste = altinntjeneste[altinnId];
    return beOmTilgangIAltinnLink(
        valgtOrganisasjon.organisasjon.OrganizationNumber,
        tjeneste.tjenestekode,
        tjeneste.tjenesteversjon,
    );
};

const opprettSøknad = (
    altinnId: AltinntjenesteId,
    valgtOrganisasjon: OrganisasjonInfo,
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
            orgnr: valgtOrganisasjon.organisasjon.OrganizationNumber,
            altinnId,
            redirectUrl: redirectUrl.toString(),
        })
            .then(søknad => {
                if (søknad === null) {
                    window.location.href = beOmTilgangUrlFallback(altinnId, valgtOrganisasjon);
                } else {
                    window.location.href = søknad.submitUrl;
                }
            })
            .catch(() => {
                window.location.href = beOmTilgangUrlFallback(altinnId, valgtOrganisasjon);
            });
    };
};

const BeOmTilgang: FunctionComponent = () => {
    const {valgtOrganisasjon} = useContext(OrganisasjonsDetaljerContext);
    const tjenesteinfoBokser: JSX.Element[] = [];
    if (valgtOrganisasjon === undefined) {
        return null;
    }

    if (valgtOrganisasjon.syfotilgang && !valgtOrganisasjon.reporteetilgang){
        return <TilgangContainer>
            <BodyShort>Noen i virksomheten må gi deg riktig tilgang i Altinn. Nå er du kun satt opp som nærmeste leder.</BodyShort>
        </TilgangContainer>
    }

    if (!valgtOrganisasjon.syfotilgang) {
        tjenesteinfoBokser.push(<BeOmSyfotilgang/>);
    }


    if (valgtOrganisasjon.reporteetilgang) {
        for (let altinnId of altinnIdIRekkefølge) {
            const tilgang = valgtOrganisasjon.altinntilgang[altinnId];
            const tilgangsøknad = valgtOrganisasjon.altinnsøknad[altinnId];
            if (tilgang === true) {
                /* har tilgang -- ingen ting å vise */
            } else if (tilgangsøknad.tilgang === 'ikke søkt') {
                tjenesteinfoBokser.push(
                    <BeOmTilgangBoks
                        altinnId={altinnId}
                        onClick={opprettSøknad(altinnId, valgtOrganisasjon)}
                        eksternSide={true}
                    />,
                );
            } else if (tilgangsøknad.tilgang === 'søknad opprettet') {
                tjenesteinfoBokser.push(
                    <BeOmTilgangBoks altinnId={altinnId} href={tilgangsøknad.url} eksternSide={true}/>,
                );
            } else if (tilgangsøknad.tilgang === 'søkt') {
                tjenesteinfoBokser.push(
                    <AltinntilgangAlleredeSøkt
                        altinnId={altinnId}
                        type='info'
                        status='Tilgang etterspurt'
                        statusBeskrivelse={`
                            Du vil motta et varsel fra Altinn når
                            forespørselen er behandlet og tilganger er på plass.
                    `}
                    />,
                );
            } else if (tilgangsøknad.tilgang === 'godkjent') {
                tjenesteinfoBokser.push(
                    <AltinntilgangAlleredeSøkt
                        altinnId={altinnId}
                        type='suksess'
                        status='Forespørsel godkjent'
                        statusBeskrivelse={`
                        Forespørselen er behandlet og er godkjent. Det kan
                        ta litt tid før tjenesten blir tilgjengelig for deg.
                    `}
                    />,
                );
            }
        }
    }
    if (tjenesteinfoBokser.length <= 0) {
        return null
    }

    return (
        <TilgangContainer>
                <Ekspanderbartpanel
                    className='be-om-tilgang__container'
                    tittel='Tjenester du kan be om tilgang til'
                    apen={new URLSearchParams(window.location.search).get('fragment') === 'be-om-tilgang'}
                >
                    <div className='be-om-tilgang__innhold'>
                        <AlertStripeInfo className='be-om-tilgang__info'>
                            Du har ikke rettighetene som kreves for å bruke disse tjenestene. Du
                            kan be om tilgang til de spesifikke tjenestene ved å følge lenkene
                            under.
                        </AlertStripeInfo>
                        <Organisasjonsbeskrivelse
                            navn={valgtOrganisasjon.organisasjon.Name}
                            orgnummer={valgtOrganisasjon.organisasjon.OrganizationNumber}
                        />
                        <ul className='be-om-tilgang__tjenesteinfo-bokser'>
                            {tjenesteinfoBokser.map((tjenesteinfoboks, index) => (
                                <li key={index} className='be-om-tilgang__tjenesteinfo'>
                                    {tjenesteinfoboks}
                                </li>
                            ))}
                        </ul>
                    </div>
                </Ekspanderbartpanel>
        </TilgangContainer>
    );
};

interface props{
    children: JSX.Element
}

const TilgangContainer: FC<props>= ({children}) =>
    <LinkableFragment fragment='be-om-tilgang'>
        <div className='be-om-tilgang'>
            <div className='be-om-tilgang__tittel'>
                <div className='divider'/>
                <Heading size="small" level="2" className='tekst'>
                    Trenger du tilgang til flere tjenester?
                </Heading>
                <div className='divider'/>
            </div>
            {children}
        </div>
    </LinkableFragment>

export default BeOmTilgang;
