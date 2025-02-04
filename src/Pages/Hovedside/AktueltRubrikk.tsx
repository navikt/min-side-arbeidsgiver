import { Heading, LinkPanel } from '@navikt/ds-react';
import React, { useEffect } from 'react';
import { loggNavigasjonTags } from '../../utils/funksjonerForAmplitudeLogging';
import { DisplayBetween, shouldDisplay } from '../../GeneriskeElementer/DisplayBetween';
import { useLocation } from 'react-router-dom';
import './AktueltRubrikk.css';
import { OrganisasjonInfo } from '../OrganisasjonerOgTilgangerContext';
import amplitude from '../../utils/amplitude';
import { useOrganisasjonsDetaljerContext } from '../OrganisasjonsDetaljerContext';

type AktueltProps = {
    lenke: string;
    tittel: string;
    beskrivelse?: string;
    visFra: Date;
    visTil: Date;
    tilgangssjekk: (valgtOrganisasjon: OrganisasjonInfo) => boolean;
};

const dateFormat = new Intl.DateTimeFormat('no', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
});

const Aktuelt = ({ lenke, tittel, beskrivelse, visFra, visTil }: AktueltProps) => {
    const { pathname } = useLocation();
    useEffect(() => {
        amplitude.logEvent('komponent-lastet', {
            komponent: 'aktuelt',
            lenketekst: tittel,
        });
    }, []);

    return (
        <DisplayBetween showFrom={visFra} showUntil={visTil}>
            <LinkPanel
                className="aktuelt-panel"
                href={lenke}
                border
                onClick={() => {
                    loggNavigasjonTags(lenke, tittel, pathname, { komponent: 'aktuelt' });
                }}
            >
                <LinkPanel.Title>{tittel}</LinkPanel.Title>
                <LinkPanel.Description>
                    {beskrivelse ?? dateFormat.format(visFra)}
                </LinkPanel.Description>
            </LinkPanel>
        </DisplayBetween>
    );
};

const aktuelt: Array<AktueltProps> = [
    {
        lenke: 'https://arbeidsgiver.nav.no/min-side-arbeidsgiver/artikkel/saferoad_ansetter_ved_hjelp_av_nav',
        tittel: 'Ønsker dere hjelpe fra Nav til å rekruttere?',
        beskrivelse:
            'Les om hvordan Nav bidrar til at Saferoad kan ansette over 100 nye folk hvert år.',
        visFra: new Date('2024-12-13T00:00:00+02:00'),
        visTil: new Date('2025-01-31T00:00:00+02:00'),
        tilgangssjekk: (orgInfo) => orgInfo.altinntilgang.rekruttering,
    },
];

export const AktueltRubrikk = () => {
    const { valgtOrganisasjon } = useOrganisasjonsDetaljerContext();

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
