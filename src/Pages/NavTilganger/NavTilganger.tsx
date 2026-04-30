import React, { FunctionComponent, useMemo, useState } from 'react';
import { finnOrganisasjonIHierarki, useAltinnTilganger } from '../../api/altinnTilgangerApi';
import { AccessPackage, AltinnTilgangOrganisasjon, Rolle, RessursMetadata } from '../../api/altinnTilgangerSchema';
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
    Link,
    Loader,
    Tag,
} from '@navikt/ds-react';
import { CheckmarkCircleFillIcon } from '@navikt/aksel-icons';
import { narmesteLederKoblingURL } from '../../lenker';
import { useOrganisasjonerOgTilgangerContext } from '../OrganisasjonerOgTilgangerContext';

const TilgangAccordionItem = ({
    ressursId,
    ressursMetadata,
    orgRoller,
    orgTilgangspakker,
    accessPackages,
}: {
    ressursId: string;
    ressursMetadata: Record<string, RessursMetadata>;
    orgRoller: Rolle[];
    orgTilgangspakker: string[];
    accessPackages: Record<string, AccessPackage>;
}) => {
    const metadata = ressursMetadata[ressursId];
    const tittel = metadata?.metadata.title.nb ?? ressursId;
    const beskrivelse = metadata?.metadata.rightDescription.nb;

    const matchendeRoller = orgRoller.filter((rolle) =>
        (metadata?.grantedByRoles ?? []).some(
            (r) => r.toLowerCase() === rolle.kode.toLowerCase()
        )
    );
    const matchendePakker = (metadata?.grantedByAccessPackages ?? []).filter((pakke) =>
        orgTilgangspakker.some((p) => p.toLowerCase() === pakke.toLowerCase())
    );

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
                            Delegert via tilgangspakke {accessPackages[pakke]?.name ?? pakke}
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
    orgTilgangspakker,
    accessPackages,
}: {
    tilganger: string[];
    ressursMetadata: Record<string, RessursMetadata>;
    orgRoller: Rolle[];
    orgTilgangspakker: string[];
    accessPackages: Record<string, AccessPackage>;
}) =>
    tilganger.length > 0 ? (
        <Accordion>
            {sorterRessursIds(tilganger, ressursMetadata).map((id) => (
                <TilgangAccordionItem
                    key={id}
                    ressursId={id}
                    ressursMetadata={ressursMetadata}
                    orgRoller={orgRoller}
                    orgTilgangspakker={orgTilgangspakker}
                    accessPackages={accessPackages}
                />
            ))}
        </Accordion>
    ) : (
        <BodyLong>Ingen tilganger registrert.</BodyLong>
    );

const NærmesteLederSeksjon = () => (
    <section className="nav-tilganger-seksjon">
        <Label as="h3">Nærmeste leder - oppfølging av sykemeldte</Label>
        <div className="nav-tilganger-nærmeste-leder">
            <CheckmarkCircleFillIcon
                className="nav-tilganger-nærmeste-leder-ikon"
                aria-hidden
            />
            <BodyLong>
                Du er oppgitt som nærmeste leder for en eller flere ansatte i virksomheten.
            </BodyLong>
        </div>
        <Link href={narmesteLederKoblingURL}>Kontroller eller fjern kobling</Link>
    </section>
);

const AltinnTilgangerSeksjon = ({
    org,
    ressursMetadata,
    accessPackages,
}: {
    org: AltinnTilgangOrganisasjon;
    ressursMetadata: Record<string, RessursMetadata>;
    accessPackages: Record<string, AccessPackage>;
}) => (
    <section className="nav-tilganger-seksjon">
        <Label as="h3">Altinn tilganger</Label>
        <BodyLong spacing>Du har følgende tilganger i Altinn til Navs tjenester.</BodyLong>
        <TilgangerAccordion
            tilganger={org.altinn3Tilganger}
            ressursMetadata={ressursMetadata}
            orgRoller={org.roller}
            orgTilgangspakker={org.tilgangspakker}
            accessPackages={accessPackages}
        />
    </section>
);

const OrgDetaljer = ({
    org,
    ressursMetadata,
    accessPackages,
    syfotilgang,
}: {
    org: AltinnTilgangOrganisasjon;
    ressursMetadata: Record<string, RessursMetadata>;
    accessPackages: Record<string, AccessPackage>;
    syfotilgang: boolean;
}) => (
    <>
        {syfotilgang && <NærmesteLederSeksjon />}
        <AltinnTilgangerSeksjon org={org} ressursMetadata={ressursMetadata} accessPackages={accessPackages} />
    </>
);

const OrgAccordionItem = ({
    org,
    ressursMetadata,
    accessPackages,
    organisasjonsInfo,
}: {
    org: AltinnTilgangOrganisasjon;
    ressursMetadata: Record<string, RessursMetadata>;
    accessPackages: Record<string, AccessPackage>;
    organisasjonsInfo: ReturnType<typeof useOrganisasjonerOgTilgangerContext>['organisasjonsInfo'];
}) => (
    <Accordion.Item>
        <Accordion.Header>
            <div className="nav-tilganger-accordion-header">
                <span>{org.navn}</span>
                <Detail textColor="subtle">{org.orgnr}</Detail>
            </div>
        </Accordion.Header>
        <Accordion.Content>
            <OrgDetaljer
                org={org}
                ressursMetadata={ressursMetadata}
                accessPackages={accessPackages}
                syfotilgang={organisasjonsInfo[org.orgnr]?.syfotilgang ?? false}
            />
            {org.underenheter.length > 0 && (
                <section className="nav-tilganger-seksjon">
                    <Label as="h3">Underenheter</Label>
                    <Accordion className="nav-tilganger-underenheter">
                        {org.underenheter.map((u) => (
                            <OrgAccordionItem
                                key={u.orgnr}
                                org={u}
                                ressursMetadata={ressursMetadata}
                                accessPackages={accessPackages}
                                organisasjonsInfo={organisasjonsInfo}
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
    const { organisasjonsInfo } = useOrganisasjonerOgTilgangerContext();
    const { data: altinnTilganger, isLoading } = useAltinnTilganger();
    const [visAlleEnheter, setVisAlleEnheter] = useState(false);

    const ressursMetadata = altinnTilganger?.ressursMetadata ?? {};
    const accessPackages = altinnTilganger?.accessPackages ?? {};

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
                                        accessPackages={accessPackages}
                                        organisasjonsInfo={organisasjonsInfo}
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
                            <OrgDetaljer
                                org={organisasjon}
                                ressursMetadata={ressursMetadata}
                                accessPackages={accessPackages}
                                syfotilgang={valgtOrganisasjon.syfotilgang}
                            />
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

