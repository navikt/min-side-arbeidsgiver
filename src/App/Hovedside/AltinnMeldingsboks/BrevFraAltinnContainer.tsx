import React, {useContext} from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import {OrganisasjonsDetaljerContext} from '../../OrganisasjonDetaljerProvider';
import {AltinnBrev, Status} from '../../../api/altinnApi';
import NyFaneLenke from '../../../GeneriskeElementer/NyFaneLenke';
import AntallUlest from '../../../GeneriskeElementer/AntallUlest';
import Innboksikon from './Innboksikon';
import {loggNavigasjon} from '../../../utils/funksjonerForAmplitudeLogging';
import './BrevFraAltinnContainer.less';
import {BodyShort, Heading} from "@navikt/ds-react";

const loggNavigering = (href: string, lenketekst: string) => () => {
    if (href === '') {
        loggNavigasjon(undefined, lenketekst);
    } else {
        const {origin, pathname} = new URL(href)
        const url = `${origin}${pathname.replace(/\d/g, 'X')}`
        loggNavigasjon(url, lenketekst);
    }
}

const BrevFraAltinnContainer: React.FunctionComponent = _ => {
    const {altinnMeldingsboks} = useContext(OrganisasjonsDetaljerContext);

    if (altinnMeldingsboks === undefined || altinnMeldingsboks.brev.length === 0) {
        return null;
    }

    const inboksTittel = (
        <Heading size="small" level="3" className="tilskuddsbrev__tittel">
            <div className="tilskuddsbrev__inboxikon">
                <Innboksikon/>
                <AntallUlest antallUlest={altinnMeldingsboks.antallUleste}/>
            </div>
            <span>Tilskuddsbrev om NAV-tiltak fra Altinn innboks</span>
        </Heading>

    );

    return (
        <section className="tilskuddsbrev">
            <Ekspanderbartpanel tittel={inboksTittel}>
                <>
                    <ul className="tilskuddsbrev__liste">
                        {altinnMeldingsboks.brev.map(BrevContainer)}
                    </ul>
                    {altinnMeldingsboks.finnesFlereBrev && (
                        <NyFaneLenke
                            href={altinnMeldingsboks.portalview}
                            onClick={loggNavigering(
                                altinnMeldingsboks.portalview,
                                'se flere i altinn meldingsboks'
                            )}
                            loggLenketekst="Se flere i Altinn meldingsboks"
                        >
                            Se flere i Altinn meldingsboks
                        </NyFaneLenke>
                    )}
                </>
            </Ekspanderbartpanel>
        </section>
    );
};

const dateFormat = new Intl.DateTimeFormat('no', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
});

const BrevContainer = (brev: AltinnBrev) => {
    const className = `tilskuddsbrev__${brev.status === Status.Lest ? 'lest' : 'ulest'}-lenke`;
    const dato = dateFormat.format(brev.datoSendt);
    return (
        <li className="tilskuddsbrev__liste-element" key={brev.key}>
            <BodyShort className="tilskuddsbrev__dato">Sendt {dato}</BodyShort>
            <NyFaneLenke
                className={className}
                href={brev.portalview}
                ariaLabel={`Sendt ${dato}, ${brev.status}, ${brev.tittel}`}
                onClick={loggNavigering(brev.portalview, 'åpn tilskuddsbrev i altinn')}
                loggLenketekst="åpne tilskuddsbrev i altinn"
            >
                {brev.tittel}
            </NyFaneLenke>
        </li>
    );
};

export default BrevFraAltinnContainer;
