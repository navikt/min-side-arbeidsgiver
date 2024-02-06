import './Kalenderavtaler.css';
import React, { FunctionComponent } from 'react';
import { BodyShort, Button, Heading, Tag } from '@navikt/ds-react';
import {
    ChevronDownIcon,
    ChevronRightIcon,
    ChevronUpIcon,
    LocationPinIcon,
    PersonHeadsetIcon,
} from '@navikt/aksel-icons';
import { Adresse, KalenderAvtaleTilstand, Query } from '../../api/graphql-types';
import { gql, TypedDocumentNode, useQuery } from '@apollo/client';

const HENT_KALENDERAVTALER: TypedDocumentNode<Pick<Query, 'kommendeKalenderAvtaler'>> = gql`
    query HentKalenderavtaler($virksomhetsnumre: [String!]!) {
        kommendeKalenderAvtaler(virksomhetsnumre: $virksomhetsnumre) {
            avtaler {
                id
                tekst
                startTidspunkt
                sluttTidspunkt
                tilstand
                lenke
            }
        }
    }
`;

const VIS_ANTALL = 2;

export const Kalenderavtaler: FunctionComponent = () => {
    const [visAlle, settVisAlle] = React.useState(false);
    const { data, loading, error } = useQuery(HENT_KALENDERAVTALER, {
        variables: { virksomhetsnumre: ['123456789'] },
    });
    if (loading) {
        return null;
    }
    if (error) {
        return null;
    }

    const avtaler =
        data?.kommendeKalenderAvtaler.avtaler!.filter(
            (avtale) => avtale.tilstand !== KalenderAvtaleTilstand.Avlyst
        ) ?? [];

    return (
        <>
            <Heading level="2" size="medium" className="saksoversikt__skjult-header-uu">
                Kalenderavtaler
            </Heading>
            <div className="kalenderavtaler">
                {avtaler.map((avtale, index) => {
                    if (index < VIS_ANTALL || visAlle)
                        return (
                            <Kalenderavtale
                                key={avtale.id}
                                tekst={avtale.tekst}
                                startTidspunkt={new Date(avtale.startTidspunkt)}
                                sluttTidspunkt={
                                    avtale.sluttTidspunkt !== null &&
                                    avtale.sluttTidspunkt !== undefined
                                        ? new Date(avtale.sluttTidspunkt)
                                        : undefined
                                }
                                tilstand={avtale.tilstand}
                                lenke={avtale.lenke}
                            />
                        );
                })}
            </div>
            <div>
                {avtaler.length > VIS_ANTALL && (
                    <Button
                        variant="tertiary"
                        size="small"
                        className="kalenderavtaler_se-alle"
                        onClick={() => settVisAlle(!visAlle)}
                        icon={
                            visAlle ? (
                                <ChevronUpIcon aria-hidden />
                            ) : (
                                <ChevronDownIcon aria-hidden />
                            )
                        }
                    >
                        <BodyShort>Vis {visAlle ? 'færre' : 'alle kommende'} avtaler</BodyShort>
                    </Button>
                )}
            </div>
        </>
    );
};

type Kalenderavtale = {
    tekst: string;
    startTidspunkt: Date;
    sluttTidspunkt?: Date;
    tilstand: KalenderAvtaleTilstand;
    lenke: string;
};

const Kalenderavtale: FunctionComponent<Kalenderavtale> = ({
    tekst,
    startTidspunkt,
    sluttTidspunkt,
    tilstand,
    lenke,
}) => {
    return (
        <a className="kalenderavtale" href={lenke}>
            <BodyShort className="kalenderavtaler_tittel" size="large">
                {tekst}
            </BodyShort>
            <span className="kalenderavtaler_linje" />
            <ChevronRightIcon
                width="2rem"
                height="2rem"
                aria-hidden={true}
                className="kalenderavtaler_chevron"
            />
            <Tidsformat startTidspunkt={startTidspunkt} sluttTidspunkt={sluttTidspunkt} />
            <div className="kalenderavtale_statussted">
                <Statustag tilstand={tilstand} />
                {/*<Sted sted={fysisk} digitalt={digitalt} />*/}
            </div>
        </a>
    );
};

type Tidspunkt = {
    startTidspunkt: Date;
    sluttTidspunkt?: Date;
};

const startTidspunktFormat = new Intl.DateTimeFormat('no', {
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
});

const sluttTidsunktFormat = new Intl.DateTimeFormat('no', {
    hour: 'numeric',
    minute: 'numeric',
});

const Tidsformat = ({ startTidspunkt, sluttTidspunkt }: Tidspunkt) => (
    <BodyShort size="large" className="kalenderavtale_tidspunkt">
        {`${startTidspunktFormat.format(startTidspunkt)} ${
            sluttTidspunkt !== undefined ? `– ${sluttTidsunktFormat.format(sluttTidspunkt)}` : ''
        }`}
    </BodyShort>
);

type Statustag = {
    tilstand: KalenderAvtaleTilstand;
};

const Statustag = ({ tilstand }: Statustag) => {
    switch (tilstand) {
        case KalenderAvtaleTilstand.ArbeidsgiverHarGodtatt:
            return (
                <Tag size="small" variant="success-moderate">
                    Du har takket ja
                </Tag>
            );
        case KalenderAvtaleTilstand.VenterSvarFraArbeidsgiver:
            return (
                <Tag size="small" variant="warning-moderate">
                    Svar på invitasjonen
                </Tag>
            );
        case KalenderAvtaleTilstand.ArbeidsgiverVilAvlyse:
            return (
                <Tag size="small" variant="neutral-moderate">
                    Du ønsker å avlyse
                </Tag>
            );
        case KalenderAvtaleTilstand.ArbeidsgiverVilEndreTidEllerSted:
            return (
                <Tag size="small" variant="neutral-moderate">
                    Du ønsker å endre tid eller sted
                </Tag>
            );
        case KalenderAvtaleTilstand.Avlyst:
            return (
                <Tag size="small" variant="error-moderate">
                    Møtet er avlyst
                </Tag>
            );
        default:
            return null;
    }
};

type Sted = {
    sted?: Adresse;
    digitalt: boolean;
};

const Sted = ({ sted, digitalt }: Sted) => (
    <div className="kalenderavtale_sted">
        {sted !== undefined ? (
            <>
                <LocationPinIcon aria-hidden={true} fontSize="1.5rem" />
                <BodyShort size="small">
                    {' '}
                    {`${sted.adresse} ${sted.postnummer} ${sted.poststed}`}
                </BodyShort>
            </>
        ) : digitalt ? (
            <>
                <PersonHeadsetIcon aria-hidden={true} fontSize="1.5rem" />{' '}
                <BodyShort size="small"> Digital avtale </BodyShort>
            </>
        ) : null}
    </div>
);
