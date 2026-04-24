import { Heading, LinkPanel } from '@navikt/ds-react';
import React from 'react';
import { DisplayBetween, shouldDisplay } from '../../GeneriskeElementer/DisplayBetween';
import './AktueltRubrikk.css';
import { OrganisasjonInfo } from '../OrganisasjonerOgTilgangerContext';
import { useOrganisasjonsDetaljerContext } from '../OrganisasjonsDetaljerContext';
import { any, pick } from '../../utils/Record';

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
    return (
        <DisplayBetween showFrom={visFra} showUntil={visTil}>
            <LinkPanel className="aktuelt-panel" href={lenke} border>
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
        lenke: 'https://www.nav.no/arbeidsgiver/sommerjobb',
        tittel: 'Trenger du hjelp i sommer?',
        beskrivelse:
            'Gir du sommerjobb til ungdom gjennom Nav, får ungdom verdifull erfaring samtidig som Nav dekker deler av lønnen.',
        visFra: new Date('2026-04-09T00:00:00+02:00'),
        visTil: new Date('2026-05-30T00:00:00+02:00'),
        tilgangssjekk: (o) => o.vilkaarligAltinntilgang,
    },
    {
        lenke: 'https://www.nav.no/arbeidsgiver/oppgjorsrapport',
        tittel: 'Store endringer i Oppgjørsrapporten (tidligere kalt K27)',
        beskrivelse:
            'Det blir nye rapportnavn, nye leveransekanaler og en periode med dobbeltvarsling.',
        visFra: new Date('2026-03-26T00:00:00+01:00'),
        visTil: new Date('2026-04-26T00:00:00+02:00'),
        tilgangssjekk: (o) => o.vilkaarligAltinntilgang,
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
