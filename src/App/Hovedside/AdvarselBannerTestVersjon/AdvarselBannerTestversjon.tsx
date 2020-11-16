import React from 'react';
import {AlertStripeAdvarsel} from "nav-frontend-alertstriper";
import './AdvarselBannerTestversjon.less'
const AdvarselBannerTestversjon = () => {
    return (
        <>{
            <AlertStripeAdvarsel className={'advarsel-banner-testversjon'}>
                <b>Dette er en testversjon</b>
                <br/>
                Her kan du bli bedre kjent med Min side – Arbeidsgiver.
                <br/>
                Testversjonen kan avvike noe fra den virkelige nettsiden og
                foreløpig er det bare lenkene til <i>mine sykemeldte</i>,
                og <i>arbeidsavtaler</i> som virker, de andre sidene har ikke fungerende testversjoner.
                <br/>
            </AlertStripeAdvarsel>
     }
        </>
    );
};

export default AdvarselBannerTestversjon;