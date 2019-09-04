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
import { AltinnSkjema, OrganisasjonsListeContext } from '../../../OrganisasjonsListeProvider';
import { SkjemaMedOrganisasjonerMedTilgang } from '../../../api/dnaApi';

export const ListeMedAltinnSkjemaKoder: AltinnSkjema[] = [
    {
        navn: 'Ekspertbistand',
        kode: '5384',
        tilstand: TilgangAltinn.LASTER,
    },
    {
        navn: 'InkluderingsTilskudd',
        kode: '5212',
        tilstand: TilgangAltinn.LASTER,
    },
    {
        navn: 'Lønnstilskudd',
        kode: '5159',
        tilstand: TilgangAltinn.LASTER,
    },
    {
        navn: 'Mentortilskudd',
        kode: '5216',
        tilstand: TilgangAltinn.LASTER,
    },
    {
        navn: 'Inntektsmelding',
        kode: '4936',
        tilstand: TilgangAltinn.LASTER,
    },
];

const AltinnContainer: FunctionComponent = () => {
    const [typeAntall, settypeAntall] = useState('');

    const [erFem, seterFem] = useState('');
    const [tilgangInkluderingstilskudd, setTilgangInkluderingstilskudd] = useState(
        TilgangAltinn.LASTER
    );
    const [tilgangAlleSkjemaForOrganisasjon, setTilgangAlleSkjemaForOrganisasjon] = useState(
        ListeMedAltinnSkjemaKoder
    );

    const [generellAltinnTilgang, setgenerellAltinnTilgang] = useState(false);
    const { tilgangTilAltinnForInntektsmelding, valgtOrganisasjon } = useContext(
        OrganisasjonsDetaljerContext
    );
    const { listeMedSkjemaOgTilganger } = useContext(OrganisasjonsListeContext);

    useEffect(() => {
        const sjekkOmTilgangTilSkjemaForValgtOrganisasjon = (
            altinnSkjemaMedOrganisasjoner: SkjemaMedOrganisasjonerMedTilgang
        ) => {
            let kopiAvTilganger: AltinnSkjema[] = ListeMedAltinnSkjemaKoder;
            const indexTilAltinnSkjema: number = kopiAvTilganger.indexOf(
                altinnSkjemaMedOrganisasjoner.Skjema
            );
            if (
                altinnSkjemaMedOrganisasjoner.OrganisasjonerMedTilgang.includes(valgtOrganisasjon)
            ) {
                kopiAvTilganger[indexTilAltinnSkjema].tilstand === TilgangAltinn.TILGANG;
            } else {
                kopiAvTilganger[indexTilAltinnSkjema].tilstand === TilgangAltinn.IKKE_TILGANG;
            }
            setTilgangAlleSkjemaForOrganisasjon(kopiAvTilganger);
        };

        listeMedSkjemaOgTilganger.forEach(skjemaMedOrganisasjoner => {
            sjekkOmTilgangTilSkjemaForValgtOrganisasjon(skjemaMedOrganisasjoner);
        });
    }, [listeMedSkjemaOgTilganger]);

    useEffect(() => {

    },

    return (
        <div className={'altinn-container'}>
            {generellAltinnTilgang && (
                <Undertittel className={'altinn-container__tekst'}>Skjema på Altinn</Undertittel>
            )}
            <div className={'altinn-container__bokser' + erFem}>
                {tilgangTilAltinnForFireSkjemaState === TilgangAltinn.TILGANG && (
                    <AltinnLenke
                        className={'altinn-container__' + typeAntall + erFem}
                        href={soknadskjemaInkluderingstilskudd()}
                        tekst={'Inkluderingstilskudd'}
                    />
                )}
                {tilgangTilAltinnForFireSkjemaState === TilgangAltinn.TILGANG && (
                    <AltinnLenke
                        className={'altinn-container__' + typeAntall + erFem}
                        href={soknadsskjemaLonnstilskudd()}
                        tekst={'Lønnstilskudd'}
                    />
                )}
                {tilgangTilAltinnForFireSkjemaState === TilgangAltinn.TILGANG && (
                    <AltinnLenke
                        className={'altinn-container__' + typeAntall + erFem + erFem}
                        href={soknadTilskuddTilMentor()}
                        tekst={'Tilskudd til mentor'}
                    />
                )}
                {tilgangTilAltinnForFireSkjemaState === TilgangAltinn.TILGANG && (
                    <AltinnLenke
                        className={'altinn-container__' + typeAntall + erFem}
                        href={inntekstmelding}
                        tekst={'Tilskudd til ekspertbistand'}
                    />
                )}

                {tilgangTilAltinnForInntektsmelding === TilgangAltinn.TILGANG && (
                    <AltinnLenke
                        className={'altinn-container__' + typeAntall + erFem}
                        href={inntekstmelding}
                        tekst={'Inntektsmelding'}
                    />
                )}
            </div>
        </div>
    );
};

export default AltinnContainer;
