import React, { FunctionComponent, useMemo, useState } from 'react';
import { finnOrganisasjonIHierarki, useAltinnTilganger } from '../../api/altinnTilgangerApi';
import { AltinnTilgangOrganisasjon, Rolle, RessursMetadata } from '../../api/altinnTilgangerSchema';
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
    Loader,
    Tag,
} from '@navikt/ds-react';

const TilgangAccordionItem = ({
    ressursId,
    ressursMetadata,
    orgRoller,
}: {
    ressursId: string;
    ressursMetadata: Record<string, RessursMetadata>;
    orgRoller: Rolle[];
}) => {
    const metadata = ressursMetadata[ressursId];
    const tittel = metadata?.metadata.title.nb ?? ressursId;
    const beskrivelse = metadata?.metadata.rightDescription.nb;

    const matchendeRoller = orgRoller.filter((rolle) =>
        (metadata?.grantedByRoles ?? []).some(
            (r) => r.toLowerCase() === rolle.kode.toLowerCase()
        )
    );
    const matchendePakker = metadata?.grantedByAccessPackages ?? [];

    return (
        <Accordion.Item>
            <Accordion.Header>{tittel}</Accordion.Header>
            <Accordion.Content>
                {beskrivelse != null && beskrivelse.length > 0 && (
                    <BodyLong spacing>{beskrivelse}</BodyLong>
                )}
                <div className="nav-tilganger-tags">
                    {matchendeRoller.map((rolle) => (
                        <Tag key={rolle.kode} variant="alt1">
                            Delegert via rollen {rolle.visningsnavn} ({rolle.kode})
                        </Tag>
                    ))}
                    {matchendePakker.map((pakke) => (
                        <Tag key={pakke} variant="alt1">
                            Delegert via tilgangspakke {pakke}
                        </Tag>
                    ))}
                </div>
            </Accordion.Content>
        </Accordion.Item>
    );
};

const sorterRessursIds = (
    ressursIds: string[],
    ressursMetadata: Record<string, RessursMetadata>
): string[] =>
    [...ressursIds].sort((a, b) => {
        const navnA = ressursMetadata[a]?.metadata.title.nb ?? a;
        const navnB = ressursMetadata[b]?.metadata.title.nb ?? b;
        return navnA.localeCompare(navnB);
    });

const TilgangerAccordion = ({
    tilganger,
    ressursMetadata,
    orgRoller,
}: {
    tilganger: string[];
    ressursMetadata: Record<string, RessursMetadata>;
    orgRoller: Rolle[];
}) =>
    tilganger.length > 0 ? (
        <Accordion>
            {sorterRessursIds(tilganger, ressursMetadata).map((id) => (
                <TilgangAccordionItem
                    key={id}
                    ressursId={id}
                    ressursMetadata={ressursMetadata}
                    orgRoller={orgRoller}
                />
            ))}
        </Accordion>
    ) : (
        <BodyLong>Ingen tilganger registrert.</BodyLong>
    );

const OrgDetaljer = ({
    org,
    ressursMetadata,
}: {
    org: AltinnTilgangOrganisasjon;
    ressursMetadata: Record<string, RessursMetadata>;
}) => (
    <>
        <TilgangerAccordion
            tilganger={org.altinn3Tilganger}
            ressursMetadata={ressursMetadata}
            orgRoller={org.roller}
        />
    </>
);

const OrgAccordionItem = ({
    org,
    ressursMetadata,
}: {
    org: AltinnTilgangOrganisasjon;
    ressursMetadata: Record<string, RessursMetadata>;
}) => (
    <Accordion.Item>
        <Accordion.Header>
            <div className="nav-tilganger-accordion-header">
                <span>{org.navn}</span>
                <Detail textColor="subtle">{org.orgnr}</Detail>
            </div>
        </Accordion.Header>
        <Accordion.Content>
            <OrgDetaljer org={org} ressursMetadata={ressursMetadata} />
            {org.underenheter.length > 0 && (
                <section className="nav-tilganger-seksjon">
                    <Label as="h3">Underenheter</Label>
                    <Accordion className="nav-tilganger-underenheter">
                        {org.underenheter.map((u) => (
                            <OrgAccordionItem
                                key={u.orgnr}
                                org={u}
                                ressursMetadata={ressursMetadata}
                            />
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

    const ressursMetadata = altinnTilganger?.ressursMetadata ?? {};

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
                                Alle virksomheter
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
                                    <OrgAccordionItem
                                        key={org.orgnr}
                                        org={org}
                                        ressursMetadata={ressursMetadata}
                                    />
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
                                Se alle virksomheter
                            </Button>
                        </div>
                        {isLoading ? (
                            <LoadingState />
                        ) : organisasjon !== undefined ? (
                            <OrgDetaljer org={organisasjon} ressursMetadata={ressursMetadata} />
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

