import { Heading, LinkPanel } from '@navikt/ds-react';
import React, { useContext } from 'react';
import { loggNavigasjonTags } from '../../utils/funksjonerForAmplitudeLogging';
import { DisplayBetween, shouldDisplay } from '../../GeneriskeElementer/DisplayBetween';
import { useLocation } from 'react-router-dom';
import './AktueltRubrikk.css';
import { OrganisasjonsDetaljerContext } from '../OrganisasjonDetaljerProvider';
import { OrganisasjonInfo } from '../OrganisasjonerOgTilgangerProvider';

type AktueltProps = {
    lenke: string;
    tittel: string;
    visFra: Date;
    visTil: Date;
    tilgangssjekk: (valgtOrganisasjon: OrganisasjonInfo) => boolean;
};

const dateFormat = new Intl.DateTimeFormat('no', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
});

const Aktuelt = ({ lenke, tittel, visFra, visTil }: AktueltProps) => {
    const { pathname } = useLocation();

    return (
        <DisplayBetween showFrom={visFra} showUntil={visTil}>
            <LinkPanel
                className="aktuelt-panel"
                href={lenke}
                border
                onClick={() => {
                    loggNavigasjonTags(lenke, tittel, pathname, { component: 'aktuelt' });
                }}
            >
                <LinkPanel.Title>{tittel}</LinkPanel.Title>
                <LinkPanel.Description>{dateFormat.format(visFra)}</LinkPanel.Description>
            </LinkPanel>
        </DisplayBetween>
    );
};

const aktuelt: Array<AktueltProps> = [
    {
        lenke: 'https://www.nav.no/arbeidsgiver/nye-inntektsmeldinger',
        tittel: 'Ny løsning for inntektsmelding for foreldre- og svangerskapspenger kommer snart',
        visFra: new Date('2024-11-05T00:00:00+02:00'),
        visTil: new Date('2024-12-31T00:00:00+02:00'),
        tilgangssjekk: (_) => true
    }
];

export const AktueltRubrikk = () => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    if (!valgtOrganisasjon) {
        return null;
    }

    const aktueltMedTilgang = aktuelt.filter(({ tilgangssjekk }) =>
        tilgangssjekk(valgtOrganisasjon)
    );
    const aktuelleVises = aktueltMedTilgang.some(({ visFra, visTil }) =>
        shouldDisplay({
            showFrom: visFra,
            showUntil: visTil,
            currentTime: new Date(),
        })
    );

    if (!aktuelleVises) {
        return null;
    }

    return (
        <div className="aktuelt-container">
            <Heading size="small" level="2" id="aktuelt-tittel" className="aktuelt-tittel">
                Aktuelt
            </Heading>
            <div className="aktuelt">
                {aktueltMedTilgang.map((props) => (
                    <Aktuelt key={props.tittel} {...props} />
                ))}
            </div>
        </div>
    );
};
