import React, { FunctionComponent } from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import './InformasjonOmTilgangsstyringSide.less';
import Lenke from 'nav-frontend-lenker';

import { Innholdstittel, Normaltekst, Element, Undertittel } from 'nav-frontend-typografi';
import { basename } from '../../paths';
import LoggInnBanner from '../LoggInn/LoggInnBanner/LoggInnBanner';
import {
    LenkeTilInfoOmAltinnRoller,
    lenkeTilInfoOmDigitaleSoknader,
    LenkeTilInfoOmNarmesteLeder,
    lenkeTilInforOmInntekstmelding,
} from '../../lenker';

const InformasjonOmTilgangsstyringSide: FunctionComponent = () => {
    return (
        <div className={'informasjon-om-tilgangsstyring '}>
            <LoggInnBanner />
            <div className={'informasjon-om-tilgangsstyring__innhold'}>
                <Lenke className={'informasjon-om-tilgangsstyring__lenke'} href={basename + '/'}>
                    Tilbake til forsiden
                </Lenke>
                <div className={'informasjon-om-tilgangsstyring__tekst'}>
                    <Innholdstittel className={'informasjon-om-tilgangsstyring__innholdstittel'}>
                        {' '}
                        Tilganger i Altinn{' '}
                    </Innholdstittel>
                    <Normaltekst className={'informasjon-om-tilgangsstyring__ingress'}>
                        For å få tilgang til arbeidsgivertjenester hos NAV må du ha en bestemt rolle
                        eller enkeltrettighet i Altinn.
                    </Normaltekst>
                    Se oversikt over roller og enkeltrettigheter
                    <br />
                    <Undertittel className={'informasjon-om-tilgangsstyring__systemtittel'}>
                        Slik får du tilgang til tjenestene
                    </Undertittel>
                    <Ekspanderbartpanel tittel="Avtaler/søknader om NAV-tiltak" border>
                        Vi tilbyr digitale avtaler/søknader om
                        <ul>
                            <li>lønnstilskudd </li>
                            <li> inkluderingstilskudd </li>
                            <li>tilskudd til mentor </li>
                            <li>tilskudd til ekspertbistand </li>
                        </ul>
                        For å få tilgang til alle må du ha rollen
                        <ul>
                            <li>helse-, sosial og velferdstjenester </li>
                        </ul>
                        Du kan også ha en enkeltrettighet, som gir tilgang til en av søknadene
                        <ul>
                            <li>lønnstilskudd </li>
                            <li> inkluderingstilskudd </li>
                            <li>tilskudd til mentor </li>
                            <li>tilskudd til ekspertbistand </li>
                        </ul>
                        <Lenke href={lenkeTilInfoOmDigitaleSoknader}>
                            Les om digitale tiltakssøknader
                        </Lenke>
                    </Ekspanderbartpanel>
                    <Ekspanderbartpanel tittel="Inntektsmelding" border>
                        For å få tilgang til digital inntektsmelding må du ha en av Altinn-rollene
                        <ul>
                            <li>ansvarlig revisor</li>
                            <li>lønn og personalmedarbeider</li>
                            <li>regnskapsfører lønn</li>
                            <li>regnskapsfører med signeringsrettighet</li>
                            <li>regnskapsfører uten signeringsrettighet</li>
                            <li>revisormedarbeider</li>
                            <li>kontaktperson NUF</li>
                        </ul>
                        <div className="informasjon-om-tilgangsstyring__tekst-i-ekspanderbart-panel">
                            Du kan også ha rettigheten &nbsp;<Element> inntekstmelding</Element>{' '}
                        </div>
                        <Lenke href={lenkeTilInforOmInntekstmelding}>
                            Les om digitale inntekstmelding
                        </Lenke>
                    </Ekspanderbartpanel>
                    <Ekspanderbartpanel tittel="Rekruttere" border>
                        <Normaltekst
                            className={'informasjon-om-tilgangsstyring__arbeidsplassen-tekst'}
                        >
                            På <Lenke href={'https://arbeidsplassen.nav.no/'}>Arbeidsplassen</Lenke>{' '}
                            kan du finne kandidater og lage stillingsannonser.
                        </Normaltekst>
                        <Element className={'informasjon-om-tilgangsstyring__rolle-overskrift'}>
                            Du må ha en av rollene:{' '}
                        </Element>
                        <ul>
                            <li>Lønn og personalmedarbeider</li>
                            <li>Utfyller/innsender</li>
                        </ul>
                        <div
                            className={
                                'informasjon-om-tilgangsstyring__tekst-i-ekspanderbart-panel'
                            }
                        >
                            Du kan også ha rettigheten &nbsp;<Element> Rekruttering</Element>{' '}
                        </div>
                    </Ekspanderbartpanel>
                    <Ekspanderbartpanel tittel="Sykmeldte" border>
                        <div className="informasjon-om-tilgangsstyring__tekst-i-ekspanderbart-panel">
                            Tilgang til digitale sykmeldinger krever at du har rollen &nbsp;{' '}
                            <Element>nærmeste leder &nbsp;</Element>for en eller flere ansatte i din
                            virksomhet.
                        </div>
                        <br />
                        <Lenke href={LenkeTilInfoOmNarmesteLeder}>
                            Les mer om registrering av Nærmeste leder.
                        </Lenke>
                    </Ekspanderbartpanel>
                    <Ekspanderbartpanel tittel="Sykefraværsstatistikk" border>
                        Tilgang til legemeldt sykefraværsstatistikk og tjenester mottatt fra NAV
                        Arbeidslivssenter krever rollen &nbsp;{' '}
                        <ul>
                            <li>Helse-, sosial- og velferdstjeneste</li>
                        </ul>
                        Du kan også ha enkeltrettigheten{' '}
                        <b>Sykefraværsstatistikk for virksomheter</b>
                    </Ekspanderbartpanel>
                    <div className="informasjon-om-tilgangsstyring__bunntekst">
                        Mangler du tilgang til tjenester? &nbsp;
                        <br />
                        <Lenke href={LenkeTilInfoOmAltinnRoller}>Les om roller i Altinn.</Lenke>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InformasjonOmTilgangsstyringSide;
