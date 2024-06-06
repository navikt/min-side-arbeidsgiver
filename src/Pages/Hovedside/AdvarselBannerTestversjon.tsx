import React from 'react';
import { Alert, BodyLong, Button, Heading, HStack } from '@navikt/ds-react';
import { demoProfiler, useDemoprofil } from '../../hooks/useDemoprofil';

const AdvarselBannerTestversjon = () => {
    const { valgtDemoprofil, setDemoprofil } = useDemoprofil();

    console.log({ valgtDemoprofil });
    if (import.meta.env.MODE === 'demo') {
        return (
            <Alert variant="warning" size="medium" className="advarsel-banner-testversjon">
                <Heading level="2" spacing size="small">
                    Velg testprofil
                    <HStack gap="1">
                        {demoProfiler.map(({ profil, navn }) => (
                            <Button
                                key={navn}
                                variant={
                                    profil === valgtDemoprofil
                                        ? 'primary-neutral'
                                        : 'secondary-neutral'
                                }
                                size="small"
                                onClick={() => setDemoprofil(profil)}
                            >
                                {navn}
                            </Button>
                        ))}
                    </HStack>
                </Heading>
                <BodyLong>
                    Dette er en testversjon som kan avvike noe fra den virkelige nettsiden.
                    Informasjonen du finner her er ikke ekte.
                </BodyLong>
            </Alert>
        );
    }

    return null;
};

export default AdvarselBannerTestversjon;
