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
const useCloseInfoboks = (id: string) => {
    const [closed, setClosed] = usePrefixedLocalStorage(id, localStoragePrefix, false);
    return { closed, setClosed };
};

const infobokser: Array<InfoboksProps> = [
    {
        id: 'vedlikehold-12-03-2025',
        visFra: new Date('2025-03-11T00:00:00+02:00'),
        visTil: new Date('2025-03-13T00:00:00+02:00'),
        Component: ({ id }) => {
            return (
                <Alert variant="info">
                    <Heading spacing size="small" level="2">
                        Planlagt vedlikehold onsdag 12. mars
                    </Heading>
                    Vi utfører systemvedlikehold denne dagen, noe som kan føre til kortvarig
                    ustabilitet. Takk for tålmodigheten!
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
