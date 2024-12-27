import React, { FC, useEffect } from 'react';
import * as Record from '../../utils/Record';
import './InfoBokser.css';
import { useOrganisasjonerOgTilgangerContext } from '../OrganisasjonerOgTilgangerProvider';
import { gittMiljo } from '../../utils/environment';
import { shouldDisplay } from '../../GeneriskeElementer/DisplayBetween';
import { useOrganisasjonsDetaljerContext } from '../OrganisasjonDetaljerProvider';
import { Alert, Heading } from '@navikt/ds-react';
import { useLocalStorage } from '../../hooks/useStorage';
import { LenkeMedLogging } from '../../GeneriskeElementer/LenkeMedLogging';

type InfoboksProps = {
    id: string;
    visFra: Date;
    visTil: Date;
    Component: FC;
};

const infobokser: Array<InfoboksProps> = [
    {
        id: 'uxsignals',
        visFra: new Date('2024-11-06T00:00:00+02:00'),
        visTil: new Date('2024-12-31T10:00:00+02:00'),
        Component: () => {
            const { valgtOrganisasjon } = useOrganisasjonsDetaljerContext();
            if (!valgtOrganisasjon || !valgtOrganisasjon.altinntilgang.inntektsmelding) {
                return null;
            }
            return <UXSignals dataUxsignalsEmbed="panel-mwwvs1lq0" />;
        },
    },
    {
        id: 'ia-bookings',
        visFra: new Date('2023-11-13T10:00:00+02:00'),
        visTil: new Date('2023-11-15T08:00:00+01:00'),
        Component: () => {
            const { organisasjoner } = useOrganisasjonerOgTilgangerContext();
            const harSyfotilgangPåTvers = Record.values(organisasjoner).some(
                (org) => org.syfotilgang
            );
            const [closed, setClosed] = useLocalStorage('ia-bookings-closed', false);

            if (!harSyfotilgangPåTvers) {
                return null;
            }

            return closed ? null : (
                <Alert variant="info" closeButton onClose={() => setClosed(true)}>
                    <Heading spacing size="small" level="2">
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
    {
        id: 'yrkesskade-infoboks',
        visFra: new Date('2024-04-11T00:00:00+02:00'),
        visTil: new Date('2024-06-11T00:00:00+02:00'),
        Component: () => {
            const { valgtOrganisasjon } = useOrganisasjonsDetaljerContext();
            const [closed, setClosed] = useLocalStorage('yrkesskade-infobokser-closed', false);

            if (!valgtOrganisasjon || !valgtOrganisasjon.altinntilgang.yrkesskade) {
                return null;
            }

            return closed ? null : (
                <Alert variant="info" closeButton onClose={() => setClosed(true)}>
                    <Heading spacing size="small" level="2">
                        Informasjon om innsendt skademelding
                    </Heading>
                    Informasjon om skademeldinger er nå tilgjengelig i saker for dine virksomheter.
                    Saksoversikten viser kun innmeldte skademeldinger til NAV etter 11. april 2024,
                    og kun informasjon om innmeldingen som NAV kan dele med deg. Samme informasjon
                    har også blitt sendt i Altinn som bekreftelse til virksomheten.
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
                <Component key={id} />
            ))}
        </>
    );
};

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
