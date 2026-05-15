import React, { FunctionComponent, useMemo, useState } from 'react';
import { finnOrganisasjonIHierarki, useAltinnTilganger } from '../../api/altinnTilgangerApi';
import { Altinn3Tilgang, AltinnTilgangOrganisasjon } from '../../api/altinnTilgangerSchema';
import { useOrganisasjonsDetaljerContext } from '../OrganisasjonsDetaljerContext';
import './NavTilganger.css';
import {
    Accordion,
    Alert,
    BodyLong,
    Box,
    Button,
    Detail,
    Heading,
    Label,
    Link,
    List,
    Loader,
    Tag,
    Tooltip,
    VStack,
} from '@navikt/ds-react';
import { CheckmarkCircleFillIcon, CheckmarkIcon, ClipboardIcon } from '@navikt/aksel-icons';
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
                    {erEnkeltrettighet && <Tag variant="alt1">Delegert som enkelttjeneste</Tag>}
                    {tilgang.delegertViaRoller.map((rolle) => (
                        <Tag key={rolle.kode} variant="alt1">
                            Delegert via rollen {rolle.visningsnavn}
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
            <CheckmarkCircleFillIcon className="nav-tilganger-nærmeste-leder-ikon" aria-hidden />
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

const KopierTilgangerKnapp = ({ org }: { org: AltinnTilgangOrganisasjon }) => {
    const [kopiert, setKopiert] = useState(false);

    const kopier = async () => {
        await navigator.clipboard.writeText(JSON.stringify(org, null, 2));
        setKopiert(true);
        setTimeout(() => setKopiert(false), 2000);
    };

    return (
        <Tooltip content={kopiert ? 'Kopiert!' : 'Kopier tilganger som JSON'}>
            <Button
                variant="tertiary-neutral"
                size="small"
                icon={kopiert ? <CheckmarkIcon aria-hidden /> : <ClipboardIcon aria-hidden />}
                onClick={kopier}
                aria-label="Kopier tilganger som JSON"
                className="nav-tilganger-kopier-knapp"
            />
        </Tooltip>
    );
};

const AlertHvisEnkeltrettighetDelegertOverORGL = ({
    hierarki,
}: {
    hierarki: AltinnTilgangOrganisasjon[];
}) => {
    const harOrglUnderenheter = (org: AltinnTilgangOrganisasjon) =>
        org.underenheter.some(({ organisasjonsform }) => organisasjonsform === 'ORGL');
    const harEnkelttjenesteDelegering = (org: AltinnTilgangOrganisasjon) =>
        org.altinn3Tilganger.some((t) => t.erEnkeltrettighet === true);

    const detaljer = hierarki
        .filter((o) => harOrglUnderenheter(o) && harEnkelttjenesteDelegering(o))
        .map((o) => ({
            tittel: `${o.navn} (${o.orgnr})`,
            tilgangerTekst: o.altinn3Tilganger
                .filter((e) => e.erEnkeltrettighet || true)
                .map((t) => t.navn?.nb)
                .filter(Boolean)
                .join(', '),
        }));

    return detaljer.length > 0 ? (
        <Alert variant="warning" className="nav-tilganger-varsel">
            Du har en eller flere Nav-tilganger delegert på et nivå som ikke fungerer for
            virksomheter i organisasjoner med organisasjonsledd. Be den som ga deg tilgangen om å
            delegere på nytt – på organisasjonsleddet eller direkte på virksomheten. Dette er en
            kjent begrensning i Altinn.
            <List as="ul">
                {detaljer.map(({ tittel, tilgangerTekst }) => (
                    <List.Item title={tittel} key={tittel}>
                        {tilgangerTekst}
                    </List.Item>
                ))}
            </List>
        </Alert>
    ) : null;
};

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
                <Alert variant="info" className="nav-tilganger-varsel">
                    Det kan ta opptil 20 minutter før endringer i tilganger vises her.
                </Alert>
                <AlertHvisEnkeltrettighetDelegertOverORGL
                    hierarki={altinnTilganger?.hierarki ?? []}
                />

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
                                <div className="nav-tilganger-heading-rad">
                                    <Heading level="2" size="medium">
                                        {valgtOrganisasjon.organisasjon.navn}
                                    </Heading>
                                    {!isLoading && organisasjon !== undefined && (
                                        <KopierTilgangerKnapp org={organisasjon} />
                                    )}
                                </div>
                                <Detail textColor="subtle">
                                    {valgtOrganisasjon.organisasjon.orgnr}
                                </Detail>
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
