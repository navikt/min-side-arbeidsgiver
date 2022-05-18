import React from 'react';
import './KontaktFelt.less';
import {BodyLong, Heading, Ingress} from "@navikt/ds-react";
import {LenkeMedLogging} from '../../../GeneriskeElementer/LenkeMedLogging';
import {Dialog, Send, Telephone} from "@navikt/ds-icons";


export const KontaktFelt = () => (
    <div className={"kontaktfelt"}>
        <div className={"kontaktfelt__content"}>
            <Heading size="xlarge" level="2">
                Noe du ikke finner svar på her?
            </Heading>

            <ul>
                <li>
                    <LenkeMedLogging loggLenketekst={"Chat med Frida"} href={"/foo"}>
                        <Dialog style={{height: "1.5rem", width: "1.5rem"}}/>
                        <Ingress>Chat med Frida</Ingress>
                    </LenkeMedLogging>
                    <BodyLong spacing>
                        Du møter først en chatbot, men kan gå videre og chatte med en veileder (hverdager 09.00–14.30).
                    </BodyLong>
                </li>

                <li>
                    <LenkeMedLogging loggLenketekst={"Kontaktskjema"} href={"/foo"}>
                        <Send style={{height: "1.5rem", width: "1.5rem"}}/>
                        <Ingress>Kontaktskjema</Ingress>
                    </LenkeMedLogging>
                    <BodyLong spacing>
                        Rekruttering, inkludering og forebygging av sykefravær.
                    </BodyLong>
                </li>
                <li>
                    <LenkeMedLogging loggLenketekst={"Ring oss på 55 55 33 36"} href={"/foo"}>
                        <Telephone style={{height: "1.5rem", width: "1.5rem"}}/>
                        <Ingress>Ring oss på 55 55 33 36</Ingress>
                    </LenkeMedLogging>
                    <BodyLong spacing>
                        Åpningstider: hverdager 09.00 - 15.00. <br/>
                        Generell informasjon, status i en sak og veileding i selvbetjente løsninger.
                    </BodyLong>
                </li>
            </ul>
        </div>
    </div>
)
