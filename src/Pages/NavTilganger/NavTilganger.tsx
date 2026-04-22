import React, { FunctionComponent, useMemo, useState } from 'react';
import {
    altinntjeneste,
    Altinn,
    AltinntjenesteId,
    isAltinn2Tilgang,
    isAltinn3Tilgang,
} from '../../altinn/tjenester';
import { finnOrganisasjonIHierarki, useAltinnTilganger } from '../../api/altinnTilgangerApi';
import { AltinnTilgangOrganisasjon } from '../../api/altinnTilgangerSchema';
import { useOrganisasjonsDetaljerContext } from '../OrganisasjonsDetaljerContext';
import './NavTilganger.css';
import {
    Accordion,
    BodyLong,
    Box,
    Button,
    Detail,
    Heading,
    Label,
    List,
    Loader,
    Tabs,
    Tag,
} from '@navikt/ds-react';

type TilgangVisning = { id: string; navn: string };

const TabLabel = ({ navn, antall }: { navn: string; antall: number }) => (
    <span className="nav-tilganger-tablabel">
        <span>{navn}</span>
        <span className="nav-tilganger-tabbadge" aria-hidden="true">
            {antall}
        </span>
    </span>
);

const finnTilgangsnavn = (tilgangId: string, filter: (tilgang: Altinn) => boolean) => {
    const treff = Object.values(altinntjeneste).find((tilgang) => {
        if (!filter(tilgang)) return false;
        if (isAltinn3Tilgang(tilgang)) return tilgang.ressurs === tilgangId;
        return `${tilgang.tjenestekode}:${tilgang.tjenesteversjon}` === tilgangId;
    });
    return treff?.navn ?? tilgangId;
};

const sorterTilganger = (
    tilganger: string[],
    filter: (tilgang: Altinn) => boolean
): TilgangVisning[] =>
    tilganger
        .map((id) => ({ id, navn: finnTilgangsnavn(id, filter) }))
        .sort((a, b) => a.navn.localeCompare(b.navn));

const TilgangListe = ({ tilganger }: { tilganger: TilgangVisning[] }) =>
    tilganger.length > 0 ? (
        <List>
            {tilganger.map((t) => (
                <List.Item key={t.id}>
                    <div className="nav-tilganger-listeelement">
                        <span>{t.navn}</span>
                        <Detail textColor="subtle">{t.id}</Detail>
                    </div>
                </List.Item>
            ))}
        </List>
    ) : (
        <BodyLong>Ingen tilganger registrert.</BodyLong>
    );

const RollerSeksjon = ({ roller }: { roller: string[] }) => (
    <section className="nav-tilganger-seksjon">
        <Label as="h3">Roller</Label>
        {roller.length > 0 ? (
            <div className="nav-tilganger-tags">
                {roller.map((rolle) => (
                    <Tag key={rolle} variant="neutral">
                        {rolle}
                    </Tag>
                ))}
            </div>
        ) : (
            <BodyLong>Ingen roller registrert.</BodyLong>
        )}
    </section>
);

const TilgangerSeksjon = ({
    altinn3,
    altinn2,
}: {
    altinn3: TilgangVisning[];
    altinn2: TilgangVisning[];
}) => (
    <section className="nav-tilganger-seksjon">
        <Label as="h3">Tilganger</Label>
        <Tabs defaultValue="altinn3" className="nav-tilganger-tabs">
            <Tabs.List>
                <Tabs.Tab
                    value="altinn3"
                    label={<TabLabel navn="Altinn 3" antall={altinn3.length} />}
                />
                <Tabs.Tab
                    value="altinn2"
                    label={<TabLabel navn="Altinn 2" antall={altinn2.length} />}
                />
            </Tabs.List>
            <Tabs.Panel value="altinn3">
                <TilgangListe tilganger={altinn3} />
            </Tabs.Panel>
            <Tabs.Panel value="altinn2">
                <TilgangListe tilganger={altinn2} />
            </Tabs.Panel>
        </Tabs>
    </section>
);

const OrgDetaljer = ({ org }: { org: AltinnTilgangOrganisasjon }) => (
    <>
        <RollerSeksjon roller={org.roller.map((r) => r.visningsnavn)} />
        <TilgangerSeksjon
            altinn3={sorterTilganger(org.altinn3Tilganger, isAltinn3Tilgang)}
            altinn2={sorterTilganger(org.altinn2Tilganger, isAltinn2Tilgang)}
        />
    </>
);

const OrgAccordionItem = ({ org }: { org: AltinnTilgangOrganisasjon }) => (
    <Accordion.Item>
        <Accordion.Header>
            <div className="nav-tilganger-accordion-header">
                <span>{org.navn}</span>
                <Detail textColor="subtle">{org.orgnr}</Detail>
            </div>
        </Accordion.Header>
        <Accordion.Content>
            <OrgDetaljer org={org} />
            {org.underenheter.length > 0 && (
                <section className="nav-tilganger-seksjon">
                    <Label as="h3">Underenheter</Label>
                    <Accordion className="nav-tilganger-underenheter">
                        {org.underenheter.map((u) => (
                            <OrgAccordionItem key={u.orgnr} org={u} />
                        ))}
                    </Accordion>
                </section>
            )}
        </Accordion.Content>
    </Accordion.Item>
);

const LoadingState = () => (
    <section className="nav-tilganger-laster">
        <Loader size="2xlarge" title="Henter roller og tilganger" />
        <BodyLong>Henter roller og tilganger...</BodyLong>
    </section>
);

const NavTilganger: FunctionComponent = () => {
    const { valgtOrganisasjon } = useOrganisasjonsDetaljerContext();
    const { data: altinnTilganger, isLoading } = useAltinnTilganger();
    const [visAlleEnheter, setVisAlleEnheter] = useState(false);

    const organisasjon = useMemo(
        () =>
            finnOrganisasjonIHierarki(
                altinnTilganger?.hierarki ?? [],
                valgtOrganisasjon.organisasjon.orgnr
            ),
        [altinnTilganger?.hierarki, valgtOrganisasjon.organisasjon.orgnr]
    );

    return (
        <div className="nav-tilganger-side">
            <Box className="nav-tilganger-panel">
                {visAlleEnheter ? (
                    <>
                        <div className="nav-tilganger-panel-topp">
                            <Heading level="2" size="medium">
                                Alle enheter
                            </Heading>
                            <Button
                                variant="tertiary"
                                size="small"
                                onClick={() => setVisAlleEnheter(false)}
                            >
                                Tilbake til valgt enhet
                            </Button>
                        </div>
                        {isLoading ? (
                            <LoadingState />
                        ) : (
                            <Accordion>
                                {altinnTilganger?.hierarki.map((org) => (
                                    <OrgAccordionItem key={org.orgnr} org={org} />
                                ))}
                            </Accordion>
                        )}
                    </>
                ) : (
                    <>
                        <div className="nav-tilganger-panel-topp">
                            <div>
                                <Heading level="2" size="medium">
                                    {valgtOrganisasjon.organisasjon.navn}
                                </Heading>
                                <BodyLong>
                                    Organisasjonsnummer: {valgtOrganisasjon.organisasjon.orgnr}
                                </BodyLong>
                            </div>
                            <Button
                                variant="secondary"
                                size="small"
                                onClick={() => setVisAlleEnheter(true)}
                            >
                                Se alle enheter
                            </Button>
                        </div>
                        {isLoading ? (
                            <LoadingState />
                        ) : organisasjon !== undefined ? (
                            <OrgDetaljer org={organisasjon} />
                        ) : (
                            <BodyLong>Fant ikke tilganger for valgt virksomhet.</BodyLong>
                        )}
                    </>
                )}
            </Box>
        </div>
    );
};

export default NavTilganger;
