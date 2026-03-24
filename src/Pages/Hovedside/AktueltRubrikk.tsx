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
            <LinkPanel
                className="aktuelt-panel"
                href={lenke}
                border
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
        lenke: 'https://www.nav.no/arbeidsgiver/mentor#refusjon',
        tittel: 'Refusjon for mentortilskudd blir nå utbetalt automatisk.',
        visFra: new Date('2026-01-27T00:00:00+02:00'),
        visTil: new Date('2026-03-01T00:00:00+02:00'),
        tilgangssjekk: (o) =>
            any(
                pick(o.altinntilgang, 'mentortilskudd', 'tiltaksrefusjon'),
                (value) => value === true
            ),
    },
    {
        lenke: 'https://arbeidsplassen.nav.no/lys-ut-sommerjobber',
        tittel: 'Trenger du ekstra hjelp i bedriften i sommer?',
        beskrivelse:
            'På Arbeidsplassen.no kan du legge ut annonse om sommerjobb gratis.',
        visFra: new Date('2026-03-23T00:00:00+01:00'),
        visTil: new Date('2026-04-30T00:00:00+02:00'),
        tilgangssjekk: (o) => o.altinntilgang.rekrutteringStillingsannonser === true,
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
