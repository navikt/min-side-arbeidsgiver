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
import {
    AltinnSkjema,
    ListeMedAltinnSkjemaKoder,
    OrganisasjonsListeContext,
} from '../../../OrganisasjonsListeProvider';
import { SkjemaMedOrganisasjonerMedTilgang } from '../../../api/dnaApi';

const AltinnContainer: FunctionComponent = () => {
    const [typeAntall, settypeAntall] = useState('');

    const [erFem, seterFem] = useState('');
    const [tilgangInkluderingstilskudd, setTilgangInkluderingstilskudd] = useState(false);
    const [tilgangEkspertbistand, setTilgangEkspertbistand] = useState(false);
    const [tilgangMentortilskudd, setTilMentortilskudd] = useState(false);
    const [tilgangLonnstilskudd, setTilgangLonnstilskudd] = useState(false);
    const [tilgangInntektsmelding, setTilgangInntektsmelding] = useState(false);
    const [tilgangAlleSkjemaForOrganisasjon, setTilgangAlleSkjemaForOrganisasjon] = useState(
        ListeMedAltinnSkjemaKoder
    );

    const [generellAltinnTilgang, setgenerellAltinnTilgang] = useState(false);
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    const { listeMedSkjemaOgTilganger } = useContext(OrganisasjonsListeContext);

    useEffect(() => {
        console.log(listeMedSkjemaOgTilganger);
        const sjekkOmTilgangTilSkjemaForValgtOrganisasjon = (
            altinnSkjemaMedOrganisasjoner: SkjemaMedOrganisasjonerMedTilgang
        ) => {
            let kopiAvTilganger: AltinnSkjema[] = ListeMedAltinnSkjemaKoder;
            const indexTilAltinnSkjema: number = kopiAvTilganger.indexOf(
                altinnSkjemaMedOrganisasjoner.Skjema
            );
            let orgNrTilOrgMedTilgang: string[] = altinnSkjemaMedOrganisasjoner.OrganisasjonerMedTilgang.map(
                org => org.OrganizationNumber
            );
            if (orgNrTilOrgMedTilgang.includes(valgtOrganisasjon.OrganizationNumber)) {
                kopiAvTilganger[indexTilAltinnSkjema].tilstand = TilgangAltinn.TILGANG;
            } else {
                kopiAvTilganger[indexTilAltinnSkjema].tilstand = TilgangAltinn.IKKE_TILGANG;
            }
            setTilgangAlleSkjemaForOrganisasjon(kopiAvTilganger);
            console.log('kopi av lista: ', kopiAvTilganger);
        };

        listeMedSkjemaOgTilganger.forEach(skjemaMedOrganisasjoner => {
            if (listeMedSkjemaOgTilganger.length === 5) {
                sjekkOmTilgangTilSkjemaForValgtOrganisasjon(skjemaMedOrganisasjoner);
            }
        });
    }, [listeMedSkjemaOgTilganger, valgtOrganisasjon]);

    useEffect(() => {
        console.log(tilgangAlleSkjemaForOrganisasjon);
        const finnTilgang = () => {
            let tellTilganger: number = 0;
            tilgangAlleSkjemaForOrganisasjon.forEach(skjema => {
                if (skjema.navn === 'Mentortilskudd' && skjema.tilstand === TilgangAltinn.TILGANG) {
                    setTilMentortilskudd(true);
                    tellTilganger++;
                    console.log('in if');
                }
                if (
                    skjema.navn === 'Inkluderingstilskudd' &&
                    skjema.tilstand === TilgangAltinn.TILGANG
                ) {
                    setTilgangInkluderingstilskudd(true);
                    tellTilganger++;
                }
                if (skjema.navn === 'Ekspertbistand' && skjema.tilstand === TilgangAltinn.TILGANG) {
                    setTilgangEkspertbistand(true);
                    tellTilganger++;
                }
                if (skjema.navn === 'Lonnstilskudd' && skjema.tilstand === TilgangAltinn.TILGANG) {
                    setTilgangLonnstilskudd(true);
                    tellTilganger++;
                }
                if (
                    skjema.navn === 'Inntektsmelding' &&
                    skjema.tilstand === TilgangAltinn.TILGANG
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
        console.log('tilgang alle skjema for org', tilgangAlleSkjemaForOrganisasjon);
        finnTilgang();
    }, [tilgangAlleSkjemaForOrganisasjon]);

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

export default AltinnContainer;
