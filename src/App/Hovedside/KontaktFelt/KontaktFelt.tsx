import React from 'react';
import './KontaktFelt.css';
import {BodyLong, Heading, Ingress} from "@navikt/ds-react";
import {LenkeMedLogging} from '../../../GeneriskeElementer/LenkeMedLogging';
import {Dialog, Send, Telephone} from "@navikt/ds-icons";
import {kontaktskjemaURL, ringOssTLF} from '../../../lenker';
import {openChatbot} from "@navikt/nav-dekoratoren-moduler";

const showFrida = (event: React.MouseEvent<HTMLAnchorElement>) => {
    openChatbot();
    event.preventDefault();
    event.stopPropagation();
};

export const KontaktFelt = () => {
    return (
        <div className="kontaktfelt">
            <div className="kontaktfelt__content">
                <Heading size="large" level="2">
                    Trenger du hjelp?
                </Heading>

                <ul>
                    <li>
                        <LenkeMedLogging href={"#"} loggLenketekst={"Chat med Frida"} onClick={showFrida}>
                            <Dialog title="Dialogikon" style={{height: "1.5rem", width: "1.5rem"}} aria-hidden="true"/>
                            <Ingress>Chat med Frida</Ingress>
                        </LenkeMedLogging>
                        <BodyLong spacing>
                            Du møter først en chatbot, men kan gå videre og chatte med en veileder (hverdager
                            09.00&ndash;15.00).
                        </BodyLong>
                    </li>
                    <li>
                        <LenkeMedLogging loggLenketekst={"Kontaktskjema"} href={kontaktskjemaURL}>
                            <Send title="Sendikon" style={{height: "1.5rem", width: "1.5rem"}} aria-hidden="true"/>
                            <Ingress>Kontaktskjema</Ingress>
                        </LenkeMedLogging>
                        <BodyLong spacing>
                            Rekruttering, inkludering og forebygging av sykefravær.
                        </BodyLong>
                    </li>
                    <li>
                        <LenkeMedLogging loggLenketekst={"Ring oss på 55 55 33 36"} href={ringOssTLF}>
                            <Telephone title="Telefonikon" style={{height: "1.5rem", width: "1.5rem"}} aria-hidden="true"/>
                            <Ingress>Ring oss på 55 55 33 36</Ingress>
                        </LenkeMedLogging>
                        <BodyLong spacing>
                            Åpningstider: hverdager 09.00&ndash;15.00. <br/>
                            Generell informasjon, status i en sak og veileding i selvbetjente løsninger.
                        </BodyLong>
                    </li>
                </ul>
            </div>
        </div>
    );
}
