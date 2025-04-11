import React, { FC, useEffect } from 'react';
import './InfoBokser.css';
import { gittMiljo } from '../../utils/environment';
import { shouldDisplay } from '../../GeneriskeElementer/DisplayBetween';
import { Alert, BodyLong, Heading } from '@navikt/ds-react';
import { usePrefixedLocalStorage } from '../../hooks/useStorage';
import { useOrganisasjonsDetaljerContext } from '../OrganisasjonsDetaljerContext';
import { LenkeMedLogging } from '../../GeneriskeElementer/LenkeMedLogging';

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
        visTil: new Date('2025-03-12T00:00:00+02:00'),
        Component: ({ id }) => {
            return (
                <Alert variant="info">
                    <Heading spacing size="small" level="2">
                        Planlagt vedlikehold torsdag 13. mars
                    </Heading>
                    Vi utfører systemvedlikehold denne dagen, noe som kan føre til kortvarig
                    ustabilitet. Takk for tålmodigheten!
                </Alert>
            );
        },
    },
    {
        id: 'endre-kontonummer-11-04-2025',
        visFra: new Date('2025-04-11T00:00:00+02:00'),
        visTil: new Date('2025-05-01T00:00:00+02:00'),
        Component: () => {
            const { valgtOrganisasjon } = useOrganisasjonsDetaljerContext();
            const kanEndreKontonummer =
                valgtOrganisasjon.altinntilgang.endreBankkontonummerForRefusjoner ?? false;
            if (!kanEndreKontonummer) return;
            const { closed, setClosed } = useCloseInfoboks('endre-kontonummer-info');

            if (closed) return;

            return (
                <Alert
                    variant="info"
                    contentMaxWidth={false}
                    closeButton
                    onClose={() => setClosed(true)}
                >
                    <Heading spacing size="small" level="3">
                        Endringer i tilgang til å endre kontonummer hos NAV
                    </Heading>
                    <BodyLong>
                        Fra 1. mai 2025 strammes reglene inn for hvem som kan endre kontonummer for
                        refusjoner fra NAV.
                        <br />
                        For å gjøre slike endringer, må du ha tilgang til enkelttjenesten: "Endre
                        bankkontonummer for refusjoner fra NAV til arbeidsgiver". Se
                        <LenkeMedLogging
                            href="https://www.nav.no/arbeidsgiver/endring-kontonummer"
                            loggLenketekst="endring kontonummer"
                        >
                            Nytt om tilgang til endring av kontonummer for refusjoner fra Nav.
                        </LenkeMedLogging>
                    </BodyLong>
                </Alert>
            );
        },
    },
];

export const InfoBokser = ({ onlyShowIds }: { onlyShowIds?: string[] }) => {
    const infobokserSomSkalVises = infobokser.filter(({ id, visFra, visTil }) =>
        shouldDisplay({
            showFrom: visFra,
            showUntil: visTil,
            currentTime: new Date(),
        }) && (!onlyShowIds || onlyShowIds.includes(id))
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
