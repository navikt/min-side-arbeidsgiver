import React, { FC, useContext, useEffect } from 'react';
import * as Record from '../../utils/Record';
import './GiOssTilbakemelding.css';
import { OrganisasjonerOgTilgangerContext } from '../OrganisasjonerOgTilgangerProvider';
import { gittMiljo } from '../../utils/environment';
import { shouldDisplay } from '../../GeneriskeElementer/DisplayBetween';
import { OrganisasjonsDetaljerContext } from '../OrganisasjonDetaljerProvider';
import { Alert, Heading } from '@navikt/ds-react';
import { useLocalStorage } from '../../hooks/useStorage';
import { LenkeMedLogging } from '../../GeneriskeElementer/LenkeMedLogging';

type TilbakemeldingProps = {
    id: string;
    visFra: Date;
    visTil: Date;
    Component: FC;
};

const tilbakemeldinger: Array<TilbakemeldingProps> = [
    {
        id: 'uxsignals',
        visFra: new Date('2022-01-01T00:00:00+02:00'),
        visTil: new Date('2022-01-01T10:00:00+02:00'),
        Component: () => {
            const { organisasjoner } = useContext(OrganisasjonerOgTilgangerContext);
            const harInntektsmeldingPåTvers = Record.values(organisasjoner).some(
                (org) => org.altinntilgang.inntektsmelding
            );

            if (harInntektsmeldingPåTvers) {
                return <UXSignals />;
            } else {
                return null;
            }
        },
    },
    {
        id: 'ia-bookings',
        visFra: new Date('2023-11-13T10:00:00+02:00'),
        visTil: new Date('2023-12-01T10:00:00+02:00'),
        Component: () => {
            const { organisasjoner } = useContext(OrganisasjonerOgTilgangerContext);
            const harSyfotilgangPåTvers = Record.values(organisasjoner).some(
                (org) => org.syfotilgang
            );
            const [closed, setClosed] = useLocalStorage('ia-bookings-closed', false);

            if (!harSyfotilgangPåTvers) {
                return null;
            }

            return closed ? null : (
                <Alert variant="info" closeButton onClose={() => setClosed(true)}>
                    <Heading spacing size="small" level="3">
                        Er du leder med personalansvar?
                    </Heading>
                    Vi skal forbedre våre tjenester for inkluderende arbeidsliv, og vil gjerne ha
                    din hjelp. Vi ønsker å vite mer om din hverdag, slik at tjenestene våre blir
                    bedre tilpasset deg. Samtalen tar ca. én time, og gjennomføres på Teams. Svarene
                    er anonyme.
                    <br />
                    <LenkeMedLogging
                        loggLenketekst="Book oss inn for en digital samtale."
                        href="https://outlook.office365.com/owa/calendar/Inkluderendearbeidsliv@nav.no/bookings/"
                    >
                        Book oss inn for en digital samtale.
                    </LenkeMedLogging>
                </Alert>
            );
        },
    },
];

export const GiOssTilbakemelding = () => {
    const tilbakemeldingSomSkalVises = tilbakemeldinger.filter(({ visFra, visTil }) =>
        shouldDisplay({
            showFrom: visFra,
            showUntil: visTil,
            currentTime: new Date(),
        })
    );

    return (
        <>
            {tilbakemeldingSomSkalVises.map(({ id, Component }) => (
                <Component key={id} />
            ))}
        </>
    );
};

const UXSignals = () => {
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
            data-uxsignals-embed="study-yoz8qmkdor"
            {...gittMiljo({
                prod: {},
                other: {
                    'data-uxsignals-mode': 'demo',
                },
            })}
        />
    );
};
