import React, { useContext } from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import { skjemaForArbeidsgiverURL } from '../../../lenker';
import './SkjemaveilederContainer.less';
import { HoyreChevron } from 'nav-frontend-chevron';
import { OrganisasjonsDetaljerContext } from '../../OrganisasjonDetaljerProvider';
import { LenkeMedLogging } from '../../../GeneriskeElementer/LenkeMedLogging';
import { LenkepanelMedLogging } from '../../../GeneriskeElementer/LenkepanelMedLogging';

export const SkjemaveilederContainer = () => {
    const {valgtOrganisasjon} = useContext(OrganisasjonsDetaljerContext);
    const tilgangInntektsmelding = valgtOrganisasjon?.altinntilgang?.inntektsmelding?.tilgang === 'ja';

    const lenke = (tekst: string, href: string) =>
        <li>
            <LenkepanelMedLogging tittelProps="element" href={href} loggLenketekst={tekst}>
                {tekst}
            </LenkepanelMedLogging>
        </li>;

    return (
        <div className="skjemaveileder-container">
            <Undertittel id="skjemaveileder-tittel" className="skjemaveileder-tittel">
                Søknader og skjemaer
            </Undertittel>

            <ul>
                {lenke(
                    "Fritak fra arbeidsgiverperioden - gravid ansatt",
                    "https://arbeidsgiver.nav.no/fritak-agp/nb/gravid/soknad"
                )}

                {lenke(
                    "Fritak fra arbeidsgiverperioden - kronisk sykdom",
                    "https://arbeidsgiver.nav.no/fritak-agp/nb/kronisk/soknad"
                )}

                { tilgangInntektsmelding ?
                    <>
                    {lenke(
                        "Refusjon av sykepenger i arbeidsgiverperioden - gravid ansatt",
                        "https://arbeidsgiver.nav.no/fritak-agp/nb/gravid/krav"
                    )}

                    {lenke(
                        "Refusjon av sykepenger i arbeidsgiverperioden - kronisk sykdom",
                        "https://arbeidsgiver.nav.no/fritak-agp/nb/kronisk/krav"
                    )}
                    </>
                    : null
                }
            </ul>


            <LenkeMedLogging href={skjemaForArbeidsgiverURL} loggLenketekst="Alle søknader og skjemaer hos NAV">
                Alle søknader og skjemaer
                <HoyreChevron />
            </LenkeMedLogging>
        </div>
    );
};
