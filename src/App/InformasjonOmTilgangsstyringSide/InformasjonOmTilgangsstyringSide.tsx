import React, { FunctionComponent } from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import './InformasjonOmTilgangsstyringSide.less';
import Lenke from 'nav-frontend-lenker';

import { Innholdstittel, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { basename } from '../../paths';
import LoggInnBanner from '../LoggInn/LoggInnBanner/LoggInnBanner';
import {
    LenkeTilInfoOmAltinnRoller,
    lenkeTilInfoOmDigitaleSoknader,
    LenkeTilInfoOmRettigheterTilSykmelding,
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
                        <div>
                            Du kan også ha rettigheten <b> inntekstmelding</b>{' '}
                        </div>
                        <Lenke href={lenkeTilInforOmInntekstmelding}>
                            Les om digitale inntekstmelding
                        </Lenke>
                    </Ekspanderbartpanel>
                    <Ekspanderbartpanel tittel="Rekruttering" border>
                        På Arbeidsplassen kan du finne kandidater og lage stillingsannonser. For å
                        få tilgang må du ha en av rollene{' '}
                        <ul>
                            <li>lønn og personalmedarbeider</li>
                            <li>utfyller/innsender</li>
                        </ul>
                        <div>
                            Du kan også ha enkeltrettigheten <b> rekruttering</b>{' '}
                        </div>
                        <Lenke href={'https://arbeidsplassen.nav.no/'}>Gå til Arbeidsplassen</Lenke>{' '}
                    </Ekspanderbartpanel>
                    <Ekspanderbartpanel tittel="Sykmelding/sykefraværsoppfølging" border>
                        Daglig leder i virksomheten må tildele tilgang til fire tjenester i Altinn.
                        <br />
                        <Lenke href={LenkeTilInfoOmRettigheterTilSykmelding}>
                            Les om tjenestene i Altinn
                        </Lenke>
                    </Ekspanderbartpanel>
                    <Ekspanderbartpanel tittel="Sykefraværsstatistikk" border>
                        For å få tilgang til legemeldt sykefraværsstatistikk og tjenester fra NAV
                        Arbeidslivssenter må du ha rollen
                        <ul>
                            <li>helse-, sosial- og velferdstjeneste</li>
                        </ul>
                        Alternativt kan du ha enkeltrettigheten{' '}
                        <b>sykefraværsstatistikk for virksomheter</b>
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
