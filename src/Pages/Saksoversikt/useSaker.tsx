import { gql, TypedDocumentNode, useLazyQuery } from '@apollo/client';
import { useContext, useEffect, useMemo } from 'react';
import { Query } from '../../api/graphql-types';
import { AlertContext } from '../Alerts';
import { Filter } from './useOversiktStateTransitions';
import { Set } from 'immutable';
import {
    OrganisasjonEnhet,
    OrganisasjonerOgTilgangerContext,
} from '../OrganisasjonerOgTilgangerProvider';
import { ServerError } from '@apollo/client/link/utils';

type SakerResultat = Pick<Query, 'saker'>;

const HENT_SAKER: TypedDocumentNode<SakerResultat> = gql`
    query hentSaker(
        $virksomhetsnumre: [String!]!
        $tekstsoek: String
        $sortering: SakSortering!
        $sakstyper: [String!]
        $oppgaveTilstand: [OppgaveTilstand!]
        $offset: Int
        $limit: Int
    ) {
        saker(
            virksomhetsnumre: $virksomhetsnumre
            tekstsoek: $tekstsoek
            sortering: $sortering
            sakstyper: $sakstyper
            oppgaveTilstand: $oppgaveTilstand
            offset: $offset
            limit: $limit
        ) {
            saker {
                id
                merkelapp
                tittel
                lenke
                virksomhet {
                    navn
                    virksomhetsnummer
                }
                sisteStatus {
                    type
                    tekst
                    tidspunkt
                }
                nesteSteg
                tidslinje {
                    __typename
                    ... on OppgaveTidslinjeElement {
                        id
                        tekst
                        tilstand
                        frist
                        opprettetTidspunkt
                        paaminnelseTidspunkt
                        utfoertTidspunkt
                        utgaattTidspunkt
                    }
                    ... on BeskjedTidslinjeElement {
                        id
                        tekst
                        opprettetTidspunkt
                    }
                    ... on KalenderavtaleTidslinjeElement {
                        id
                        tekst
                        avtaletilstand
                        startTidspunkt
                        sluttTidspunkt
                        lokasjon {
                            adresse
                            postnummer
                            postnummer
                        }
                        digitalt
                    }
                }
            }
            sakstyper {
                navn
                antall
            }
            feilAltinn
            totaltAntallSaker
            oppgaveTilstandInfo {
                tilstand
                antall
            }
        }
    }
`;

/**
 * for hovedenheter H:
 *  hvis existerer valg underenhet, ignorer H
 *  ellers, legg til alle H.underenheter
 *
 *  [X] H
 *     [ ] U1
 *     [ ] U2
 * internal = { H }
 * extendal = { H, U1, U2 }
 *
 *  [X] H
 *     [X] U1
 *     [ ] U2
 * internal = { H, U1 }
 * external = { H, U1 }
 */
const beregnVirksomhetsnummer = (
    organisasjonstre: OrganisasjonEnhet[],
    virksomheter: Set<string>
): string[] => {
    if (virksomheter.isEmpty()) {
        return organisasjonstre.flatMap(({ underenheter }) =>
            underenheter.map((it) => it.OrganizationNumber)
        );
    }

    return organisasjonstre.flatMap(({ hovedenhet, underenheter }) => {
        if (virksomheter.has(hovedenhet.OrganizationNumber)) {
            const underenheterOrgnr = underenheter.map((it) => it.OrganizationNumber);
            const valgteUnderenheter = underenheterOrgnr.filter((it) => virksomheter.has(it));
            if (valgteUnderenheter.length === 0) {
                return underenheterOrgnr;
            } else {
                return valgteUnderenheter;
            }
        } else {
            return [];
        }
    });
};

/**
 * TAG-2253 - Inkluder inntektsmelding i sakstyper hvis Inntektsmelding sykepenger er valgt
 * Fjernes når det ikke lengre finnes saker med "Inntektsmelding" som merkelapp
 */
const inkluderInntektsmelding = (sakstyper: string[]) => {
    const inntektsmeldingSykepengerValgt = sakstyper.includes('Inntektsmelding sykepenger');
    return [...sakstyper, ...(inntektsmeldingSykepengerValgt ? ['Inntektsmelding'] : [])];
};

export function useSaker(
    pageSize: number,
    { side, tekstsoek, virksomheter, sortering, sakstyper, oppgaveTilstand }: Filter
) {
    const { organisasjonstre } = useContext(OrganisasjonerOgTilgangerContext);

    const virksomhetsnumre = useMemo(
        () => beregnVirksomhetsnummer(organisasjonstre, virksomheter),
        [organisasjonstre, virksomheter]
    );

    const variables = {
        virksomhetsnumre,
        tekstsoek: tekstsoek === '' ? null : tekstsoek,
        sortering: sortering,
        sakstyper: sakstyper.length === 0 ? null : inkluderInntektsmelding(sakstyper),
        oppgaveTilstand: oppgaveTilstand.length === 0 ? null : oppgaveTilstand,
        offset: ((side ?? 0) - 1) * pageSize /* if undefined, we should not send */,
        limit: pageSize,
    };

    const [fetchSaker, { loading, data, error, previousData }] = useLazyQuery(HENT_SAKER, {
        variables,
    });

    useEffect(() => {
        if (error) {
            if ((error.networkError as ServerError)?.statusCode !== 401) {
                console.error('#MSA: fetchSaker feilet', error);
            }
            return;
        }

        if (side !== undefined) {
            fetchSaker({ variables })
                .then((_) => {
                    /* effect is seen in return of useLazyQuery */
                })
                .catch((error) => {
                    console.error('#MSA: fetchSaker feilet', error);
                });
        }
    }, [
        JSON.stringify(virksomhetsnumre),
        tekstsoek,
        side,
        sortering,
        JSON.stringify(sakstyper),
        JSON.stringify(oppgaveTilstand),
        error,
    ]);

    const { setSystemAlert } = useContext(AlertContext);
    const feilAltinn = data?.saker.feilAltinn ?? false;
    useEffect(() => {
        setSystemAlert('SakerAltinn', feilAltinn);
    }, [feilAltinn]);

    return { loading, data, previousData };
}
