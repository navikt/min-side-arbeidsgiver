import React, { FunctionComponent } from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import './InformasjonOmTilgangsstyringSide.less';
import Lenke from 'nav-frontend-lenker';

import { Innholdstittel, Normaltekst, Element, Undertittel } from 'nav-frontend-typografi';
import { basename } from '../../paths';
import LoggInnBanner from '../LoggInn/LoggInnBanner/LoggInnBanner';
import { LenkeTilInfoOmAltinnRoller, LenkeTilInfoOmNarmesteLeder } from '../../lenker';

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
                        NAVs tjenester for arbeidsgivere krever at du er registrert med bestemte
                        roller i Altinn. Her får du en oversikt over hvilke roller de forskjellige
                        tjenestene krever.
                    </Normaltekst>
                    <Undertittel className={'informasjon-om-tilgangsstyring__systemtittel'}>
                        Slik får du tilgang til tjenestene
                    </Undertittel>
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
                    <Ekspanderbartpanel
                        tittel="Tilskudd til mentor, lønn, inkludering og ekspertbistand"
                        border
                    >
                        <div className="informasjon-om-tilgangsstyring__tekst-i-ekspanderbart-panel">
                            Tilgang til disse søknadene krever at du har rollen &nbsp;{' '}
                            <Element>Helse-, sosial og velferdstjenester &nbsp;</Element>
                        </div>
                    </Ekspanderbartpanel>
                    <Ekspanderbartpanel tittel="Inntektsmelding" border>
                        Tilgang til digital inntektsmelding krever en av rollene &nbsp;{' '}
                        <ul>
                            <li>Ansvarlig revisor</li>
                            <li>Lønn og personalmedarbeider</li>
                            <li>Regnskapsfører lønn</li>
                            <li>Regnskapsfører med signeringsrettighet</li>
                            <li>Regnskapsfører uten signeringsrettighet</li>
                            <li>Revisormedarbeider</li>
                            <li>Kontaktperson NUF</li>
                        </ul>
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
