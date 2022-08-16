import React from 'react';
import {Alert, BodyLong, Heading} from "@navikt/ds-react";

const AdvarselBannerTestversjon = () => {
    return (
        <>{window.location.hostname.includes('labs.nais.io') && (
            <Alert variant="warning" size="medium" className='advarsel-banner-testversjon'>
                <Heading spacing size="small">
                    Dette er en testversjon
                </Heading>
                <BodyLong>
                    Her kan du bli bedre kjent med Min side – Arbeidsgiver.
                </BodyLong>
                <BodyLong>
                    Testversjonen kan avvike noe fra den virkelige nettsiden.
                    Foreløpig fungerer lenkene til <i>Sykmeldte</i>,
                    <i>Tiltak</i>, <i>Arbeidsforhold</i> og <i>Sykefraværsstatistikk</i>. De andre sidene har ikke fungerende testversjoner.
                </BodyLong>
            </Alert>
        )}
        </>
    );
};

export default AdvarselBannerTestversjon;