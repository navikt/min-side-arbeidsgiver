import React, { useContext } from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import { OrganisasjonsDetaljerContext } from '../../OrganisasjonDetaljerProvider';
import { AltinnBrev, Status } from '../../../api/altinnApi';
import { AltinntjenesteId } from '../../../altinn/tjenester';
import NyFaneLenke from '../../../GeneriskeElementer/NyFaneLenke';
import AntallUlest from '../../../GeneriskeElementer/AntallUlest';
import Innboksikon from './Innboksikon';
import { loggTjenesteTrykketPa } from '../../../utils/funksjonerForAmplitudeLogging';
import './BrevFraAltinnContainer.less';

const tjenesteNavn: AltinntjenesteId = 'tilskuddsbrev';

const loggNavigering = (href: string, knapp: string) => () => {
    if (href === '') {
        loggTjenesteTrykketPa(tjenesteNavn, '', knapp);
    } else {
        const {origin, pathname} = new URL(href)
        const url = `${origin}${pathname.replace(/\d/g, 'X')}`
        loggTjenesteTrykketPa(tjenesteNavn, url, knapp);
    }
}

const BrevFraAltinnContainer: React.FunctionComponent = _ => {
    const { altinnMeldingsboks } = useContext(OrganisasjonsDetaljerContext);

    if (altinnMeldingsboks === undefined || altinnMeldingsboks.brev.length === 0) {
        return null;
    }

    const inboksTittel = (
        <Undertittel className="tilskuddsbrev__tittel">
            <div className="tilskuddsbrev__inboxikon">
                <Innboksikon />
                <AntallUlest antallUlest={altinnMeldingsboks.antallUleste} />
            </div>
            <span>Tilskuddsbrev om NAV-tiltak fra Altinn innboks</span>
        </Undertittel>
    );

    return (
        <section className="tilskuddsbrev">
            <Ekspanderbartpanel
                tittel={inboksTittel}
                onClick={loggNavigering('', 'ekspander panel')}
            >
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
            <Normaltekst className="tilskuddsbrev__dato">Sendt {dato}</Normaltekst>
            <NyFaneLenke
                className={className}
                href={brev.portalview}
                ariaLabel={`Sendt ${dato}, ${brev.status}, ${brev.tittel}`}
                onClick={loggNavigering(brev.portalview, 'åpn tilskuddsbrev i altinn')}
            >
                {brev.tittel}
            </NyFaneLenke>
        </li>
    );
};

export default BrevFraAltinnContainer;
