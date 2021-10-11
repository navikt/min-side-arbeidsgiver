import React, { FunctionComponent, useContext } from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import Element from 'nav-frontend-typografi/lib/element';
import HoyreChevron from 'nav-frontend-chevron/lib/hoyre-chevron';
import { OrganisasjonsDetaljerContext } from '../OrganisasjonDetaljerProvider';
import {
    lenkeTilPermitteringOgMasseoppsigelsesSkjema,
    permitteringKlageskjemaURL,
    koronaSykeRefusjonURL,
    lenkeTilPermitteringsInfo, lenkeTilLonnskompensasjonOgRefusjon,
    grensekompURL,
    grensekompOversiktURL,
} from '../../lenker';
import Innholdsboks from '../Hovedside/Innholdsboks/Innholdsboks';
import KoronaboksIkon from './KoronaboksIkon';
import './Koronaboks.less';
import { LenkeMedLogging } from '../../GeneriskeElementer/LenkeMedLogging';

interface KoronalenkeProps {
    href: string;
    tekst: string;
}

const Koronalenke: FunctionComponent<KoronalenkeProps> = ({ href, tekst }) =>
    <LenkeMedLogging
        className='koronaboks__lenke'
        href={href}
        loggLenketekst={tekst}
    >
        <span>{tekst}</span>
        <HoyreChevron />
    </LenkeMedLogging>;

export const Koronaboks = () => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);

    return (
        <div className='koronaboks'>
            <Innholdsboks classname='koronaboks__innhold'>
                <KoronaboksIkon />
                <Undertittel>Koronarelaterte tjenester</Undertittel>

                <Element className='koronaboks__tekst'>Permittering</Element>

                <Koronalenke
                    href={lenkeTilPermitteringOgMasseoppsigelsesSkjema}
                    tekst='Varsle NAV om permitteringer, masseoppsigelser eller innskrenkninger i arbeidstiden'
                />

                <Koronalenke
                    href={lenkeTilPermitteringsInfo}
                    tekst='Nye regler for lønnsplikt ved permittering'
                />

                {
                    valgtOrganisasjon?.altinntilgang.inntektsmelding === true
                        ? <LenkerSomKreverInntekstmeldingtilgang
                            orgnr={valgtOrganisasjon.organisasjon.OrganizationNumber} />
                        : null
                }
            </Innholdsboks>
        </div>
    );
};
const LenkerSomKreverInntekstmeldingtilgang: FunctionComponent<{ orgnr: string }> = ({ orgnr }) => <>

    <Element className='koronaboks__tekst'>Lønnskompensasjon</Element>
    <Koronalenke
        href={lenkeTilLonnskompensasjonOgRefusjon}
        tekst='Se kvittering på innsendt skjema om lønnskompensasjon'
    />

    <Koronalenke
        href={permitteringKlageskjemaURL(orgnr)}
        tekst='Ettersend opplysninger eller klag på vedtak om lønnskompensasjon'
    />

    <Element className='koronaboks__tekst'>Refusjon sykepenger</Element>
    <Koronalenke
        href={koronaSykeRefusjonURL(orgnr)}
        tekst='Søk om refusjon av sykepenger ved koronavirus'
    />

    <Element className='koronaboks__tekst'>Restriksjoner for innreise</Element>
    <Koronalenke
        href={grensekompURL}
        tekst='Søk om refusjon for utestengte EØS-borgere'
    />

    <Koronalenke
        href={grensekompOversiktURL}
        tekst='Refusjon for utestengte EØS-borgere - se innsendte krav'
    />
</>;

