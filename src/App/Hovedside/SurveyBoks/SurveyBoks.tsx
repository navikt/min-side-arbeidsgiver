import React, { FunctionComponent } from 'react';
import './SurveBoks.less'

import AlertStripeInfo from "nav-frontend-alertstriper/lib/info-alertstripe";
import Lenke from 'nav-frontend-lenker';
import {EksternLenke} from "./EksternLenke";
export const SurveyBoks: FunctionComponent = props => {
    return (
        <div className={'surveyboks'}>
            <AlertStripeInfo >
                {' '}
                Jobber du med Hr eller økonomi, og har permittert ansatte? Vi trenger innsikt i forbindelse med ny løsning for refusjon og lønnskompensasjon.
                {' '}
                <Lenke className={'surveyboks__lenke'} href={'https://surveys.hotjar.com/s?siteId=118350&surveyId=157607'} target={'_blank'}>Svar på en kort spørreundersøkelse. <EksternLenke /></Lenke>

            </AlertStripeInfo>
        </div>
    );
};