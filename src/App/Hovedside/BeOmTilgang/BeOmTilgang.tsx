import React, {FunctionComponent, MouseEventHandler, useContext, useEffect, useState} from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import AlertStripeInfo from 'nav-frontend-alertstriper/lib/info-alertstripe';
import { Undertittel } from 'nav-frontend-typografi';
import {
    OrganisasjonerOgTilgangerContext,
    OrganisasjonInfo,
    SyfoTilgang
} from '../../OrganisasjonerOgTilgangerProvider';
import { OrganisasjonsDetaljerContext } from '../../OrganisasjonDetaljerProvider';
import Organisasjonsbeskrivelse from './Organisasjonsbeskrivelse/Organisasjonsbeskrivelse';
import {
    AltinntilgangAlleredeSøkt,
    BeOmTilgangBoks,
    BeOmSyfotilgang,
} from './TjenesteInfo/TjenesteInfo';
import './BeOmTilgang.less';
import { altinntjeneste, AltinntjenesteId } from '../../../altinn/tjenester';
import { opprettAltinnTilgangssøknad } from '../../../altinn/tilganger';
import { beOmTilgangIAltinnLink } from '../../../lenker';

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
    valgtOrganisasjon: OrganisasjonInfo
): string => {
    const tjeneste = altinntjeneste[altinnId];
    return beOmTilgangIAltinnLink(
        valgtOrganisasjon.organisasjon.OrganizationNumber,
        tjeneste.tjenestekode,
        tjeneste.tjenesteversjon
    );
};

const opprettSøknad = (
    altinnId: AltinntjenesteId,
    valgtOrganisasjon: OrganisasjonInfo
): MouseEventHandler<unknown> => {
    let harTrykket = false; /* ikke opprett to søknader hvis bruker klikker raskt på knappen. */
    return () => {
        if (harTrykket) {
            return;
        }
        harTrykket = true;
        const redirectUrl = new URL(window.location.href)
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
    const { tilgangTilSyfo, organisasjoner } = useContext(OrganisasjonerOgTilgangerContext);
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    const [organisasjon, setOrganisasjon] = useState<OrganisasjonInfo|undefined>(undefined)
    const tjenesteinfoBokser: JSX.Element[] = [];

    useEffect(()=> {
        if(valgtOrganisasjon){
            setOrganisasjon(organisasjoner[valgtOrganisasjon!.organisasjon.OrganizationNumber])
        } else { setOrganisasjon(undefined)}
    }, [organisasjoner, valgtOrganisasjon])

    if (tilgangTilSyfo === SyfoTilgang.IKKE_TILGANG) {
        tjenesteinfoBokser.push(<BeOmSyfotilgang />);
    }

    if (organisasjon) {
        for (let altinnId of altinnIdIRekkefølge) {
            const tilgang = organisasjon.altinntilgang[altinnId];

            if (tilgang.tilgang === 'ja') {
                /* har tilgang -- ingen ting å vise */
            } else if (tilgang.tilgang === 'nei') {
                tjenesteinfoBokser.push(
                    <BeOmTilgangBoks
                        altinnId={altinnId}
                        onClick={opprettSøknad(altinnId, organisasjon)}
                        eksternSide={true}
                    />
                );
            } else if (tilgang.tilgang === 'søknad opprettet') {
                tjenesteinfoBokser.push(
                    <BeOmTilgangBoks altinnId={altinnId} href={tilgang.url} eksternSide={true} />
                );
            } else if (tilgang.tilgang === 'søkt') {
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
            } else if (tilgang.tilgang === 'godkjent') {
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
        }
    }

    const skalViseInnhold = tjenesteinfoBokser.length > 0;
    return (
        <div className="be-om-tilgang">
            {skalViseInnhold && (
                <>
                    <div className="be-om-tilgang__tittel">
                        <div className="divider" />
                        <Undertittel className="tekst">
                            Trenger du tilgang til flere tjenester?
                        </Undertittel>
                        <div className="divider" />
                    </div>
                    <Ekspanderbartpanel
                        className="be-om-tilgang__container"
                        tittel="Tjenester du kan be om tilgang til"
                        apen={new URLSearchParams(window.location.search).get('fragment') === 'be-om-tilgang'}
                    >
                        <div className="be-om-tilgang__innhold">
                            <AlertStripeInfo className="be-om-tilgang__info">
                                Du har ikke rettighetene som kreves for å bruke disse tjenestene. Du
                                kan be om tilgang til de spesifikke tjenestene ved å følge lenkene
                                under.
                            </AlertStripeInfo>
                            {organisasjon && (
                                <Organisasjonsbeskrivelse
                                    navn={organisasjon.organisasjon.Name}
                                    orgnummer={organisasjon.organisasjon.OrganizationNumber}
                                />
                            )}
                            <ul className="be-om-tilgang__tjenesteinfo-bokser">
                                {tjenesteinfoBokser.map((tjenesteinfoboks, index) => (
                                    <li key={index} className="be-om-tilgang__tjenesteinfo">
                                        {tjenesteinfoboks}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </Ekspanderbartpanel>
                </>
            )}
        </div>
    );
};

export default BeOmTilgang;
