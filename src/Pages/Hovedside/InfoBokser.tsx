import React, { FC, useEffect } from 'react';
import './InfoBokser.css';
import { gittMiljo } from '../../utils/environment';
import { shouldDisplay } from '../../GeneriskeElementer/DisplayBetween';
import { Alert, BodyLong, BodyShort, Heading, InfoCard, List, LocalAlert } from '@navikt/ds-react';
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
        id: 'altinn-tilganger-mars-2026',
        visFra: new Date('2026-03-01T00:00:00+02:00'),
        visTil: new Date('2026-03-30T00:00:00+02:00'),
        Component: ({ id }) => {
            const { valgtOrganisasjon } = useOrganisasjonsDetaljerContext();
            const { closed, setClosed } = useCloseInfoboks(id);

            if (!valgtOrganisasjon.vilkaarligAltinntilgang) return;

            if (closed) return;

            return (
                <LocalAlert status="announcement">
                    <LocalAlert.Header>
                        <LocalAlert.Title>
                            Viktig før 30. mars: Rydd i tilgangene i Altinn
                        </LocalAlert.Title>
                        <LocalAlert.CloseButton onClick={() => setClosed(true)} />
                    </LocalAlert.Header>
                    <LocalAlert.Content>
                        <BodyShort size="medium">
                            Den 30. mars flyttes følgende tilganger over til Altinn 3:
                        </BodyShort>
                        <List as="ul">
                            <List.Item>Sykmelding – oppgi leder</List.Item>
                            <List.Item>Digital oppfølgingsplan for sykmeldte</List.Item>
                            <List.Item>Brev om dialogmøte</List.Item>
                        </List>
                        <BodyShort size="medium" spacing>
                            Alle som har disse tilgangene i dag, får automatisk nye, tilsvarende
                            tilganger.
                        </BodyShort>
                        <BodyShort size="medium">
                            Har noen ikke lenger behov for tilgangene? Da må dere fjerne dem i
                            Altinn før 30. mars.
                        </BodyShort>
                        <BodyShort size="medium">
                            Har de fortsatt behov? Da trenger dere ikke gjøre noe.
                        </BodyShort>
                    </LocalAlert.Content>
                </LocalAlert>
            );
        },
    },
];

export const InfoBokser = () => {
    const infobokserSomSkalVises = infobokser.filter(({ id, visFra, visTil }) =>
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
