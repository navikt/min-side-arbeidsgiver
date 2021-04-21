import React from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import Lenke from 'nav-frontend-lenker';
import { Normaltekst, Systemtittel, Undertittel } from 'nav-frontend-typografi';
import Brodsmulesti from '../Brodsmulesti/Brodsmulesti';
import LoggInnBanner from '../LoggInn/LoggInnBanner/LoggInnBanner';
import {
    infoOmAltinnrollerURL,
    lenkeTilInfoOmDigitaleSoknader,
    infoOmRettigheterTilSykemeldingURL,
    lenkeTilInforOmInntekstmelding,
    infoOmSykefraværsstatistikk,
    infoOmPermitteringURL,
    infoOmRefusjonSykepengerKoronaURL,
    infoOmRefusjonInnreiseforbudKoronaURL,
} from '../../lenker';
import InfoIkon from '../LoggInn/TilgangsStyringInfoTekst/InfoIkon';
import NyFaneLenke from '../../GeneriskeElementer/NyFaneLenke';
import './InformasjonOmTilgangsstyringSide.less';


const InformasjonOmTilgangsstyringSide = () => {
    const tittelBeTilgangInfo = (
            <div className="be-om-tilgang-info__tittel">
                <div className="logo">
                    <InfoIkon size="48" />
                </div>
                <div className="tekst">
                    <Undertittel>Har du allerede tilgang til noen tjenester?</Undertittel>
                    <Normaltekst>Slik kan du be om tilgang til flere tjenester fra Min side – arbeidsgiver.</Normaltekst>
                </div>
            </div>
        );

    return (
        <div className="informasjon-om-tilgangsstyring">
            <Brodsmulesti brodsmuler={[ { url: '/informasjon-om-tilgangsstyring', title: 'Tilganger i Altinn', handleInApp: true }]} />
            <LoggInnBanner />
            <div className="informasjon-om-tilgangsstyring__innhold">
                <div className="informasjon-om-tilgangsstyring__tekst">
                    <Systemtittel className="informasjon-om-tilgangsstyring__systemtittel">
                        Tilganger i Altinn
                    </Systemtittel>
                    <Normaltekst className="informasjon-om-tilgangsstyring__avsnitt">
                        For å få tilgang til NAVs tjenester til arbeidsgiver må du ha blitt tildelt
                        nødvendige Altinn-rettigheter av din arbeidsgiver. Administrator for Altinn
                        i virksomheten er ofte daglig leder, men det kan også være andre.
                    </Normaltekst>
                    <ul className="informasjon-om-tilgangsstyring__avsnitt">
                        <li>
                            En <b>Altinn-rolle</b> gir som regel tilgang til <u>flere</u> tjenester,
                            også fra andre enn NAV. Vi sier at en rolle gir såkalt «vide tilganger».{' '}
                        </li>
                        <li>
                            En <b>enkeltrettighet</b> gir tilgang til <u>en</u> enkelt tjeneste.
                        </li>
                    </ul>

                    <Ekspanderbartpanel tittel={tittelBeTilgangInfo} className="be-om-tilgang-info" border>
                        <ul>
                            <li>Logg inn på Min side – arbeidsgiver.</li>
                            <li>Velg virksomhet.</li>
                            <li>Lengst nede på Min side – arbeidsgiver finnes en oversikt over tjenester du kan
                                be om tilgang til.</li>
                            <li>Klikk på lenken  «- be om tilgang» på tjenesten du trenger. Du kommer nå til Altinn.</li>
                        </ul>
                        <Normaltekst className="informasjon-om-tilgangsstyring__avsnitt">
                            I Altinn velger du hvem i din virksomhet som skal få varslet og legger inn en melding hvis
                            du vil. Du blir selv varslet når forespørselen er behandlet og tilganger er på plass.
                        </Normaltekst>
                        <Normaltekst>
                            For «Dine sykmeldte» kan du ikke be om tilgang fra Altinn. Her må du registreres som nærmeste leder for en eller flere ansatte.
                        </Normaltekst>
                    </Ekspanderbartpanel>

                    <Undertittel className="informasjon-om-tilgangsstyring__tittel">
                        Slik får du tilgang til:
                    </Undertittel>

                    <Ekspanderbartpanel tittel="Arbeidsforhold" border>
                        <Normaltekst className="informasjon-om-tilgangsstyring__avsnitt">
                            Tilgang til innsynstjeneste for arbeidsforhold innrapportert via
                            a-meldingen gis automatisk til:
                        </Normaltekst>
                        <ul>
                            <li>daglig leder/administrerende direktør</li>
                            <li>styrets leder</li>
                            <li>innehaver av enkeltpersonsforetak</li>
                            <li>deltaker i ansvarlig selskap (ANS og DA)</li>
                            <li>bestyrende reder</li>
                            <li>
                                bostyrer i konkursbo (omfatter ikke foretaket som er gått konkurs)
                                og andre bo
                            </li>
                            <li>komplementar (kun fødselsnummer)</li>
                            <li>norsk representant for utenlandsk enhet</li>
                        </ul>
                        <Normaltekst>
                            Du kan også ha rettigheten{' '}
                            <b>Innsyn i Aa-registeret for arbeidsgivere.</b>
                        </Normaltekst>
                    </Ekspanderbartpanel>

                    <Ekspanderbartpanel tittel="Avtaler/søknader om NAV-tiltak" border>
                        <Normaltekst>
                            Vi tilbyr følgende digitale tjenester om NAV-tiltak:
                        </Normaltekst>
                        <ul>
                            <li>avtale om arbeidstrening </li>
                            <li>avtale om midlertidig lønnstilskudd</li>
                            <li>avtale om varig lønnstilskudd</li>
                            <li>søknad om inkluderingstilskudd</li>
                            <li>søknad om tilskudd til mentor</li>
                            <li>søknad om tilskudd til ekspertbistand </li>
                        </ul>
                        <Normaltekst className="informasjon-om-tilgangsstyring__avsnitt">
                            <b>Rolle i Altinn:</b> Rollen «Helse-, sosial og velferdstjenester» i
                            Altinn gir deg tilgang til alle de nevnte tjenestene over (utenom avtale
                            om midlertidig lønnstilskudd og avtale om varig lønnstilskudd).
                        </Normaltekst>
                        <Normaltekst className="informasjon-om-tilgangsstyring__avsnitt">
                            Daglig leder får automatisk tilgang til avtale om midlertidig
                            lønnstilskudd og avtale om varig lønnstilskudd.
                        </Normaltekst>
                        <Normaltekst className="informasjon-om-tilgangsstyring__avsnitt">
                            <b>Enkeltrettighet i Altinn:</b> Trenger du kun tilgang til en av de
                            nevnte tjenestene ovenfor kan du klare deg med en enkeltrettighet. Navn
                            på enkeltrettighetene er det samme som navnet på tjenesten.
                        </Normaltekst>
                        <Lenke href={lenkeTilInfoOmDigitaleSoknader}>
                            Les om digitale tiltakssøknader
                        </Lenke>
                    </Ekspanderbartpanel>

                    <Ekspanderbartpanel tittel="Inntektsmelding" border>
                        <Normaltekst>
                            For å få tilgang til digital inntektsmelding må du ha en av disse
                            Altinn-rollene:
                        </Normaltekst>
                        <ul>
                            <li>ansvarlig revisor</li>
                            <li>lønn og personalmedarbeider</li>
                            <li>regnskapsfører lønn</li>
                            <li>regnskapsfører med signeringsrettighet</li>
                            <li>regnskapsfører uten signeringsrettighet</li>
                            <li>revisormedarbeider</li>
                            <li>norsk representant for utenlandsk enhet</li>
                        </ul>
                        <Normaltekst className="informasjon-om-tilgangsstyring__avsnitt">
                            Du kan også ha rettigheten <b>inntektsmelding</b>
                        </Normaltekst>
                        <Lenke href={lenkeTilInforOmInntekstmelding}>
                            Les om digital inntektsmelding
                        </Lenke>
                    </Ekspanderbartpanel>

                    <Ekspanderbartpanel tittel="Permittering, masseoppsigelse og innskrenking av arbeidstid" border>
                        <Normaltekst className="informasjon-om-tilgangsstyring__avsnitt">
                            For å få tilgang til digitalt skjema om permittering uten lønn,
                            masseoppsigelse og innskrenking av arbeidstid, trenger du kun en vilkårlig Altinn-rolle
                            i din virksomhet. Du vil bare se skjemaer som du selv har opprettet og
                            sendt inn.
                        </Normaltekst>
                        <Lenke href={infoOmPermitteringURL}>
                            Les mer om permittering uten lønn, masseoppsigelse og innskrenking av
                            arbeidstid
                        </Lenke>
                    </Ekspanderbartpanel>

                    <Ekspanderbartpanel tittel="Refusjon av sykepenger ved koronavirus" border>
                        <Normaltekst className="informasjon-om-tilgangsstyring__avsnitt">
                            For å få tilgang til skjema for refusjon av sykepenger relatert til
                            koronavirus må du ha tilgang til å sende inntektsmelding.
                        </Normaltekst>
                        <Normaltekst>
                            Det betyr at du må ha en av disse tilgangene (rollene) for den aktuelle
                            virksomheten:
                        </Normaltekst>
                        <ul>
                            <li>ansvarlig revisor</li>
                            <li>lønn og personalmedarbeider</li>
                            <li>regnskapsfører lønn</li>
                            <li>regnskapsfører med signeringsrettighet</li>
                            <li>regnskapsfører uten signeringsrettighet</li>
                            <li>revisormedarbeider</li>
                            <li>norsk representant for utenlandsk enhet</li>
                        </ul>
                        <Lenke href={infoOmRefusjonSykepengerKoronaURL}>
                            Les mer om refusjon av sykepenger ved koronavirus
                        </Lenke>
                    </Ekspanderbartpanel>

                    <Ekspanderbartpanel tittel="Refusjon for utestengte EØS-borgere" border>
                        <Normaltekst className="informasjon-om-tilgangsstyring__avsnitt">
                            For å få tilgang til skjema for refusjon for utestengte EØS-borgere
                            må du ha tilgang til å sende inntektsmelding.
                        </Normaltekst>
                        <Normaltekst>
                            Det betyr at du må ha en av disse tilgangene (rollene) for den aktuelle virksomheten:
                        </Normaltekst>
                        <ul>
                            <li>ansvarlig revisor</li>
                            <li>lønn og personalmedarbeider</li>
                            <li>regnskapsfører lønn</li>
                            <li>regnskapsfører med signeringsrettighet</li>
                            <li>regnskapsfører uten signeringsrettighet</li>
                            <li>revisormedarbeider</li>
                            <li>norsk representant for utenlandsk enhet</li>
                        </ul>
                        <Lenke href={infoOmRefusjonInnreiseforbudKoronaURL}>
                            Les mer om refusjon ved innreiseforbud under pandemien
                        </Lenke>
                    </Ekspanderbartpanel>

                    <Ekspanderbartpanel tittel="Rekruttering" border>
                        <Normaltekst>
                            På{' '}
                            <Lenke href={'https://arbeidsplassen.nav.no/bedrift'}>
                                Arbeidsplassen
                            </Lenke>{' '}
                            kan du finne kandidater og lage stillingsannonser. For å få tilgang må
                            du ha en av rollene
                        </Normaltekst>
                        <ul>
                            <li>lønn og personalmedarbeider</li>
                            <li>utfyller/innsender</li>
                        </ul>
                        <Normaltekst>
                            Du kan også ha enkeltrettigheten <b>rekruttering</b>
                        </Normaltekst>
                    </Ekspanderbartpanel>

                    <Ekspanderbartpanel tittel="Sykefraværsstatistikk" border>
                        <Normaltekst className="informasjon-om-tilgangsstyring__avsnitt">
                            For å få tilgang til legemeldt sykefraværsstatistikk og tjenester fra
                            NAV Arbeidslivssenter må du ha
                        </Normaltekst>
                        <Normaltekst>
                            <b>Rolle i Altinn:</b> helse-, sosial- og velferdstjenester
                        </Normaltekst>
                        <Normaltekst className="informasjon-om-tilgangsstyring__avsnitt">
                            <b>Eller enkeltrettigheten:</b> sykefraværsstatistikk for virksomheter
                        </Normaltekst>
                        <Lenke href={infoOmSykefraværsstatistikk}>
                            Les mer om tjenesten sykefraværsstatistikk på nav.no
                        </Lenke>
                    </Ekspanderbartpanel>

                    <Ekspanderbartpanel tittel="Sykmelding/ sykefraværsoppfølging" border>
                        <Normaltekst className="informasjon-om-tilgangsstyring__avsnitt">
                            HR og lønn trenger følgende fire enkeltrettigheter: Sykmelding – oppgi
                            leder, Sykmelding, Søknad om sykepenger og Digital oppfølgingsplan for
                            sykmeldte.
                        </Normaltekst>
                        <Normaltekst className="informasjon-om-tilgangsstyring__avsnitt">
                            Nærmeste leder trenger ikke Altinn-tilgang. Bedriften må ha fylt ut
                            skjemaet «Sykmelding – oppgi nærmeste leder».
                        </Normaltekst>
                        <Lenke href={infoOmRettigheterTilSykemeldingURL}>
                            Les mer om tjenestene og tilhørende enkeltrettigheter (nav.no)
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
                        <Normaltekst className="informasjon-om-tilgangsstyring__avsnitt">
                            Enkeltansatte får tilgang ved å bli tildelt enkeltrettigheten:{' '}
                            <b>Tilskuddsbrev NAV-tiltak</b>
                        </Normaltekst>
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

                    <Ekspanderbartpanel tittel="Utsendt arbeidstaker til EØS/Sveits" border>
                        <Normaltekst>
                            For å få tilgang til skjemaet «Søknad om A1 for utsendte arbeidstakeren innen EØS/Sveits» må du ha Altinn-rollen:
                        </Normaltekst>
                        <ul>
                            <li>Lønn og personalmedarbeider</li>
                        </ul>
                        <Normaltekst>
                            Du kan også ha enkeltrettigheten «Søknad om A1 for utsendte arbeidstakere innen EØS/Sveits».
                        </Normaltekst>
                    </Ekspanderbartpanel>

                    <div className="informasjon-om-tilgangsstyring__bunntekst">
                        <Normaltekst>
                            <NyFaneLenke href={infoOmAltinnrollerURL}>
                                Les mer om roller og rettigheter i Altinn
                            </NyFaneLenke>
                        </Normaltekst>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InformasjonOmTilgangsstyringSide;
