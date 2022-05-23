import React, {useContext} from 'react';
import {Undertittel} from 'nav-frontend-typografi';
import {lenkeTilPermitteringOgMasseoppsigelsesSkjema, skjemaForArbeidsgiverURL} from '../../../lenker';
import './SkjemaveilederContainer.less';
import {HoyreChevron} from 'nav-frontend-chevron';
import {OrganisasjonsDetaljerContext} from '../../OrganisasjonDetaljerProvider';
import {LenkeMedLogging} from '../../../GeneriskeElementer/LenkeMedLogging';
import {LenkepanelMedLogging} from '../../../GeneriskeElementer/LenkepanelMedLogging';
import {altinnskjema, AltinnskjemaId} from "../../../altinn/tjenester";

export const SkjemaveilederContainer = () => {
    const {valgtOrganisasjon} = useContext(OrganisasjonsDetaljerContext);
    const tilgangInntektsmelding = valgtOrganisasjon?.altinntilgang?.inntektsmelding;
    if (valgtOrganisasjon === undefined) {
        return null
    }

    const altinnSkjemaLenke = (altinnSkjemaId: AltinnskjemaId) => {
        if (!valgtOrganisasjon.altinntilgang[altinnSkjemaId]) {
            return null;
        }
        const skjema = altinnskjema[altinnSkjemaId]
        return lenke(`${skjema.navn} (Altinn)`, skjema.skjemaUrl, "_blank")
    }

    const lenke = (tekst: string, href: string, target?: string) =>
        <li>
            <LenkepanelMedLogging tittelProps='element' href={href} loggLenketekst={tekst} target={target}>
                {tekst}
            </LenkepanelMedLogging>
        </li>;

    return (
        <div className='skjemaveileder-container'>
            <Undertittel id='skjemaveileder-tittel' className='skjemaveileder-tittel'>
                Søknader og skjemaer
            </Undertittel>

            <ul>
                {lenke(
                    'Fritak fra arbeidsgiverperioden - gravid ansatt',
                    'https://arbeidsgiver.nav.no/fritak-agp/nb/gravid/soknad',
                )}

                {lenke(
                    'Fritak fra arbeidsgiverperioden - kronisk sykdom',
                    'https://arbeidsgiver.nav.no/fritak-agp/nb/kronisk/soknad',
                )}

                {tilgangInntektsmelding === true ?
                    <>
                        {lenke(
                            'Refusjon av sykepenger i arbeidsgiverperioden - gravid ansatt',
                            'https://arbeidsgiver.nav.no/fritak-agp/nb/gravid/krav',
                        )}

                        {lenke(
                            'Refusjon av sykepenger i arbeidsgiverperioden - kronisk sykdom',
                            'https://arbeidsgiver.nav.no/fritak-agp/nb/kronisk/krav',
                        )}
                    </>
                    : null
                }

                {lenke(
                    'Varsle NAV om permitteringer, masseoppsigelser eller innskrenkninger i arbeidstiden',
                    lenkeTilPermitteringOgMasseoppsigelsesSkjema
                )}
                {altinnSkjemaLenke('inntektsmelding')}
                {altinnSkjemaLenke('mentortilskudd')}
                {altinnSkjemaLenke('inkluderingstilskudd')}
                {altinnSkjemaLenke('ekspertbistand')}
                {altinnSkjemaLenke('utsendtArbeidstakerEØS')}
            </ul>

            <LenkeMedLogging className={"link-med-logging"} href={skjemaForArbeidsgiverURL} loggLenketekst='Alle søknader og skjemaer hos NAV'>
                Alle søknader og skjemaer
                <HoyreChevron/>
            </LenkeMedLogging>
        </div>
    );
};
