import { gql, TypedDocumentNode, useLazyQuery } from '@apollo/client';
import { useContext, useEffect, useMemo } from 'react';
import { Query } from '../../api/graphql-types';
import { AlertContext } from '../Alerts';
import { SaksoversiktFilterState } from './SaksoversiktProvider';
import { Organisasjon } from '../OrganisasjonerOgTilgangerContext';
import { ServerError } from '@apollo/client/link/utils';
import { flatUtTre } from '../../utils/util';
import { Set } from 'immutable';
import { useOrganisasjonerOgTilgangerContext } from '../OrganisasjonerOgTilgangerContext';

type SakerResultat = Pick<Query, 'saker'>;

const HENT_SAKER: TypedDocumentNode<SakerResultat> = gql`
    query hentSaker(
        $virksomhetsnumre: [String!]!
        $tekstsoek: String
        $sortering: SakSortering!
        $sakstyper: [String!]
        $oppgaveFilter: [OppgaveFilterType!]
        $offset: Int
        $limit: Int
    ) {
        saker(
            virksomhetsnumre: $virksomhetsnumre
            tekstsoek: $tekstsoek
            sortering: $sortering
            sakstyper: $sakstyper
            oppgaveFilter: $oppgaveFilter
            offset: $offset
            limit: $limit
        ) {
            saker {
                id
                merkelapp
                tittel
                tilleggsinformasjon
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
                        lenke
                    }
                    ... on BeskjedTidslinjeElement {
                        id
                        tekst
                        opprettetTidspunkt
                        lenke
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
                        lenke
                    }
                }
            }
            sakstyper {
                navn
                antall
            }
            feilAltinn
            totaltAntallSaker
            oppgaveFilterInfo {
                filterType
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
export const beregnVirksomhetsnummer = (
    organisasjonstre: Organisasjon[],
    virksomheter: Set<string>
): string[] => {
    if (virksomheter.size === 0) {
        return flatUtTre(organisasjonstre).flatMap((organisasjon) => [
            organisasjon.orgnr,
            ...organisasjon.underenheter.map((it) => it.orgnr),
        ]);
    }

    return flatUtTre(organisasjonstre).flatMap((organisasjon) => {
        if (virksomheter.has(organisasjon.orgnr)) {
            const underenheterOrgnr = organisasjon.underenheter.map((it) => it.orgnr);
            const valgteUnderenheter = underenheterOrgnr.filter((it) => virksomheter.has(it));

            if (valgteUnderenheter.length === 0) {
                return [organisasjon.orgnr, ...underenheterOrgnr];
            } else {
                return [organisasjon.orgnr, ...valgteUnderenheter];
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
    { side, tekstsoek, virksomheter, sortering, sakstyper, oppgaveFilter }: SaksoversiktFilterState
) {
    const { organisasjonstre } = useOrganisasjonerOgTilgangerContext();

    const virksomhetsnumre = useMemo(
        () => beregnVirksomhetsnummer(organisasjonstre, virksomheter),
        [organisasjonstre, virksomheter]
    );

    // Dersom brukeren skriver inn 11 siffer (f.eks. fødselsnummer),
    // også med mellomrom/streker, skal vi søke på de første 6 (fødselsdato)
    const mapTekstsoekForBackend = (s: string): string => {
      const digitsOnly = s.replace(/\D/g, '');
      if (digitsOnly.length === 11) {
        const foedselsdato = digitsOnly.substring(0, 6);
        return `${s} ${foedselsdato}`;
      }
      return s;
    };


    const variables = {
        virksomhetsnumre,
        tekstsoek: tekstsoek === '' ? null : mapTekstsoekForBackend(tekstsoek),
        sortering: sortering,
        sakstyper: sakstyper.length === 0 ? null : inkluderInntektsmelding(sakstyper),
        oppgaveFilter: oppgaveFilter.length === 0 ? null : oppgaveFilter,
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
        JSON.stringify(oppgaveFilter),
        error,
    ]);

    const { setSystemAlert } = useContext(AlertContext);
    const feilAltinn = data?.saker.feilAltinn ?? false;
    useEffect(() => {
        setSystemAlert('SakerAltinn', feilAltinn);
    }, [feilAltinn]);

    return { loading, data, previousData };
}
