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
import { Organisasjon } from '../../../Objekter/Organisasjoner/OrganisasjonerFraAltinn';

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
    const [tilgangEkspertBistand, setTilgangEkspertbistand] = useState(false);
    const [tilgangLønnsTilskudd, setTilgangLønnsTilskudd] = useState(false);
    const [tilgangMentortilskudd, setTilgangMentortilskudd] = useState(false);
    const [tilgangInntektsMelding, setilgangInntektsMelding] = useState(false);

    const [generellAltinnTilgang, setgenerellAltinnTilgang] = useState(false);
    const { tilgangTilAltinnForInntektsmelding, valgtOrganisasjon } = useContext(
        OrganisasjonsDetaljerContext
    );
    const { listeMedSkjemaOgTilganger, setLasteStatusPaSkjema } = useContext(
        OrganisasjonsListeContext
    );

    const sjekkOmSkjemaErHentetOgReturnerIndex = (
        skjema: SkjemaMedOrganisasjonerMedTilgang,
        listeMedAlleSkjema: SkjemaMedOrganisasjonerMedTilgang[]
    ): number => {
        return listeMedAlleSkjema.indexOf(skjema);
    };

    const sjekkOmTilgangTilSkjemaForValgtOrganisasjon = (
        org: Organisasjon,
        skjema: SkjemaMedOrganisasjonerMedTilgang,
        index: number
    ) => {
        let kopiAvTilganger: AltinnSkjema[] = tilgangAlleSkjemaForOrganisasjon;
        if (skjema.OrganisasjonerMedTilgang.includes(org)) {
            kopiAvTilganger[index].tilstand = TilgangAltinn.TILGANG;
        } else {
            kopiAvTilganger[index].tilstand = TilgangAltinn.IKKE_TILGANG;
        }
        setTilgangAlleSkjemaForOrganisasjon(kopiAvTilganger);
    };

    useEffect(() => {
        setgenerellAltinnTilgang(true);
        const tellAntallSkjema = () => {
            let antallTilganger: number = 0;
            if (tilgangTilAltinnForInntektsmelding === TilgangAltinn.TILGANG) {
                antallTilganger++;
            }
            if (tilgangTilAltinnForFireSkjemaState === TilgangAltinn.TILGANG) {
                antallTilganger += 4;
            }
            if (antallTilganger % 2 === 0) {
                settypeAntall('antall-skjema-partall');
            }
            if (antallTilganger % 2 !== 0 && antallTilganger !== 1) {
                settypeAntall('antall-skjema-oddetall');
            }
            if (antallTilganger === 1) {
                settypeAntall('antall-skjema-en');
            }
            if (antallTilganger === 5) {
                seterFem('fem');
            }
            if (antallTilganger > 0) {
                setgenerellAltinnTilgang(true);
            }
        };
        tellAntallSkjema();
    }, [tilgangTilAltinnForFireSkjemaState, tilgangTilAltinnForInntektsmelding]);

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
