import React, {MouseEventHandler, useEffect, useState} from 'react';
import {Accordion, BodyLong, BodyShort, Heading, Menu, Panel} from '@navikt/ds-react';
import "@navikt/ds-css";
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
} from '../../lenker';
import NyFaneLenke from '../../GeneriskeElementer/NyFaneLenke';
import {LenkeMedLogging} from '../../GeneriskeElementer/LenkeMedLogging';
import {HeadingMedClipBoardLink} from "./helpers/HeadingMedClipBoardLink";
import './InformasjonOmTilgangsstyringSide.less';
import icon from './icon_tilgang.svg';

const InformasjonOmTilgangsstyringSide = () => {
    const [activeAnchor, setActiveAnchor] = useState<string | undefined>(undefined);
    const setActiveAnchorOnClick = (anchor: string): MouseEventHandler<HTMLAnchorElement> => {
        return (e) => {
            setActiveAnchor(anchor);
            history.pushState(null, '', anchor);
            e.preventDefault();
            e.currentTarget.blur();
        }
    }
    useEffect(() => {
        const hash = document.location.hash;
        if (hash.length > 0) {
            setActiveAnchor(hash);
        }
    }, []);
    useEffect(() => {
        const scrollListener = () => {
            const distances: [string, number][] = [
                '#kortomtilgangerialtinn',
                '#hardualleredetilgangtilnoentjenester',
                '#hvilketilgangerkreves',
                '#manglerduvarslerialtinnellerkommerdetilfeiladresse',
            ].map(id => {
                const rect = document.querySelector(id)?.getBoundingClientRect();
                const distance = Math.abs(rect?.top ?? 10000000);
                return [id, distance];
            });
            distances.sort(([_a, distanceA], [_b, distanceB]) => distanceA - distanceB)
            const nearest = distances[0][0];
            if (nearest !== undefined) {
                setActiveAnchor(nearest);
            }
        };
        /**
         * obs: lytter til wheel og touchmove i stedet for scroll
         * Dette slik at det fungerer på touch og mouse uten å kollidere med
         * Element.scrollIntoView som også trigger en scroll
         */
        const events = ['wheel', 'touchmove'];
        events.forEach(e => window.addEventListener(e, scrollListener));
        return () => events.forEach(e => window.removeEventListener(e, scrollListener));
    }, []);
    useEffect(() => {
        if (activeAnchor !== undefined) {
            document.querySelector(activeAnchor)?.scrollIntoView({
                behavior: "smooth",
                block: "start",
                inline: "nearest"
            });
        }
    }, [activeAnchor]);

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
            <div className='informasjon-om-tilgangsstyring__container'>
                <aside className='informasjon-om-tilgangsstyring__sidepanel'>
                    <Panel className='informasjon-om-tilgangsstyring__sidepanel-meny'>
                        <Menu>
                            <Heading className='informasjon-om-tilgangsstyring__sidepanel-menyhead' level='2' size="small" spacing>
                                Innhold
                            </Heading>
                            <Menu.Item
                                active={activeAnchor === '#kortomtilgangerialtinn'}
                                onClick={setActiveAnchorOnClick('#kortomtilgangerialtinn')}
                                href='#kortomtilgangerialtinn'
                                key='#kortomtilgangerialtinn'
                            >
                                Kort om tilganger i Altinn
                            </Menu.Item>
                            <Menu.Item
                                active={activeAnchor === '#hardualleredetilgangtilnoentjenester'}
                                onClick={setActiveAnchorOnClick('#hardualleredetilgangtilnoentjenester')}
                                href='#hardualleredetilgangtilnoentjenester'
                                key='#hardualleredetilgangtilnoentjenester'
                            >
                                Har du allerede tilgang til noen tjenester?
                            </Menu.Item>
                            <Menu.Item
                                active={activeAnchor === '#hvilketilgangerkreves'}
                                onClick={setActiveAnchorOnClick('#hvilketilgangerkreves')}
                                href='#hvilketilgangerkreves'
                                key='#hvilketilgangerkreves'
                            >
                                Hvilke tilganger kreves?
                            </Menu.Item>
                            <Menu.Item
                                active={activeAnchor === '#manglerduvarslerialtinnellerkommerdetilfeiladresse'}
                                onClick={setActiveAnchorOnClick('#manglerduvarslerialtinnellerkommerdetilfeiladresse')}
                                href='#manglerduvarslerialtinnellerkommerdetilfeiladresse'
                                key='#manglerduvarslerialtinnellerkommerdetilfeiladresse'
                            >
                                Mangler du varsler i Altinn eller kommer de til feil adresse?
                            </Menu.Item>
                        </Menu>
                    </Panel>
                </aside>
                <div className='informasjon-om-tilgangsstyring__innhold'>
                    <Panel className='informasjon-om-tilgangsstyring__tekst'>
                        <HeadingMedClipBoardLink level='2'
                                                 id='kortomtilgangerialtinn'
                                                 title='Kort om tilganger i Altinn'/>

                        <BodyLong size='small' spacing>
                            For å få tilgang til NAVs tjenester til arbeidsgiver må du ha blitt tildelt
                            nødvendige Altinn-rettigheter av din arbeidsgiver. Administrator for Altinn
                            i virksomheten er ofte daglig leder, men det kan også være andre.
                        </BodyLong>

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
                    </Panel>
                    <Panel className='informasjon-om-tilgangsstyring__tekst'>
                        <HeadingMedClipBoardLink level='2'
                                                 id='hardualleredetilgangtilnoentjenester'
                                                 title='Har du allerede tilgang til noen tjenester?'/>

                        <BodyLong size='small' spacing>
                            Hvis du allerede har tilgang til noen tjenester i en virksomhet kan du
                            be om tilgang til flere.
                        </BodyLong>
                        <ul>
                            <li>Logg inn på Min side – arbeidsgiver.</li>
                            <li>Velg virksomhet.</li>
                            <li>Lengst nede på Min side – arbeidsgiver finnes en oversikt over tjenester du kan
                                be om tilgang til.
                            </li>
                            <li>Klikk på lenken «- be om tilgang» på tjenesten du trenger. Du kommer nå til Altinn.</li>
                        </ul>
                        <BodyLong size='small' spacing>
                            I Altinn velger du hvem i din virksomhet som skal få varslet og legger inn en melding hvis
                            du vil. Du blir selv varslet når forespørselen er behandlet og tilganger er på plass.
                        </BodyLong>
                        <BodyLong size='small' spacing>
                            For «Dine sykmeldte» kan du ikke be om tilgang fra Altinn. Her må du registreres som
                            nærmeste leder for en eller flere ansatte.
                        </BodyLong>
                    </Panel>
                    <Panel className='informasjon-om-tilgangsstyring__tekst'>
                        <HeadingMedClipBoardLink level='2'
                                                 id='hvilketilgangerkreves'
                                                 title='Hvilke tilganger kreves?'/>
                        <BodyLong size='small' spacing>
                            Forskjellige tjenester og skjemaer i NAV krever forskjellige tilganger i Altinn.
                        </BodyLong>
                        <Accordion>
                            <Accordion.Item>
                                <Accordion.Header>
                                    Arbeidsforhold
                                </Accordion.Header>
                                <Accordion.Content>
                                    <BodyLong size='small' spacing>
                                        Tilgang til innsynstjeneste for arbeidsforhold innrapportert via
                                        a-meldingen gis automatisk til:
                                    </BodyLong>
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
                                    <BodyLong size='small'>
                                        Du kan også ha rettigheten{' '}<b>Innsyn i Aa-registeret for arbeidsgivere.</b>
                                    </BodyLong>
                                </Accordion.Content>
                            </Accordion.Item>
                            <Accordion.Item>
                                <Accordion.Header>
                                    Avtaler/søknader om NAV-tiltak
                                </Accordion.Header>
                                <Accordion.Content>
                                    <BodyLong size='small' spacing>
                                        Vi tilbyr følgende digitale tjenester om NAV-tiltak:
                                    </BodyLong>
                                    <ul>
                                        <li>avtale om arbeidstrening</li>
                                        <li>avtale om midlertidig lønnstilskudd</li>
                                        <li>avtale om varig lønnstilskudd</li>
                                        <li>avtale om sommerjobb</li>
                                        <li>søknad om inkluderingstilskudd</li>
                                        <li>søknad om tilskudd til mentor</li>
                                        <li>søknad om tilskudd til ekspertbistand</li>
                                    </ul>
                                    <BodyLong size='small' spacing>
                                        <b>Enkeltrettighet i Altinn:</b> For å få tilgang til en av de nevnte tjenestene
                                        ovenfor må du ha enkeltrettigheten til tjenesten i Altinn.
                                        Navn på enkeltrettighetene er det samme som navnet på tjenesten.
                                    </BodyLong>
                                    <LenkeMedLogging
                                        href={lenkeTilInfoOmDigitaleSoknader}
                                        loggLenketekst='Les om digitale tiltakssøknader'
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
                                    <BodyLong size='small'>
                                        For at søknadene «fritak fra arbeidsgiverperioden – gravid ansatt / kronisk
                                        sykdom» skal vises,
                                        trenger du kun en vilkårlig Altinn-rolle i din virksomhet eller tilgang til Dine
                                        sykemeldte.
                                    </BodyLong>
                                </Accordion.Content>
                            </Accordion.Item>
                            <Accordion.Item>
                                <Accordion.Header>
                                    Inntektsmelding
                                </Accordion.Header>
                                <Accordion.Content>
                                    <BodyLong size='small' spacing>
                                        For å få tilgang til digital inntektsmelding må du ha en av disse
                                        Altinn-rollene:
                                    </BodyLong>
                                    <ul>
                                        <li>ansvarlig revisor</li>
                                        <li>lønn og personalmedarbeider</li>
                                        <li>regnskapsfører lønn</li>
                                        <li>regnskapsfører med signeringsrettighet</li>
                                        <li>regnskapsfører uten signeringsrettighet</li>
                                        <li>revisormedarbeider</li>
                                        <li>norsk representant for utenlandsk enhet</li>
                                    </ul>
                                    <BodyLong size='small' spacing>
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
                                    <BodyLong size='small' spacing>
                                        For å få tilgang til digitalt skjema om permittering uten lønn,
                                        masseoppsigelse og innskrenking av arbeidstid, trenger du kun en vilkårlig
                                        Altinn-rolle
                                        i din virksomhet. Du vil bare se skjemaer som du selv har opprettet og
                                        sendt inn.
                                    </BodyLong>
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
                                    <BodyLong size='small' spacing>
                                        For å få tilgang til skjemaene «refusjon av sykepenger i
                                        arbeidsgiverperioden - gravid ansatt / kronisk sykdom», så må du ha tilgang
                                        til å sende inntektsmelding.
                                    </BodyLong>

                                    <BodyLong size='small' spacing>
                                        Det betyr at du må ha en av disse tilgangene (rollene) for den aktuelle
                                        virksomheten:
                                    </BodyLong>
                                    <ul>
                                        <li>ansvarlig revisor</li>
                                        <li>lønn og personalmedarbeider</li>
                                        <li>regnskapsfører lønn</li>
                                        <li>regnskapsfører med signeringsrettighet</li>
                                        <li>regnskapsfører uten signeringsrettighet</li>
                                        <li>revisormedarbeider</li>
                                        <li>norsk representant for utenlandsk enhet</li>
                                    </ul>
                                </Accordion.Content>
                            </Accordion.Item>
                            <Accordion.Item>
                                <Accordion.Header>
                                    Refusjon av sykepenger ved koronavirus
                                </Accordion.Header>
                                <Accordion.Content>
                                    <BodyLong size='small' spacing>
                                        For å få tilgang til skjema for refusjon av sykepenger relatert til
                                        koronavirus må du ha tilgang til å sende inntektsmelding.
                                    </BodyLong>
                                    <BodyLong size='small' spacing>
                                        Det betyr at du må ha en av disse tilgangene (rollene) for den aktuelle
                                        virksomheten:
                                    </BodyLong>
                                    <ul>
                                        <li>ansvarlig revisor</li>
                                        <li>lønn og personalmedarbeider</li>
                                        <li>regnskapsfører lønn</li>
                                        <li>regnskapsfører med signeringsrettighet</li>
                                        <li>regnskapsfører uten signeringsrettighet</li>
                                        <li>revisormedarbeider</li>
                                        <li>norsk representant for utenlandsk enhet</li>
                                    </ul>
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
                                    Refusjon for utestengte EØS-borgere
                                </Accordion.Header>
                                <Accordion.Content>
                                    <BodyLong size='small' spacing>
                                        For å få tilgang til skjema for refusjon for utestengte EØS-borgere
                                        må du ha tilgang til å sende inntektsmelding.
                                    </BodyLong>
                                    <BodyLong size='small' spacing>
                                        Det betyr at du må ha en av disse tilgangene (rollene) for den aktuelle
                                        virksomheten:
                                    </BodyLong>
                                    <ul>
                                        <li>ansvarlig revisor</li>
                                        <li>lønn og personalmedarbeider</li>
                                        <li>regnskapsfører lønn</li>
                                        <li>regnskapsfører med signeringsrettighet</li>
                                        <li>regnskapsfører uten signeringsrettighet</li>
                                        <li>revisormedarbeider</li>
                                        <li>norsk representant for utenlandsk enhet</li>
                                    </ul>
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
                                    <BodyLong size='small' spacing>
                                        På{' '}
                                        <LenkeMedLogging
                                            href='https://arbeidsplassen.nav.no/bedrift'
                                            loggLenketekst='Arbeidsplassen'
                                        >
                                            Arbeidsplassen
                                        </LenkeMedLogging>{' '}
                                        kan du finne kandidater og lage stillingsannonser. For å få tilgang må
                                        du ha en av rollene
                                    </BodyLong>
                                    <ul>
                                        <li>lønn og personalmedarbeider</li>
                                        <li>utfyller/innsender</li>
                                    </ul>
                                    <BodyLong size='small'>
                                        Du kan også ha enkeltrettigheten <b>rekruttering</b>
                                    </BodyLong>
                                </Accordion.Content>
                            </Accordion.Item>
                            <Accordion.Item>
                                <Accordion.Header>
                                    Sykefraværsstatistikk
                                </Accordion.Header>
                                <Accordion.Content>
                                    <BodyLong size='small' spacing>
                                        For å få tilgang til legemeldt sykefraværsstatistikk og tjenester fra
                                        NAV Arbeidslivssenter må du ha
                                    </BodyLong>
                                    <BodyLong size='small' spacing>
                                        <b>Rolle i Altinn:</b> helse-, sosial- og velferdstjenester
                                    </BodyLong>
                                    <BodyLong size='small' spacing>
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
                                    <BodyLong size='small' spacing>
                                        HR og lønn trenger følgende fire enkeltrettigheter: Sykmelding – oppgi
                                        leder, Sykmelding, Søknad om sykepenger og Digital oppfølgingsplan for
                                        sykmeldte.
                                    </BodyLong>
                                    <BodyLong size='small' spacing>
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
                                    <BodyLong size='small' spacing>
                                        For å få tilgang til digitale tilskuddsbrev om NAV-tiltak må du ha en av
                                        disse lederrollene i Altinn:
                                    </BodyLong>
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
                                    <BodyLong size='small' spacing>
                                        Enkeltansatte får tilgang ved å bli tildelt enkeltrettigheten:{' '}
                                        <b>Tilskuddsbrev NAV-tiltak</b>
                                    </BodyLong>
                                    <BodyLong size='small' spacing>
                                        NAV sender digitale tilskuddsbrev for følgende tiltak:
                                    </BodyLong>
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
                                </Accordion.Content>
                            </Accordion.Item>
                            <Accordion.Item>
                                <Accordion.Header>
                                    Utsendt arbeidstaker til EØS/Sveits
                                </Accordion.Header>
                                <Accordion.Content>
                                    <BodyLong size='small' spacing>
                                        For å få tilgang til skjemaet «Søknad om A1 for utsendte arbeidstakeren innen
                                        EØS/Sveits» må du ha Altinn-rollen:
                                    </BodyLong>
                                    <ul>
                                        <li>Lønn og personalmedarbeider</li>
                                    </ul>
                                    <BodyLong size='small'>
                                        Du kan også ha enkeltrettigheten «Søknad om A1 for utsendte arbeidstakere innen
                                        EØS/Sveits».
                                    </BodyLong>
                                </Accordion.Content>
                            </Accordion.Item>
                        </Accordion>
                    </Panel>
                    <Panel className='informasjon-om-tilgangsstyring__tekst'>
                        <HeadingMedClipBoardLink level='2'
                                                 id='manglerduvarslerialtinnellerkommerdetilfeiladresse'
                                                 title='Mangler du varsler i Altinn eller kommer de til feil adresse?'/>
                        <BodyLong size='small' spacing>
                            Husk å oppdatere din kontaktinformasjon som arbeidsgiver i Altinn. Hvis du ønsker varsling
                            kun på spesifikke tjenester kan du også ordne det i Altinn.
                        </BodyLong>
                        <BodyLong size='small' spacing>
                            <NyFaneLenke
                                href={infoOmAltinnVarslerURL}
                                loggLenketekst='Les mer på Altinn om hvordan du kan velge hvor du ønsker å bli varslet, og for hva'
                            >
                                Les mer på Altinn om hvordan du kan velge hvor du ønsker å bli varslet, og for hva
                            </NyFaneLenke>
                        </BodyLong>
                    </Panel>
                </div>
            </div>
        </div>
    );
};

export default InformasjonOmTilgangsstyringSide;
