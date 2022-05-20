import React, {useEffect, useState} from 'react';
import './KontaktFelt.less';
import {BodyLong, Heading, Ingress} from "@navikt/ds-react";
import {LenkeMedLogging} from '../../../GeneriskeElementer/LenkeMedLogging';
import {Dialog, Send, Telephone} from "@navikt/ds-icons";
import { kontaktskjemaURL, ringOssTLF } from '../../../lenker';


const selector = ["button", "[href]", "input", "select", "textarea", "[tabindex]"]
    .map(e => `#nav-chatbot ${e}:not([tabindex="-1"])`)
    .join(",")

const showFrida = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    const chatbot = document.getElementById("nav-chatbot")
    if (chatbot != null) chatbot.style.visibility = "visible";
    document.getElementById("chatbot-frida-knapp")?.click();
    (document.querySelector(selector) as HTMLElement)?.focus();
};


const ChatMedFrida =
     <li>
        <LenkeMedLogging href={"#"} loggLenketekst={"Chat med Frida"} onClick={showFrida}>
            <Dialog style={{height: "1.5rem", width: "1.5rem"}}/>
            <Ingress>Chat med Frida</Ingress>
        </LenkeMedLogging>
        <BodyLong spacing>
            Du møter først en chatbot, men kan gå videre og chatte med en veileder (hverdager 09.00–14.30).
        </BodyLong>
    </li>


export const KontaktFelt = () => {
    const [frida, setFrida] = useState<null|HTMLElement>(null)
    useEffect(()=>{
        const startTime = Date.now()
        const timer = setInterval(()=>{
            const fridaElm = document.getElementById("chatbot-frida-knapp");
            if (fridaElm !== null) {
                setFrida(fridaElm);
                clearInterval(timer);
            }
            if (Date.now() - startTime > 10_000){
                clearInterval(timer);
            }
        }, 50)
        return ()=>{
            clearInterval(timer)
        }
    },[])

    return (
        <div className="kontaktfelt">
            <div className="kontaktfelt__content">
                <Heading size="xlarge" level="2">
                    Noe du ikke finner svar på her?
                </Heading>

                <ul>
                    {
                        frida !== null ? ChatMedFrida : null
                    }
                    <li>
                        <LenkeMedLogging loggLenketekst={"Kontaktskjema"} href={kontaktskjemaURL}>
                            <Send style={{height: "1.5rem", width: "1.5rem"}}/>
                            <Ingress>Kontaktskjema</Ingress>
                        </LenkeMedLogging>
                        <BodyLong spacing>
                            Rekruttering, inkludering og forebygging av sykefravær.
                        </BodyLong>
                    </li>
                    <li>
                        <LenkeMedLogging loggLenketekst={"Ring oss på 55 55 33 36"} href={ringOssTLF}>
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
    );
}
