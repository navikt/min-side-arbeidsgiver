import React, { FunctionComponent } from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import Lenke from 'nav-frontend-lenker';
import { Innholdstittel, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { basename } from '../../paths';
import LoggInnBanner from '../LoggInn/LoggInnBanner/LoggInnBanner';
import {
    LenkeTilInfoOmAltinnRoller,
    lenkeTilInfoOmDigitaleSoknader,
    LenkeTilInfoOmRettigheterTilSykmelding,
    lenkeTilInforOmInntekstmelding,
    lenkeTilInfoOmSykefravarsstatistikk,
    lenkeTilInfoOmPermittering
} from '../../lenker';
import './InformasjonOmTilgangsstyringSide.less';

const InformasjonOmTilgangsstyringSide: FunctionComponent = () => {
    return (
        <div className={'informasjon-om-tilgangsstyring '}>

            <LoggInnBanner />

            <div className={'informasjon-om-tilgangsstyring__innhold'}>
                <div className={'informasjon-om-tilgangsstyring__lenke'}>
                    <Lenke  href={basename + '/'}>
                        Tilbake til forsiden
                    </Lenke>
                </div>
                <div className={'informasjon-om-tilgangsstyring__tekst'}>
                    <Innholdstittel className={'informasjon-om-tilgangsstyring__innholdstittel'}>
                        {' '}
                        Tilganger i Altinn{' '}
                    </Innholdstittel>
                    <Normaltekst className={'informasjon-om-tilgangsstyring__ingress'}>
                        For å få tilgang til NAVs tjenester til arbeidsgiver må du ha blitt tildelt
                        nødvendige Altinn-rettigheter av din arbeidsgiver. Administrator for Altinn
                        i virksomheten er ofte daglig leder, men det kan også være andre.
                    </Normaltekst>
                    <ul>
                        <li>
                            En <b>Altinn-rolle</b> gir som regel tilgang til <u>flere</u> tjenester,
                            også fra andre enn NAV. Vi sier at en rolle gir såkalt «vide tilganger».{' '}
                        </li>
                        <li>
                            En <b>enkeltrettighet</b> gir tilgang til <u>en</u> enkelt tjeneste.
                        </li>
                    </ul>
                    <br />
                    <Undertittel className={'informasjon-om-tilgangsstyring__systemtittel'}>
                        Slik får du tilgang til de digitale tjenestene
                    </Undertittel>

                    <Ekspanderbartpanel tittel="Permittering, masseoppsigelse og innskrenking av arbeidstid" border>
                        <Normaltekst>
                            For å få tilgang til digitalt skjema om permittering uten lønn, masseoppsigelse og
                            innskrenking av arbeidstid må du ha en hvilken som helst Altinn-rolle. Du vil bare se
                            skjemaer som du selv har opprettet og sendt inn.
                        </Normaltekst>
                        <br />
                        <Lenke href={lenkeTilInfoOmPermittering}>
                            Les mer om permittering uten lønn, masseoppsigelse og innskrenking av arbeidstid
                        </Lenke>
                    </Ekspanderbartpanel>

                    <Ekspanderbartpanel tittel="Avtaler/søknader om NAV-tiltak" border>
                        Vi tilbyr følgende digitale tjenester om NAV-tiltak:
                        <ul>
                            <li>avtale om arbeidstrening </li>
                            <li>søknad om lønnstilskudd</li>
                            <li>søknad om inkluderingstilskudd</li>
                            <li>søknad om tilskudd til mentor</li>
                            <li>søknad om tilskudd til ekspertbistand </li>
                        </ul>
                        <Normaltekst>
                            <b>Rolle i Altinn:</b> For å få tilgang til <u>alle</u> de nevnte
                            tjenestene over må du ha rollen «Helse-, sosial og velferdstjenester» i
                            Altinn.
                        </Normaltekst>
                        <br />
                        <Normaltekst>
                            <b>Enkeltrettighet i Altinn:</b> Trenger du kun tilgang til en av de
                            nevnte tjenestene ovenfor kan du klare deg med en enkeltrettighet. Navn
                            på enkeltrettighetene er det samme som navnet på tjenesten.
                        </Normaltekst>
                        <br />
                        <Lenke href={lenkeTilInfoOmDigitaleSoknader}>
                            Les om digitale tiltakssøknader
                        </Lenke>
                    </Ekspanderbartpanel>

                    <Ekspanderbartpanel tittel="Tilskuddsbrev for NAV-tiltak" border>
                        <Normaltekst>
                            For å få tilgang til digitale tilskuddsbrev om NAV-tiltak må du ha en av
                            disse lederrollene i Altinn:
                        </Normaltekst>
                        <ul>
                            <li>daglig leder/administrerende direktør</li>
                            <li>styrets leder</li>
                            <li>innehaver</li>
                            <li>komplementar</li>
                            <li>deltaker med delt ansvar</li>
                            <li>deltaker med fullt ansvar</li>
                            <li>bestyrende reder</li>
                            <li>norsk representant for utenlandsk enhet</li>
                            <li>bostyrer</li>
                        </ul>
                        <Normaltekst>
                            Enkeltansatte får tilgang ved å bli tildelt enkeltrettigheten:{' '}
                            <b>Tilskuddsbrev NAV-tiltak</b>
                        </Normaltekst>
                        <br />
                        <Normaltekst>
                            NAV sender digitale tilskuddsbrev for følgende tiltak:
                        </Normaltekst>
                        <ul>
                            <li>Midlertidig lønnstilskudd</li>
                            <li>Varig lønnstilskudd</li>
                            <li>Tilskudd til mentor</li>
                            <li>Inkluderingstilskudd</li>
                            <li>Tilskudd til ekspertbistand</li>
                            <li>Funksjonsassistanse</li>
                            <li>Varig tilrettelagt arbeid i ordinær virksomhet</li>
                            <li>Arbeidsforberedende trening</li>
                            <li>Varig tilrettelagt arbeid i skjermet virksomhet</li>
                            <li>Høyere utdanning</li>
                            <li>Enkeltplass Fag og yrkesopplæring</li>
                            <li>Gruppe Fag og yrkesopplæring</li>
                            <li>Enkeltplass arbeidsmarkedsopplæring</li>
                        </ul>
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
                        På{' '}
                        <Lenke href={'https://arbeidsplassen.nav.no/bedrift'}>Arbeidsplassen</Lenke>{' '}
                        kan du finne kandidater og lage stillingsannonser. For å få tilgang må du ha
                        en av rollene{' '}
                        <ul>
                            <li>lønn og personalmedarbeider</li>
                            <li>utfyller/innsender</li>
                        </ul>
                        <div>
                            Du kan også ha enkeltrettigheten <b> rekruttering</b>{' '}
                        </div>
                    </Ekspanderbartpanel>
                    <Ekspanderbartpanel tittel="Sykmelding/sykefraværsoppfølging" border>
                        <Normaltekst>
                            HR og lønn trenger følgende fire enkeltrettigheter: Sykmelding – oppgi
                            leder, Sykmelding, Søknad om sykepenger og Digital oppfølgingsplan for
                            sykmeldte
                        </Normaltekst>
                        <br />
                        <Normaltekst>
                            Nærmeste leder trenger ikke Altinn-tilgang. Bedriften må ha fylt ut
                            skjemaet «Sykmelding – oppgi nærmeste leder».
                        </Normaltekst>
                        <br />
                        <Lenke href={LenkeTilInfoOmRettigheterTilSykmelding}>
                            Les mer om tjenestene og tilhørende enkeltrettigheter (nav.no)
                        </Lenke>
                    </Ekspanderbartpanel>
                    <Ekspanderbartpanel tittel="Sykefraværsstatistikk" border>
                        <Normaltekst>
                            For å få tilgang til legemeldt sykefraværsstatistikk og tjenester fra
                            NAV Arbeidslivssenter må du ha
                        </Normaltekst>
                        <br />
                        <Normaltekst>
                            <b>Rolle i Altinn:</b> helse-, sosial- og velferdstjenester
                        </Normaltekst>
                        <Normaltekst>
                            <b>Eller enkeltrettigheten:</b> sykefraværsstatistikk for virksomheter
                        </Normaltekst>
                        <br />
                        <Lenke href={lenkeTilInfoOmSykefravarsstatistikk}>
                            Les mer om tjenesten sykefraværsstatistikk på nav.no
                        </Lenke>
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
