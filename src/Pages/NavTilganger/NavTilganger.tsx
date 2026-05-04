import React, { FunctionComponent, useMemo, useState } from 'react';
import { finnOrganisasjonIHierarki, useAltinnTilganger } from '../../api/altinnTilgangerApi';
import { Altinn3Tilgang, AltinnTilgangOrganisasjon } from '../../api/altinnTilgangerSchema';
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

const normaliserRessursId = (id: string): string => {
    const utenPrefix = id.replace(/^nav_/, '');
    const medMellomrom = utenPrefix.replace(/[_-]/g, ' ');
    return medMellomrom.charAt(0).toUpperCase() + medMellomrom.slice(1);
};

const TilgangAccordionItem = ({ tilgang }: { tilgang: Altinn3Tilgang }) => {
    const tittel = tilgang.navn?.nb ?? normaliserRessursId(tilgang.ressursId);
    const beskrivelse = tilgang.beskrivelse?.nb;
    const erEnkeltrettighet =
        tilgang.erEnkeltrettighet ??
        (tilgang.delegertViaRoller.length === 0 && tilgang.delegertViaTilgangspakker.length === 0);

    return (
        <Accordion.Item>
            <Accordion.Header>{tittel}</Accordion.Header>
            <Accordion.Content>
                {beskrivelse != null && beskrivelse.length > 0 && (
                    <BodyLong spacing>{beskrivelse}</BodyLong>
                )}
                <div className="nav-tilganger-tags">
                    {erEnkeltrettighet && (
                        <Tag variant="alt1">Delegert som enkeltrettighet</Tag>
                    )}
                    {tilgang.delegertViaRoller.map((rolle) => (
                        <Tag key={rolle.kode} variant="alt1">
                            Delegert via rollen{' '}
                            {rolle.visningsnavn}
                        </Tag>
                    ))}
                    {tilgang.delegertViaTilgangspakker.map((pakke) => (
                        <Tag key={pakke.id} variant="alt1">
                            Delegert via tilgangspakke {pakke.navn}
                        </Tag>
                    ))}
                </div>
            </Accordion.Content>
        </Accordion.Item>
    );
};

const sorterTilganger = (tilganger: Altinn3Tilgang[]): Altinn3Tilgang[] =>
    [...tilganger].sort((a, b) => {
        const navnA = a.navn?.nb ?? normaliserRessursId(a.ressursId);
        const navnB = b.navn?.nb ?? normaliserRessursId(b.ressursId);
        return navnA.localeCompare(navnB);
    });

const TilgangerAccordion = ({ tilganger }: { tilganger: Altinn3Tilgang[] }) =>
    tilganger.length > 0 ? (
        <Accordion>
            {sorterTilganger(tilganger).map((tilgang) => (
                <TilgangAccordionItem key={tilgang.ressursId} tilgang={tilgang} />
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

const AltinnTilgangerSeksjon = ({ org }: { org: AltinnTilgangOrganisasjon }) => (
    <section className="nav-tilganger-seksjon">
        <Label as="h3">Altinn tilganger</Label>
        <BodyLong spacing>Du har følgende tilganger i Altinn til Navs tjenester.</BodyLong>
        <TilgangerAccordion tilganger={org.altinn3Tilganger} />
    </section>
);

const OrgDetaljer = ({
    org,
    syfotilgang,
}: {
    org: AltinnTilgangOrganisasjon;
    syfotilgang: boolean;
}) => (
    <>
        {syfotilgang && <NærmesteLederSeksjon />}
        <AltinnTilgangerSeksjon org={org} />
    </>
);

const OrgAccordionItem = ({
    org,
    organisasjonsInfo,
}: {
    org: AltinnTilgangOrganisasjon;
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

