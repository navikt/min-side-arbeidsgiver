import React, { useContext } from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import { skjemaForArbeidsgiverURL } from '../../../lenker';
import './SkjemaveilederContainer.less';
import Lenke from 'nav-frontend-lenker';
import { HoyreChevron } from 'nav-frontend-chevron';
import Lenkepanel from 'nav-frontend-lenkepanel';
import { OrganisasjonsDetaljerContext } from '../../OrganisasjonDetaljerProvider';

export const SkjemaveilederContainer = () => {
    const {valgtOrganisasjon} = useContext(OrganisasjonsDetaljerContext);
    const tilgangInntektsmelding = valgtOrganisasjon?.altinntilgang?.inntektsmelding?.tilgang === 'ja';

    return (
        <div className="skjemaveileder-container">
            <Undertittel id="skjemaveileder-tittel" className="skjemaveileder-tittel">
                Søknader og skjemaer
            </Undertittel>

            <ul>
                <li>
                    <Lenkepanel tittelProps="element" href="https://arbeidsgiver.nav.no/fritak-agp/nb/gravid/soknad">
                        Fritak fra arbeidsgiverperioden - gravid ansatt
                    </Lenkepanel>
                </li>

                <li>
                    <Lenkepanel tittelProps="element" href="https://arbeidsgiver.nav.no/fritak-agp/nb/kronisk/soknad">
                        Fritak fra arbeidsgiverperioden - kronisk sykdom
                    </Lenkepanel>
                </li>

                { tilgangInntektsmelding ?
                    <>
                        <li>
                            <Lenkepanel tittelProps="element" href="https://arbeidsgiver.nav.no/fritak-agp/nb/gravid/krav">
                                Refusjon av sykepenger i arbeidsgiverperioden - gravid ansatt
                            </Lenkepanel>
                        </li>

                        <li>
                            <Lenkepanel tittelProps="element" href="https://arbeidsgiver.nav.no/fritak-agp/nb/kronisk/krav">
                                Refusjon av sykepenger i arbeidsgiverperioden - kronisk sykdom
                            </Lenkepanel>
                        </li>
                    </>
                    : null
                }
            </ul>


            <Lenke href={skjemaForArbeidsgiverURL}>
                Alle søknader og skjemaer
                <HoyreChevron />
            </Lenke>

        </div>
    );
};
