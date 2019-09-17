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

    const SetStateFunksjonmedSkjemaNavn = (skjemaNavn: string, tilgang: boolean) => {
        switch (skjemaNavn) {
            case 'Mentortilskudd': {
                setTilMentortilskudd(tilgang);
                break;
            }
            case 'Inkluderingstilskudd': {
                setTilgangInkluderingstilskudd(tilgang);
                break;
            }
            case 'Ekspertbistand': {
                setTilgangEkspertbistand(tilgang);
                break;
            }
            case 'Lonnstilskudd': {
                setTilgangLonnstilskudd(tilgang);
                break;
            }
            case 'Inntektsmelding': {
                setTilgangInntektsmelding(tilgang);
            }
        }
    };
    useEffect(() => {
        seterFem('');
        const sjekkOgSettTilgang = (
            skjema: SkjemaMedOrganisasjonerMedTilgang,
            skjemaNavn: string,
            orgnrMedTilgang: string[]
        ): number => {
            if (orgnrMedTilgang.includes(valgtOrganisasjon.OrganizationNumber)) {
                SetStateFunksjonmedSkjemaNavn(skjemaNavn, true);
                return 1;
            }

            if (!orgnrMedTilgang.includes(valgtOrganisasjon.OrganizationNumber)) {
                SetStateFunksjonmedSkjemaNavn(skjemaNavn, false);
            }

            return 0;
        };

        const finnTilgang = () => {
            let tellTilganger: number = 0;
            listeMedSkjemaOgTilganger.forEach(skjema => {
                let orgnrMedTilgangTilSkjema: string[] = skjema.OrganisasjonerMedTilgang.map(
                    org => org.OrganizationNumber
                );
                tellTilganger += sjekkOgSettTilgang(
                    skjema,
                    skjema.Skjema.navn,
                    orgnrMedTilgangTilSkjema
                );
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
                <div className={'altinn-container__tekst'}>
                    <Undertittel>Søknader og skjemaer på Altinn</Undertittel>
                </div>
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
