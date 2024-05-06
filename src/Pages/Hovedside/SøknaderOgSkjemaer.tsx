import React, { useContext } from 'react';
import {
    lenkeTilPermitteringOgMasseoppsigelsesSkjema,
    opprettInntektsmeldingURL,
    skjemaForArbeidsgiverURL,
} from '../../lenker';
import './SøknaderOgSkjemaer.css';
import { OrganisasjonsDetaljerContext } from '../OrganisasjonDetaljerProvider';
import { LenkeMedLogging } from '../../GeneriskeElementer/LenkeMedLogging';
import { LenkepanelMedLogging } from '../../GeneriskeElementer/LenkepanelMedLogging';
import { altinnskjema, AltinnskjemaId, altinntjeneste } from '../../altinn/tjenester';
import { HoyreChevron } from '../../GeneriskeElementer/HoyreChevron';
import { Heading } from '@navikt/ds-react';
import { gittMiljo } from '../../utils/environment';

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
                    'Fritak fra arbeidsgiverperioden - gravid ansatt',
                    gittMiljo({
                        prod: 'https://arbeidsgiver.nav.no/fritak-agp/nb/gravid/soknad',
                        other: 'https://arbeidsgiver.intern.dev.nav.no/fritak-agp/nb/gravid/soknad',
                    })
                )}

                {lenke(
                    'Fritak fra arbeidsgiverperioden - kronisk sykdom',
                    gittMiljo({
                        prod: 'https://arbeidsgiver.nav.no/fritak-agp/nb/kronisk/soknad',
                        other: 'https://arbeidsgiver.intern.dev.nav.no/fritak-agp/nb/kronisk/soknad',
                    })
                )}

                {tilgangInntektsmelding === true ? (
                    <>
                        {lenke(
                            'Refusjon av sykepenger i arbeidsgiverperioden - gravid ansatt',
                            gittMiljo({
                                prod: 'https://arbeidsgiver.nav.no/fritak-agp/nb/gravid/krav',
                                other: 'https://arbeidsgiver.intern.dev.nav.no/fritak-agp/nb/gravid/krav',
                            })
                        )}

                        {lenke(
                            'Refusjon av sykepenger i arbeidsgiverperioden - kronisk sykdom',
                            gittMiljo({
                                prod: 'https://arbeidsgiver.nav.no/fritak-agp/nb/kronisk/krav',
                                other: 'https://arbeidsgiver.intern.dev.nav.no/fritak-agp/nb/kronisk/krav',
                            })
                        )}
                        {gittMiljo({
                            prod: null,
                            other: lenke(
                                'Inntektsmelding sykepenger (Opprett manuelt)',
                                opprettInntektsmeldingURL
                            ),
                        })}
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
