import { gql, TypedDocumentNode, useLazyQuery } from '@apollo/client';
import { useEffect } from 'react';
import * as Sentry from '@sentry/react';
import { GQL } from '@navikt/arbeidsgiver-notifikasjon-widget';

export type filter = {
    tekstsoek?: string | null,
    side?: number,
    virksomhetsnummer: string | null
}

const HENT_SAKER: TypedDocumentNode<Pick<GQL.Query, "saker">> = gql`
    query hentSaker($virksomhetsnummer: String!, $tekstsoek: String, $offset: Int, $limit: Int) {
        saker(virksomhetsnummer: $virksomhetsnummer, tekstsoek: $tekstsoek, offset: $offset, limit: $limit) {
            saker {
                id
                tittel
                lenke
                merkelapp
                virksomhet {
                    navn
                    virksomhetsnummer
                }
                sisteStatus {
                    type
                    tekst
                    tidspunkt
                }
            }
            feilAltinn
            totaltAntallSaker
        }
    }
`

export function useSaker(pageSize: number, {tekstsoek, side = 1, virksomhetsnummer} : filter) {
    const variables = {
        virksomhetsnummer,
        tekstsoek: (tekstsoek ?? "") !== "" ? null : tekstsoek,
        offset: (side - 1) * pageSize,
        limit: pageSize
    }

    const [fetchSaker, {loading, data, previousData}] = useLazyQuery(HENT_SAKER,  {
        fetchPolicy: "network-only", /* TODO: Fix caching */
        variables
    })

    useEffect(()=>{
        if (virksomhetsnummer !== null) {
            fetchSaker({ variables })
                .then(_ => {})
                .catch(Sentry.captureException);
        }

    }, [virksomhetsnummer, tekstsoek, side])

    return {loading, data, previousData}
}

