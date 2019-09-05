import React, { FunctionComponent, useContext, useEffect, useState } from 'react';

import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';

import './AltinnContainer.less';
import { Undertittel } from 'nav-frontend-typografi';

import {
    inntekstmelding,
    soknadskjemaInkluderingstilskudd,
    soknadsskjemaLonnstilskudd,
    soknadTilskuddTilMentor,
} from '../../../lenker';
import AltinnLenke from './AltinnLenke/AltinnLenke';
import { OrganisasjonsListeContext } from '../../../OrganisasjonsListeProvider';
import { SkjemaMedOrganisasjonerMedTilgang } from '../../../api/dnaApi';

export const AltinnContainer: FunctionComponent = () => {
    const [typeAntall, settypeAntall] = useState('');

    const [erFem, seterFem] = useState('');
    const [tilgangInkluderingstilskudd, setTilgangInkluderingstilskudd] = useState(false);
    const [tilgangEkspertbistand, setTilgangEkspertbistand] = useState(false);
    const [tilgangMentortilskudd, setTilMentortilskudd] = useState(false);
    const [tilgangLonnstilskudd, setTilgangLonnstilskudd] = useState(false);
    const [tilgangInntektsmelding, setTilgangInntektsmelding] = useState(false);

    const [generellAltinnTilgang, setgenerellAltinnTilgang] = useState(false);
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    const { listeMedSkjemaOgTilganger } = useContext(OrganisasjonsListeContext);

    useEffect(() => {
        seterFem('');
        console.log('lengde ', listeMedSkjemaOgTilganger.length);
        const sjekkOgSettTilgang = (
            skjema: SkjemaMedOrganisasjonerMedTilgang,
            skjemaNavn: string,
            setTilgangFunksjon: (tilgang: boolean) => void,
            orgnrMedTilgang: string[]
        ): number => {
            if (
                skjema.Skjema.navn === skjemaNavn &&
                orgnrMedTilgang.includes(valgtOrganisasjon.OrganizationNumber)
            ) {
                setTilgangFunksjon(true);
                console.log('in if');
                return 1;
            }

            if (
                skjema.Skjema.navn === skjemaNavn &&
                !orgnrMedTilgang.includes(valgtOrganisasjon.OrganizationNumber)
            ) {
                setTilgangFunksjon(false);
            }

            return 0;
        };

        const finnTilgang = () => {
            console.log('finn tilgang kallt');
            console.log('valg Organisasjon er: ', valgtOrganisasjon);
            console.log(
                'lista med alle tilganger og organisasjone er:',
                JSON.stringify(listeMedSkjemaOgTilganger),
                'med lengde: ',
                listeMedSkjemaOgTilganger.length
            );
            let tellTilganger: number = 0;
            listeMedSkjemaOgTilganger.forEach(skjema => {
                let orgnrMedTilgangTilSkjema: string[] = skjema.OrganisasjonerMedTilgang.map(
                    org => org.OrganizationNumber
                );
                console.log(
                    'skjema i foreach er: ',
                    skjema.Skjema.navn,
                    ' disse organisasjonene har tilgang: ',
                    skjema.OrganisasjonerMedTilgang
                );
                tellTilganger =
                    tellTilganger +
                    sjekkOgSettTilgang(
                        skjema,
                        'Mentortilskudd',
                        setTilMentortilskudd,
                        orgnrMedTilgangTilSkjema
                    );
                tellTilganger =
                    tellTilganger +
                    sjekkOgSettTilgang(
                        skjema,
                        'Inkluderingstilskudd',
                        setTilgangInkluderingstilskudd,
                        orgnrMedTilgangTilSkjema
                    );
                tellTilganger =
                    tellTilganger +
                    sjekkOgSettTilgang(
                        skjema,
                        'Ekspertbistand',
                        setTilgangEkspertbistand,
                        orgnrMedTilgangTilSkjema
                    );
                tellTilganger =
                    tellTilganger +
                    sjekkOgSettTilgang(
                        skjema,
                        'Lonnstilskudd',
                        setTilgangLonnstilskudd,
                        orgnrMedTilgangTilSkjema
                    );
                tellTilganger =
                    tellTilganger +
                    sjekkOgSettTilgang(
                        skjema,
                        'Inntektsmelding',
                        setTilgangInntektsmelding,
                        orgnrMedTilgangTilSkjema
                    );
                console.log('tell tilganger', tellTilganger);
                if (tellTilganger % 2 === 0) {
                    settypeAntall('antall-skjema-partall');
                }
                if (tellTilganger % 2 !== 0) {
                    settypeAntall('antall-skjema-oddetall');
                    if (tellTilganger === 5) {
                        seterFem('fem');
                    }
                }
                if (tellTilganger === 1) {
                    settypeAntall('antall-skjema-en');
                }
                console.log('tell tilganger', tellTilganger);
                console.log('typetall ', typeAntall);
                if (tellTilganger > 0) {
                    setgenerellAltinnTilgang(true);
                }
            });
        };
        if (listeMedSkjemaOgTilganger.length === 5) {
            finnTilgang();
        }

        finnTilgang();
    }, [valgtOrganisasjon, listeMedSkjemaOgTilganger, typeAntall]);

    return (
        <div className={'altinn-container'}>
            {generellAltinnTilgang && (
                <Undertittel className={'altinn-container__tekst'}>Skjema på Altinn</Undertittel>
            )}
            <div className={'altinn-container__bokser' + erFem}>
                {tilgangInkluderingstilskudd && (
                    <AltinnLenke
                        className={'altinn-container__' + typeAntall + erFem}
                        href={soknadskjemaInkluderingstilskudd()}
                        tekst={'Inkluderingstilskudd'}
                    />
                )}
                {tilgangLonnstilskudd && (
                    <AltinnLenke
                        className={'altinn-container__' + typeAntall + erFem}
                        href={soknadsskjemaLonnstilskudd()}
                        tekst={'Lønnstilskudd'}
                    />
                )}
                {tilgangMentortilskudd && (
                    <AltinnLenke
                        className={'altinn-container__' + typeAntall + erFem + erFem}
                        href={soknadTilskuddTilMentor()}
                        tekst={'Tilskudd til mentor'}
                    />
                )}
                {tilgangEkspertbistand && (
                    <AltinnLenke
                        className={'altinn-container__' + typeAntall + erFem}
                        href={inntekstmelding}
                        tekst={'Tilskudd til ekspertbistand'}
                    />
                )}

                {tilgangInntektsmelding && (
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
