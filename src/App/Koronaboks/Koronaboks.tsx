import React, { useContext, useEffect, useState } from 'react';
import Innholdsboks from '../Hovedside/Innholdsboks/Innholdsboks';
import Element from 'nav-frontend-typografi/lib/element';
import Lenke from 'nav-frontend-lenker';
import HoyreChevron from 'nav-frontend-chevron/lib/hoyre-chevron';
import sirkel from './report-problem-circle.svg';
import {
    LenkeTilKoronaRefusjon,
    lenkeTilPermitteringOgMasseoppsigelsesSkjema,
    lenkeTilLonnskompensasjonRefusjonSkjema,
    lenkeTilKlageskjema
} from '../../lenker';
import { Undertittel } from 'nav-frontend-typografi';
import { OrganisasjonsDetaljerContext } from '../../OrganisasjonDetaljerProvider';
import { OrganisasjonsListeContext } from '../../OrganisasjonsListeProvider';
import { SkjemaMedOrganisasjonerMedTilgang } from '../../api/dnaApi';
import './Koronaboks.less';

export const Koronaboks = () => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    const { listeMedSkjemaOgTilganger } = useContext(OrganisasjonsListeContext);
    const [tilgangRefusjon, setTilgangRefusjon] = useState(false);

    const SetStateFunksjonmedSkjemaNavn = (skjemaNavn: string, tilgang: boolean) => {
        if (skjemaNavn === 'Inntektsmelding') {
            setTilgangRefusjon(tilgang);
        }
    };

    useEffect(() => {
        const sjekkOgSettTilgang = (
            skjema: SkjemaMedOrganisasjonerMedTilgang,
            skjemaNavn: string,
            orgnrMedTilgang: string[]
        ): number => {
            if (
                orgnrMedTilgang.includes(valgtOrganisasjon.OrganizationNumber) &&
                skjema.Skjema.navn !== 'Tiltaksgjennomforing'
            ) {
                SetStateFunksjonmedSkjemaNavn(skjemaNavn, true);
                return 1;
            }
            if (!orgnrMedTilgang.includes(valgtOrganisasjon.OrganizationNumber)) {
                SetStateFunksjonmedSkjemaNavn(skjemaNavn, false);
            }
            return 0;
        };

        const finnTilgang = () => {
            listeMedSkjemaOgTilganger.forEach(skjema => {
                let orgnrMedTilgangTilSkjema: string[] = skjema.OrganisasjonerMedTilgang.map(
                    org => org.OrganizationNumber
                );
                sjekkOgSettTilgang(skjema, skjema.Skjema.navn, orgnrMedTilgangTilSkjema);
            });
        };
        if (listeMedSkjemaOgTilganger.length === 6) {
            finnTilgang();
        }
        finnTilgang();
    }, [valgtOrganisasjon, listeMedSkjemaOgTilganger]);

    return (
        <div className="koronaboks">
            <Innholdsboks classname="koronaboks__innhold">
                <img className="koronaboks__ikon" alt="" src={sirkel} />
                <Undertittel>Koronarelaterte tjenester</Undertittel>

                <Element className="koronaboks__tekst">Permittering</Element>

                <Lenke
                    className="koronaboks__lenke"
                    href={lenkeTilPermitteringOgMasseoppsigelsesSkjema()}
                >
                    <span>
                        Varsle NAV om permitteringer, masseoppsigelser, permitteringer eller
                        innskrenkninger i arbeidstiden
                    </span>
                    <HoyreChevron />
                </Lenke>

                {tilgangRefusjon && (
                    <>
                        <Lenke
                            className="koronaboks__lenke"
                            href={lenkeTilLonnskompensasjonRefusjonSkjema()}
                        >
                            <span>Arbeidsgivers innmelding for lønnskompensasjon og refusjon</span>
                            <HoyreChevron />
                        </Lenke>
                        <Lenke
                            className="koronaboks__lenke"
                            href={lenkeTilKlageskjema(valgtOrganisasjon.OrganizationNumber)}
                        >
                            <span>Endring av opplysninger/klage på vedtak for refusjon av lønn ved permittering</span>
                            <HoyreChevron />
                        </Lenke>

                        <Element className="koronaboks__tekst">Refusjon sykepenger</Element>
                        <Lenke className="koronaboks__lenke" href={LenkeTilKoronaRefusjon()}>
                            <span>Søk om refusjon av sykepenger relatert til koronavirus</span>
                            <HoyreChevron />
                        </Lenke>
                    </>
                )}
            </Innholdsboks>
        </div>
    );
};
