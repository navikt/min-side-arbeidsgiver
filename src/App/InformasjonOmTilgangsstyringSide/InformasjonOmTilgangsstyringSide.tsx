import React from 'react';
import {Accordion, BodyLong, BodyShort, Heading} from '@navikt/ds-react';
import Brodsmulesti from '../Brodsmulesti/Brodsmulesti';
import {
    infoOmAltinnVarslerURL,
    infoOmPermitteringURL,
    infoOmRefusjonInnreiseforbudKoronaURL,
    infoOmRefusjonSykepengerKoronaURL,
    infoOmRettigheterTilSykemeldingURL,
    infoOmSykefraværsstatistikk,
    lenkeTilInfoOmDigitaleSoknader,
    lenkeTilInforOmInntekstmelding,
    spørreOmRettigheterAltinnURL,
} from '../../lenker';
import NyFaneLenke from '../../GeneriskeElementer/NyFaneLenke';
import {LenkeMedLogging} from '../../GeneriskeElementer/LenkeMedLogging';
import './InformasjonOmTilgangsstyringSide.less';
import icon from './icon_tilgang.svg';
import {PanelerMedInnholdsfortegnelse} from './PanelerMedInnholdsfortegnelse';

const InformasjonOmTilgangsstyringSide = () => {
    return (
        <div className='informasjon-om-tilgangsstyring'>
            <Brodsmulesti brodsmuler={[{
                url: '/informasjon-om-tilgangsstyring',
                title: 'Tilganger i Altinn',
                handleInApp: true
            }]}/>
            <div className='informasjon-om-tilgangsstyring__banner'>
                <div className='informasjon-om-tilgangsstyring__banner-heading'>
                    <img src={icon} alt={''}/>
                    <Heading level='1' size='xlarge'>
                        Tilganger og varslinger i Altinn
                    </Heading>
                </div>
            </div>
            <PanelerMedInnholdsfortegnelse toc={[
                {
                    id: 'kortomtilgangerialtinn',
                    title: 'Kort om tilganger i Altinn',
                    content: <>
                        <BodyLong spacing>
                            For å få tilgang til NAVs tjenester til arbeidsgiver må du ha blitt tildelt
                            nødvendige Altinn-rettigheter av din arbeidsgiver. Administrator for Altinn
                            i virksomheten er ofte daglig leder, men det kan også være andre.


                            <ul>
                                <li>
                                    <BodyShort spacing>
                                        En <b>Altinn-rolle</b> gir som regel tilgang til <u>flere</u> tjenester,
                                        også fra andre enn NAV. Vi sier at en rolle gir såkalt «vide tilganger».{' '}
                                    </BodyShort>
                                </li>
                                <li>
                                    <BodyShort spacing>
                                        En <b>enkeltrettighet</b> gir tilgang til <u>en</u> enkelt tjeneste.
                                    </BodyShort>
                                </li>
                            </ul>
                        </BodyLong>
                    </>
                },
                {
                    id: 'hardualleredetilgangtilnoentjenester',
                    title: 'Har du allerede tilgang til noen tjenester?',
                    content: <>
                        <BodyLong spacing>
                            Hvis du allerede har tilgang til noen tjenester i en virksomhet kan du
                            be om tilgang til flere.

                            <ul>
                                <li>Logg inn på Min side – arbeidsgiver.</li>
                                <li>Velg virksomhet.</li>
                                <li>Lengst nede på Min side – arbeidsgiver finnes en oversikt over tjenester du kan
                                    be om tilgang til.
                                </li>
                                <li>Klikk på lenken «- be om tilgang» på tjenesten du trenger. Du kommer nå til
                                    Altinn.
                                </li>
                            </ul>

                            I Altinn velger du hvem i din virksomhet som skal få varslet og legger inn en melding hvis
                            du vil. Du blir selv varslet når forespørselen er behandlet og tilganger er på plass.
                        </BodyLong>
                        <BodyLong spacing>
                            For «Dine sykmeldte» kan du ikke be om tilgang fra Altinn. Her må du registreres som
                            nærmeste leder for en eller flere ansatte.
                        </BodyLong>
                        <BodyLong spacing>
                            <NyFaneLenke
                                href={spørreOmRettigheterAltinnURL}
                                loggLenketekst='Du kan også be om tilgang direkte fra Altinn'
                            >
                                Du kan også be om tilgang direkte fra Altinn
                            </NyFaneLenke>
                        </BodyLong>
                    </>
                },
                {
                    id: 'hvilketilgangerkreves',
                    title: 'Hvilke tilganger kreves?',
                    content: <>
                        <BodyLong spacing>
                            Forskjellige tjenester og skjemaer i NAV krever forskjellige tilganger i Altinn.
                        </BodyLong>
                        <Accordion>
                            <Accordion.Item>
                                <Accordion.Header>
                                    Arbeidsforhold
                                </Accordion.Header>
                                <Accordion.Content>
                                    <BodyLong spacing>
                                        Tilgang til innsynstjeneste for arbeidsforhold innrapportert via
                                        a-meldingen gis automatisk til:
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
                                        Du kan også ha rettigheten{' '}<b>Innsyn i Aa-registeret for arbeidsgivere.</b>
                                    </BodyLong>
                                </Accordion.Content>
                            </Accordion.Item>

                            <Accordion.Item>
                                <Accordion.Header>
                                    Avtaler/søknader om NAV-tiltak
                                </Accordion.Header>
                                <Accordion.Content>
                                    <BodyLong spacing>
                                        Vi tilbyr følgende digitale tjenester om NAV-tiltak:
                                        <ul>
                                            <li>avtale om arbeidstrening</li>
                                            <li>avtale om midlertidig lønnstilskudd</li>
                                            <li>avtale om varig lønnstilskudd</li>
                                            <li>avtale om sommerjobb</li>
                                            <li>søknad om inkluderingstilskudd</li>
                                            <li>søknad om tilskudd til mentor</li>
                                            <li>søknad om tilskudd til ekspertbistand</li>
                                        </ul>
                                        <b>Enkeltrettighet i Altinn:</b> For å få tilgang til en av de nevnte tjenestene
                                        ovenfor må du ha enkeltrettigheten til tjenesten i Altinn.
                                        Navn på enkeltrettighetene er det samme som navnet på tjenesten.
                                    </BodyLong>
                                    <LenkeMedLogging
                                        href={lenkeTilInfoOmDigitaleSoknader}
                                        loggLenketekst='Les mer om støtteordningerne fra NAV'
                                    >
                                        Les om digitale tiltakssøknader
                                    </LenkeMedLogging>
                                </Accordion.Content>
                            </Accordion.Item>
                            <Accordion.Item>
                                <Accordion.Header>
                                    Fritak fra arbeidsgiverperioden – gravid ansatt / kronisk sykdom
                                </Accordion.Header>
                                <Accordion.Content>
                                    <BodyLong>
                                        For at søknadene «fritak fra arbeidsgiverperioden – gravid ansatt / kronisk
                                        sykdom» skal vises,
                                        trenger du kun en vilkårlig Altinn-rolle i din virksomhet eller tilgang til Dine
                                        sykmeldte.
                                    </BodyLong>
                                </Accordion.Content>
                            </Accordion.Item>

                            <Accordion.Item>
                                <Accordion.Header>
                                    Inntektsmelding
                                </Accordion.Header>
                                <Accordion.Content>
                                    <BodyLong spacing>
                                        For å få tilgang til digital inntektsmelding må du ha en av disse
                                        Altinn-rollene:
                                        <ul>
                                            <li>ansvarlig revisor</li>
                                            <li>lønn og personalmedarbeider</li>
                                            <li>regnskapsfører lønn</li>
                                            <li>regnskapsfører med signeringsrettighet</li>
                                            <li>regnskapsfører uten signeringsrettighet</li>
                                            <li>revisormedarbeider</li>
                                            <li>norsk representant for utenlandsk enhet</li>
                                        </ul>
                                        Du kan også ha rettigheten <b>inntektsmelding</b>
                                    </BodyLong>
                                    <LenkeMedLogging
                                        href={lenkeTilInforOmInntekstmelding}
                                        loggLenketekst='Les om digital inntektsmelding'
                                    >
                                        Les om digital inntektsmelding
                                    </LenkeMedLogging>
                                </Accordion.Content>
                            </Accordion.Item>

                            <Accordion.Item>
                                <Accordion.Header>
                                    Permittering, masseoppsigelse og innskrenking av arbeidstid
                                </Accordion.Header>
                                <Accordion.Content>
                                    <BodyLong spacing>
                                        For å få tilgang til digitalt skjema om permittering uten lønn,
                                        masseoppsigelse og innskrenking av arbeidstid, trenger du kun en vilkårlig
                                        Altinn-rolle
                                        i din virksomhet. Du vil bare se skjemaer som du selv har opprettet og
                                        sendt inn.
                                    </BodyLong>
                                    <BodyLong>
                                        Tilgang til å kunne se innsendte meldinger gis automatisk til

                                        <ul>
                                            <li>Daglig leder</li>
                                            <li>Styrets leder</li>
                                            <li>Regnskapsfører</li>
                                        </ul>
                                        Du kan også ha rettigheten <b>Innsyn i permittering- og nedbemanningsmeldinger
                                        sendt til NAV.</b></BodyLong>
                                    <LenkeMedLogging
                                        href={infoOmPermitteringURL}
                                        loggLenketekst='les mer om permittering uten lønn osv'
                                    >
                                        Les mer om permittering uten lønn, masseoppsigelse og innskrenking av
                                        arbeidstid
                                    </LenkeMedLogging>
                                </Accordion.Content>
                            </Accordion.Item>

                            <Accordion.Item>
                                <Accordion.Header>
                                    Refusjon av sykepenger i arbeidsgiverperioden - gravid ansatt / kronisk sykdom
                                </Accordion.Header>
                                <Accordion.Content>
                                    <BodyLong spacing>
                                        For å få tilgang til skjemaene «refusjon av sykepenger i
                                        arbeidsgiverperioden - gravid ansatt / kronisk sykdom», så må du ha tilgang
                                        til å sende inntektsmelding.
                                    </BodyLong>

                                    <BodyLong spacing>
                                        Det betyr at du må ha en av disse tilgangene (rollene) for den aktuelle
                                        virksomheten:

                                        <ul>
                                            <li>ansvarlig revisor</li>
                                            <li>lønn og personalmedarbeider</li>
                                            <li>regnskapsfører lønn</li>
                                            <li>regnskapsfører med signeringsrettighet</li>
                                            <li>regnskapsfører uten signeringsrettighet</li>
                                            <li>revisormedarbeider</li>
                                            <li>norsk representant for utenlandsk enhet</li>
                                        </ul>
                                    </BodyLong>
                                </Accordion.Content>
                            </Accordion.Item>

                            <Accordion.Item>
                                <Accordion.Header>
                                    Refusjon av sykepenger ved koronavirus
                                </Accordion.Header>
                                <Accordion.Content>
                                    <BodyLong spacing>
                                        For å få tilgang til skjema for refusjon av sykepenger relatert til
                                        koronavirus må du ha tilgang til å sende inntektsmelding.
                                    </BodyLong>
                                    <BodyLong spacing>
                                        Det betyr at du må ha en av disse tilgangene (rollene) for den aktuelle
                                        virksomheten:

                                        <ul>
                                            <li>ansvarlig revisor</li>
                                            <li>lønn og personalmedarbeider</li>
                                            <li>regnskapsfører lønn</li>
                                            <li>regnskapsfører med signeringsrettighet</li>
                                            <li>regnskapsfører uten signeringsrettighet</li>
                                            <li>revisormedarbeider</li>
                                            <li>norsk representant for utenlandsk enhet</li>
                                        </ul>
                                    </BodyLong>
                                    <LenkeMedLogging
                                        href={infoOmRefusjonSykepengerKoronaURL}
                                        loggLenketekst='Les mer om refusjon av sykepenger ved koronavirus'
                                    >
                                        Les mer om refusjon av sykepenger ved koronavirus
                                    </LenkeMedLogging>
                                </Accordion.Content>
                            </Accordion.Item>
                            <Accordion.Item>
                                <Accordion.Header>
                                    Refusjon for sommerjobb
                                </Accordion.Header>
                                <Accordion.Content>
                                    <BodyLong spacing>
                                        Du må ha enkeltrettigheten inntektsmelding eller en av følgende
                                        Altinn-rollene for å få tilgang til løsningen:

                                        <ul>
                                            <li>ansvarlig revisor</li>
                                            <li>lønn og personalmedarbeider</li>
                                            <li>regnskapsfører lønn</li>
                                            <li>regnskapsfører med signeringsrettighet</li>
                                            <li>regnskapsfører uten signeringsrettighet</li>
                                            <li>revisormedarbeider</li>
                                            <li>norsk representant for utenlandsk enhet</li>
                                        </ul>
                                        Boksen for «Refusjon for sommerjobb» vises kun om
                                        det finnes sommerjobb-tiltak som er aktuelle for refusjon for eller
                                        tidligere refusjonssøknader.
                                    </BodyLong>
                                </Accordion.Content>
                            </Accordion.Item>
                            <Accordion.Item>
                                <Accordion.Header>
                                    Refusjon for utestengte EØS-borgere
                                </Accordion.Header>
                                <Accordion.Content>
                                    <BodyLong spacing>
                                        For å få tilgang til skjema for refusjon for utestengte EØS-borgere
                                        må du ha tilgang til å sende inntektsmelding.
                                    </BodyLong>
                                    <BodyLong spacing>
                                        Det betyr at du må ha en av disse tilgangene (rollene) for den aktuelle
                                        virksomheten:

                                        <ul>
                                            <li>ansvarlig revisor</li>
                                            <li>lønn og personalmedarbeider</li>
                                            <li>regnskapsfører lønn</li>
                                            <li>regnskapsfører med signeringsrettighet</li>
                                            <li>regnskapsfører uten signeringsrettighet</li>
                                            <li>revisormedarbeider</li>
                                            <li>norsk representant for utenlandsk enhet</li>
                                        </ul>
                                    </BodyLong>
                                    <LenkeMedLogging
                                        href={infoOmRefusjonInnreiseforbudKoronaURL}
                                        loggLenketekst='Les mer om refusjon ved innreiseforbud under pandemien'
                                    >
                                        Les mer om refusjon ved innreiseforbud under pandemien
                                    </LenkeMedLogging>
                                </Accordion.Content>
                            </Accordion.Item>

                            <Accordion.Item>
                                <Accordion.Header>
                                    Rekruttering
                                </Accordion.Header>
                                <Accordion.Content>
                                    <BodyLong spacing>
                                        På{' '}
                                        <LenkeMedLogging
                                            href='https://arbeidsplassen.nav.no/bedrift'
                                            loggLenketekst='Arbeidsplassen'
                                        >
                                            Arbeidsplassen
                                        </LenkeMedLogging>{' '}
                                        kan du finne kandidater og lage stillingsannonser. For å få tilgang må
                                        du ha en av rollene

                                        <ul>
                                            <li>lønn og personalmedarbeider</li>
                                            <li>utfyller/innsender</li>
                                        </ul>

                                        Du kan også ha enkeltrettigheten <b>rekruttering</b>
                                    </BodyLong>
                                </Accordion.Content>
                            </Accordion.Item>

                            <Accordion.Item>
                                <Accordion.Header>
                                    Sykefraværsstatistikk
                                </Accordion.Header>
                                <Accordion.Content>
                                    <BodyLong spacing>
                                        For å få tilgang til legemeldt sykefraværsstatistikk og tjenester fra
                                        NAV Arbeidslivssenter må du ha
                                    </BodyLong>
                                    <BodyLong spacing>
                                        <b>Rolle i Altinn:</b> helse-, sosial- og velferdstjenester
                                    </BodyLong>
                                    <BodyLong spacing>
                                        <b>Eller enkeltrettigheten:</b> sykefraværsstatistikk for virksomheter
                                    </BodyLong>
                                    <LenkeMedLogging
                                        href={infoOmSykefraværsstatistikk}
                                        loggLenketekst='Les mer om tjenesten sykefraværsstatistikk'
                                    >
                                        Les mer om tjenesten sykefraværsstatistikk på nav.no
                                    </LenkeMedLogging>
                                </Accordion.Content>
                            </Accordion.Item>

                            <Accordion.Item>
                                <Accordion.Header>
                                    Sykmelding/ sykefraværsoppfølging
                                </Accordion.Header>
                                <Accordion.Content>
                                    <BodyLong spacing>
                                        HR og lønn trenger følgende fire enkeltrettigheter: Sykmelding – oppgi
                                        leder, Sykmelding, Søknad om sykepenger og Digital oppfølgingsplan for
                                        sykmeldte.
                                    </BodyLong>
                                    <BodyLong spacing>
                                        Nærmeste leder trenger ikke Altinn-tilgang. Bedriften må ha fylt ut
                                        skjemaet «Sykmelding – oppgi nærmeste leder».
                                    </BodyLong>
                                    <LenkeMedLogging
                                        href={infoOmRettigheterTilSykemeldingURL}
                                        loggLenketekst='Les mer om tjenestene og tilhørende enkeltrettigheter'
                                    >
                                        Les mer om tjenestene og tilhørende enkeltrettigheter (nav.no)
                                    </LenkeMedLogging>
                                </Accordion.Content>
                            </Accordion.Item>

                            <Accordion.Item>
                                <Accordion.Header>
                                    Tilskuddsbrev for NAV-tiltak
                                </Accordion.Header>
                                <Accordion.Content>
                                    <BodyLong spacing>
                                        For å få tilgang til digitale tilskuddsbrev om NAV-tiltak må du ha en av
                                        disse lederrollene i Altinn:

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
                                        Enkeltansatte får tilgang ved å bli tildelt enkeltrettigheten:{' '}
                                        <b>Tilskuddsbrev NAV-tiltak</b>
                                    </BodyLong>
                                    <BodyLong spacing>
                                        NAV sender digitale tilskuddsbrev for følgende tiltak:

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
                                    </BodyLong>
                                </Accordion.Content>
                            </Accordion.Item>

                            <Accordion.Item>
                                <Accordion.Header>
                                    Utsendt arbeidstaker til EØS/Sveits
                                </Accordion.Header>
                                <Accordion.Content>
                                    <BodyLong spacing>
                                        For å få tilgang til skjemaet «Søknad om A1 for utsendte arbeidstakeren innen
                                        EØS/Sveits» må du ha Altinn-rollen:

                                        <ul>
                                            <li>Lønn og personalmedarbeider</li>
                                        </ul>

                                        Du kan også ha enkeltrettigheten «Søknad om A1 for utsendte arbeidstakere innen
                                        EØS/Sveits».
                                    </BodyLong>
                                </Accordion.Content>
                            </Accordion.Item>
                        </Accordion>
                    </>
                },
                {
                    id: 'manglerduvarslerialtinnellerkommerdetilfeiladresse',
                    title: 'Mangler du varsler i Altinn eller kommer de til feil adresse?',
                    content: <>
                        <BodyLong spacing>
                            Husk å oppdatere din kontaktinformasjon som arbeidsgiver i Altinn. Hvis du ønsker varsling
                            kun på spesifikke tjenester kan du også ordne det i Altinn.
                        </BodyLong>
                        <BodyLong spacing>
                            <NyFaneLenke
                                href={infoOmAltinnVarslerURL}
                                loggLenketekst='Les mer på Altinn om hvordan du kan velge hvor du ønsker å bli varslet, og for hva'
                            >
                                Les mer på Altinn om hvordan du kan velge hvor du ønsker å bli varslet, og for hva
                            </NyFaneLenke>
                        </BodyLong>
                    </>
                },
            ]}/>
        </div>
    );
};

export default InformasjonOmTilgangsstyringSide;
