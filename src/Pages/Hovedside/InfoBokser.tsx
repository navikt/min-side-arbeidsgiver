import React, { FC, useEffect } from 'react';
import './InfoBokser.css';
import { gittMiljo } from '../../utils/environment';
import { shouldDisplay } from '../../GeneriskeElementer/DisplayBetween';
import { Alert, Heading } from '@navikt/ds-react';
import { usePrefixedLocalStorage } from '../../hooks/useStorage';
import { useOrganisasjonsDetaljerContext } from '../OrganisasjonsDetaljerContext';

type InfoboksProps = {
    id: string;
    visFra: Date;
    visTil: Date;
    Component: FC<{ id: string }>;
};

const localStoragePrefix = 'msa-info-boks-';

const infobokser: Array<InfoboksProps> = [
    {
        id: 'for-deg-med-avtaler-om-arbeids-trening',
        visFra: new Date('2025-01-21T00:00:00+02:00'),
        visTil: new Date('2025-02-28T00:00:00+02:00'),
        Component: ({ id }) => {
            const { valgtOrganisasjon } = useOrganisasjonsDetaljerContext();
            const [closed, setClosed] = usePrefixedLocalStorage(id, localStoragePrefix, false);

            if (!valgtOrganisasjon || !valgtOrganisasjon.altinntilgang.arbeidstrening) {
                return null;
            }

            return closed ? null : (
                <Alert variant="info" closeButton onClose={() => setClosed(true)}>
                    <Heading spacing size="small" level="2">
                        For deg med avtaler om arbeidstrening
                    </Heading>
                    Vi gjør tekniske oppdateringer i systemene våre og det kan forekomme endringer
                    for de som har avtaler om arbeidstrening. Hvis dere opplever at noe ikke
                    stemmer, så ta kontakt med veileder eller NKS på telefonen: 55 55 33 36
                </Alert>
            );
        },
    },
];

export const InfoBokser = () => {
    const infobokserSomSkalVises = infobokser.filter(({ visFra, visTil }) =>
        shouldDisplay({
            showFrom: visFra,
            showUntil: visTil,
            currentTime: new Date(),
        })
    );

    return (
        <>
            {infobokserSomSkalVises.map(({ id, Component }) => (
                <Component key={id} id={id} />
            ))}
        </>
    );
};

/**
 * fjernet bruk av denne inntil vi har kontroll på konsekvenser iht ny ekomlovgivning
 */
const UXSignals = ({ dataUxsignalsEmbed }: { dataUxsignalsEmbed: string }) => {
    useEffect(() => {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://uxsignals-frontend.uxsignals.app.iterate.no/embed.js';
        document.body.appendChild(script);

        return () => {
            try {
                document.body.removeChild(script);
            } catch {}
        };
    }, []);

    return (
        <div
            key="tilbakemelding-banner"
            className="tilbakemelding-banner"
            data-uxsignals-embed={dataUxsignalsEmbed}
            {...gittMiljo({
                prod: {},
                other: {
                    'data-uxsignals-mode': 'demo',
                },
            })}
        />
    );
};
