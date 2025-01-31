import React from 'react';
import './TrengerDuHjelp.css';
import { BodyLong, BodyShort, Heading } from '@navikt/ds-react';
import { LenkeMedLogging } from '../../GeneriskeElementer/LenkeMedLogging';
import { Dialog, Send, Telephone } from '@navikt/ds-icons';
import { kontaktskjemaURL } from '../../lenker';
import { openChatbot } from '@navikt/nav-dekoratoren-moduler';
import { gittMiljo } from '../../utils/environment';

const showFrida = (event: React.MouseEvent<HTMLAnchorElement>) => {
    openChatbot();
    event.preventDefault();
    event.stopPropagation();
};

export const TrengerDuHjelp = () => {
    return (
        <div className="kontaktfelt">
            <div className="kontaktfelt__content">
                <Heading size="large" level="2">
                    Trenger du hjelp?
                </Heading>

                <ul>
                    <li>
                        <BodyShort size="large">
                            <LenkeMedLogging
                                loggLenketekst="Ring oss på 55 55 33 36"
                                href="tel:55553336"
                            >
                                <Telephone
                                    title="Telefonikon"
                                    style={{ height: '1.5rem', width: '1.5rem' }}
                                    aria-hidden="true"
                                />
                                Ring oss på 55 55 33 36
                            </LenkeMedLogging>
                        </BodyShort>
                        <BodyLong spacing>
                            Åpent hverdager kl. 9–15. Vi kan ringe deg tilbake hvis ventetiden er
                            over 5 min.
                        </BodyLong>
                    </li>
                    <li>
                        <BodyShort size="large">
                            <LenkeMedLogging
                                loggLenketekst={'Kontaktskjema'}
                                href={kontaktskjemaURL}
                            >
                                <Send
                                    title="Sendikon"
                                    style={{ height: '1.5rem', width: '1.5rem' }}
                                    aria-hidden="true"
                                />
                                Kontaktskjema
                            </LenkeMedLogging>
                        </BodyShort>
                        <BodyLong spacing>
                            Du kan skrive til oss hvis du ønsker hjelp til å rekruttere, inkludere
                            arbeidstakere og forebygge sykefravær.
                        </BodyLong>
                    </li>
                    <li>
                        <BodyShort size="large">
                            <LenkeMedLogging
                                href={'#'}
                                loggLenketekst={'Chat med Frida'}
                                onClick={showFrida}
                            >
                                <Dialog
                                    title="Dialogikon"
                                    style={{ height: '1.5rem', width: '1.5rem' }}
                                    aria-hidden="true"
                                />
                                Chat med Frida
                            </LenkeMedLogging>
                        </BodyShort>
                        <BodyLong spacing>
                            Du møter først chatbot Frida som har døgnåpent. Mellom klokken 9 og
                            14.30 på hverdager kan du be Frida om å få chatte med en veileder.
                        </BodyLong>
                    </li>
                </ul>
            </div>
        </div>
    );
};
