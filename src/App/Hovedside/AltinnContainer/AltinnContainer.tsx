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
        console.log(listeMedSkjemaOgTilganger);
        const finnTilgang = () => {
            let tellTilganger: number = 0;
            listeMedSkjemaOgTilganger.forEach(skjema => {
                let orgnrMedTilgang: string[] = skjema.OrganisasjonerMedTilgang.map(
                    org => org.OrganizationNumber
                );
                console.log(orgnrMedTilgang);
                if (
                    skjema.Skjema.navn === 'Mentortilskudd' &&
                    orgnrMedTilgang.includes(valgtOrganisasjon.OrganizationNumber)
                ) {
                    setTilMentortilskudd(true);
                    tellTilganger++;
                    console.log('in if');
                }
                if (
                    skjema.Skjema.navn === 'Inkluderingstilskudd' &&
                    orgnrMedTilgang.includes(valgtOrganisasjon.OrganizationNumber)
                ) {
                    setTilgangInkluderingstilskudd(true);
                    tellTilganger++;
                }
                if (
                    skjema.Skjema.navn === 'Ekspertbistand' &&
                    orgnrMedTilgang.includes(valgtOrganisasjon.OrganizationNumber)
                ) {
                    setTilgangEkspertbistand(true);
                    tellTilganger++;
                }
                if (
                    skjema.Skjema.navn === 'Lonnstilskudd' &&
                    orgnrMedTilgang.includes(valgtOrganisasjon.OrganizationNumber)
                ) {
                    setTilgangLonnstilskudd(true);
                    tellTilganger++;
                }
                if (
                    skjema.Skjema.navn === 'Inntektsmelding' &&
                    orgnrMedTilgang.includes(valgtOrganisasjon.OrganizationNumber)
                ) {
                    setTilgangInntektsmelding(true);
                    tellTilganger++;
                }
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
            console.log(listeMedSkjemaOgTilganger);
        }

        finnTilgang();
    }, [valgtOrganisasjon, listeMedSkjemaOgTilganger]);

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
