import React, {FunctionComponent} from 'react';
import Bedriftsmeny from "@navikt/bedriftsmeny";
import {TilgangsStyringInfoTekst} from './TilgangsStyringInfoTekst/TilgangsStyringInfoTekst';
import Brodsmulesti from '../Brodsmulesti/Brodsmulesti';
import AdvarselBannerTestversjon from '../Hovedside/AdvarselBannerTestVersjon/AdvarselBannerTestversjon';
import './Logginn.css';
import {Button} from '@navikt/ds-react';
import {LenkeMedLogging} from '../../GeneriskeElementer/LenkeMedLogging';
import {BodyLong, BodyShort, Heading} from "@navikt/ds-react";

export const LoggInn: FunctionComponent = () => {

    const redirectTilLogin = () => {
        window.location.href = '/min-side-arbeidsgiver/redirect-til-login';
    };

    return (
        <div className="innloggingsside">
            <Brodsmulesti brodsmuler={[]}/>
            <Bedriftsmeny
                sidetittel="Min side – arbeidsgiver"
                undertittel="Innloggede tjenester for arbeidsgiver"
            />
            <div className="innloggingsside__container">
                <div className="innloggingsside__innhold">
                    <AdvarselBannerTestversjon/>
                    <Heading size="medium" level="2">
                        Her kan du:
                    </Heading>
                    <BodyLong>
                        <ul className="innloggingsside__punktliste">
                            {
                                ["se sykmeldte og sykefraværsstatistikk",
                                    "rekruttere nye medarbeider",
                                    "se ansatte (fra Aa-registret)",
                                    "finne tilskuddsbrev om NAV-tiltak",
                                    "finne refusjonskrav for kronisk syke/gravide",
                                    "sende inn digitale skjemaer",
                                ].map(text => <li> {text} </li>)
                            }
                        </ul>
                    </BodyLong>
                    <TilgangsStyringInfoTekst/>

                    <Button
                        variant="primary"
                        size="medium"
                        className="innloggingsside__loginKnapp"
                        onClick={redirectTilLogin}
                    >
                        Logg inn
                    </Button>

                    <div className="innloggingsside__besok-ditt-nav">
                        <BodyShort> Ønsker du å se dine tjenester som privatperson? </BodyShort>
                        <LenkeMedLogging href={'https://www.nav.no/person/dittnav/'}
                                         loggLenketekst="Logg inn som privatperson">
                            Logg inn på Ditt NAV
                        </LenkeMedLogging>
                    </div>
                </div>
            </div>
        </div>
    );
};