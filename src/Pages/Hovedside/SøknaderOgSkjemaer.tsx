import React, { useContext } from 'react';
import {
    lenkeTilPermitteringOgMasseoppsigelsesSkjema,
    opprettInntektsmeldingURL,
    skjemaForArbeidsgiverURL,
} from '../../lenker';
import './SøknaderOgSkjemaer.css';
import { OrganisasjonsDetaljerContext } from '../OrganisasjonDetaljerProvider';
import { LenkeMedLogging } from '../../GeneriskeElementer/LenkeMedLogging';
import {
    InternalLenkepanelMedLogging,
    LenkepanelMedLogging,
} from '../../GeneriskeElementer/LenkepanelMedLogging';
import { altinnskjema, AltinnskjemaId, altinntjeneste } from '../../altinn/tjenester';
import { HoyreChevron } from '../../GeneriskeElementer/HoyreChevron';
import { Heading } from '@navikt/ds-react';
import { gittMiljo } from '../../utils/environment';
import { Link } from 'react-router-dom';

export const SøknaderOgSkjemaer = () => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    const tilgangInntektsmelding = valgtOrganisasjon?.altinntilgang?.inntektsmelding;
    const tilgangYrkesskade = valgtOrganisasjon?.altinntilgang?.yrkesskade;
    if (valgtOrganisasjon === undefined) {
        return null;
    }

    const altinnSkjemaLenke = (altinnSkjemaId: AltinnskjemaId) => {
        if (!valgtOrganisasjon.altinntilgang[altinnSkjemaId]) {
            return null;
        }
        const skjema = altinnskjema[altinnSkjemaId];
        return lenke(`${skjema.navn} (Altinn)`, skjema.skjemaUrl, '_blank');
    };

    const lenke = (tekst: string, href: string, target?: string) => (
        <li>
            <LenkepanelMedLogging href={href} loggLenketekst={tekst} target={target}>
                {tekst}
            </LenkepanelMedLogging>
        </li>
    );

    return (
        <div className="skjemaveileder-container">
            <Heading
                size="small"
                level="2"
                id="skjemaveileder-tittel"
                className="skjemaveileder-tittel"
            >
                Søknader og skjemaer
            </Heading>

            <ul>
                {lenke(
                    'Søknad om fritak fra arbeidsgiverperioden - gravid ansatt',
                    gittMiljo({
                        prod: 'https://arbeidsgiver.nav.no/fritak-agp/nb/gravid/soknad',
                        other: 'https://arbeidsgiver.intern.dev.nav.no/fritak-agp/nb/gravid/soknad',
                    })
                )}

                {lenke(
                    'Søknad om fritak fra arbeidsgiverperioden - kronisk sykdom',
                    gittMiljo({
                        prod: 'https://arbeidsgiver.nav.no/fritak-agp/nb/kronisk/soknad',
                        other: 'https://arbeidsgiver.intern.dev.nav.no/fritak-agp/nb/kronisk/soknad',
                    })
                )}

                {tilgangInntektsmelding === true ? (
                    <>
                        {lenke(
                            'Refusjonskrav sykepenger i arbeidsgiverperioden - gravid ansatt',
                            gittMiljo({
                                prod: 'https://arbeidsgiver.nav.no/fritak-agp/nb/gravid/krav',
                                other: 'https://arbeidsgiver.intern.dev.nav.no/fritak-agp/nb/gravid/krav',
                            })
                        )}

                        {lenke(
                            'Refusjonskrav sykepenger i arbeidsgiverperioden - kronisk sykdom',
                            gittMiljo({
                                prod: 'https://arbeidsgiver.nav.no/fritak-agp/nb/kronisk/krav',
                                other: 'https://arbeidsgiver.intern.dev.nav.no/fritak-agp/nb/kronisk/krav',
                            })
                        )}
                    </>
                ) : null}

                {valgtOrganisasjon.reporteetilgang
                    ? lenke(
                          'Varsle NAV om permitteringer, masseoppsigelser eller innskrenkninger i arbeidstiden',
                          lenkeTilPermitteringOgMasseoppsigelsesSkjema
                      )
                    : null}
                {tilgangYrkesskade === true
                    ? lenke(
                          altinntjeneste.yrkesskade.navn,
                          gittMiljo({
                              prod: `https://skademelding.nav.no/yrkesskade/?bedrift=${valgtOrganisasjon.organisasjon.OrganizationNumber}`,
                              other: `https://skademelding.intern.dev.nav.no/yrkesskade/?bedrift=${valgtOrganisasjon.organisasjon.OrganizationNumber}`,
                          })
                      )
                    : null}
                {tilgangInntektsmelding === true ? (
                    <InternalLenkepanelMedLogging
                        loggLenketekst={'Inntektsmelding sykepenger (Opprett manuelt)'}
                        to={'/saksoversikt'}
                    >
                        Inntektsmelding sykepenger
                    </InternalLenkepanelMedLogging>
                ) : null}
                {altinnSkjemaLenke('inntektsmelding')}
                {altinnSkjemaLenke('ekspertbistand')}
                {altinnSkjemaLenke('utsendtArbeidstakerEØS')}
            </ul>
            <div>
                <LenkeMedLogging
                    href={skjemaForArbeidsgiverURL}
                    loggLenketekst="Alle søknader og skjemaer hos NAV"
                >
                    Alle søknader og skjemaer
                    <HoyreChevron />
                </LenkeMedLogging>
            </div>
        </div>
    );
};
