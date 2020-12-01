import React from 'react';
import {AlertStripeAdvarsel} from "nav-frontend-alertstriper";
import './AdvarselBannerTestversjon.less'
const AdvarselBannerTestversjon = () => {
    return (
        <>{window.location.hostname.includes('labs.nais.io') && (
            <AlertStripeAdvarsel className={'advarsel-banner-testversjon'}>
                <b>Dette er en testversjon</b>
                <br/>
                Her kan du bli bedre kjent med Min side – Arbeidsgiver.
                <br/>
                Testversjonen kan avvike noe fra den virkelige nettsiden.
                Foreløpig fungerer lenkene til <i>Sykemeldte</i>,
                <i>Tiltak</i>, <i>Arbeidsforhold</i> og <i>Sykefraværsstatistikk</i>. De andre sidene har ikke fungerende testversjoner.
                <br/>
            </AlertStripeAdvarsel>
        )}
        </>
    );
};

export default AdvarselBannerTestversjon;