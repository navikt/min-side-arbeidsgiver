import React from 'react';
import { Alert, BodyLong, Heading } from '@navikt/ds-react';

const AdvarselBannerTestversjon = () => {
    if (window.location.hostname.endsWith('.dev.nav.no')) {
        return (
            <Alert variant="warning" size="medium" className="advarsel-banner-testversjon">
                <Heading spacing size="small">
                    Dette er en testversjon
                </Heading>
                <BodyLong>
                    Informasjonen du finner her er ikke ekte. Her kan du bli bedre kjent med Min
                    side – Arbeidsgiver. Testversjonen kan avvike noe fra den virkelige nettsiden.
                </BodyLong>
            </Alert>
        );
    }

    return null;
};

export default AdvarselBannerTestversjon;
