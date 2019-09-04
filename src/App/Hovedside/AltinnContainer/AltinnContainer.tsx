import React, { FunctionComponent, useContext, useEffect, useState } from 'react';

import { OrganisasjonsDetaljerContext, TilgangAltinn } from '../../../OrganisasjonDetaljerProvider';

import './AltinnContainer.less';
import { Undertittel } from 'nav-frontend-typografi';

import {
    inntekstmelding,
    soknadskjemaInkluderingstilskudd,
    soknadsskjemaLonnstilskudd,
    soknadTilskuddTilMentor,
} from '../../../lenker';
import AltinnLenke from './AltinnLenke/AltinnLenke';

export const AltinnContainer: FunctionComponent = () => {
    const [typeAntall, settypeAntall] = useState('');
    const [generellAltinnTilgang, setgenerellAltinnTilgang] = useState(false);
    const { tilgangTilAltinnForInntektsmelding, tilgangTilAltinnForTreSkjemaState } = useContext(
        OrganisasjonsDetaljerContext
    );

    useEffect(() => {
        setgenerellAltinnTilgang(true);
        if (
            tilgangTilAltinnForInntektsmelding === TilgangAltinn.TILGANG &&
            tilgangTilAltinnForTreSkjemaState === TilgangAltinn.TILGANG
        ) {
            settypeAntall('antall-skjema-partall');
        } else if (
            tilgangTilAltinnForInntektsmelding === TilgangAltinn.TILGANG &&
            tilgangTilAltinnForTreSkjemaState === TilgangAltinn.IKKE_TILGANG
        ) {
            settypeAntall('antall-skjema-en');
        } else if (
            tilgangTilAltinnForInntektsmelding === TilgangAltinn.IKKE_TILGANG &&
            tilgangTilAltinnForTreSkjemaState === TilgangAltinn.TILGANG
        ) {
            settypeAntall('antall-skjema-tre');
        } else {
            setgenerellAltinnTilgang(false);
        }
    }, [tilgangTilAltinnForTreSkjemaState, tilgangTilAltinnForInntektsmelding]);

    return (
        <div className={'altinn-container'}>
            {generellAltinnTilgang && (
                <Undertittel className={'altinn-container__tekst'}>Skjema på Altinn</Undertittel>
            )}
            <div className={'altinn-container__bokser'}>
                {tilgangTilAltinnForTreSkjemaState === TilgangAltinn.TILGANG && (
                    <AltinnLenke
                        className={'altinn-container__' + typeAntall + ' altinn-container__lenke'}
                        href={soknadskjemaInkluderingstilskudd()}
                        tekst={'Søk om inkluderingstilskudd'}
                    />
                )}
                {tilgangTilAltinnForTreSkjemaState === TilgangAltinn.TILGANG && (
                    <AltinnLenke
                        className={'altinn-container__' + typeAntall + ' altinn-container__lenke'}
                        href={soknadsskjemaLonnstilskudd()}
                        tekst={'Søk om lønnstilskudd'}
                    />
                )}
                {tilgangTilAltinnForTreSkjemaState === TilgangAltinn.TILGANG && (
                    <AltinnLenke
                        className={'altinn-container__' + typeAntall + ' altinn-container__lenke'}
                        href={soknadTilskuddTilMentor()}
                        tekst={'Søk om tilskudd til mentor'}
                    />
                )}

                {tilgangTilAltinnForInntektsmelding === TilgangAltinn.TILGANG && (
                    <AltinnLenke
                        className={'altinn-container__' + typeAntall + ' altinn-container__lenke'}
                        href={inntekstmelding}
                        tekst={'Inntektsmelding'}
                    />
                )}
            </div>
        </div>
    );
};
