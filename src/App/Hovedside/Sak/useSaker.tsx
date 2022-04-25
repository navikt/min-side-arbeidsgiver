import { gql, TypedDocumentNode, useLazyQuery } from '@apollo/client';
import React, {useContext, useEffect} from 'react';
import * as Sentry from '@sentry/react';
import { GQL } from '@navikt/arbeidsgiver-notifikasjon-widget';
import {AlertContext} from "../../Alerts/Alerts";

export type Filter = {
    tekstsoek: string,
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

export function useSaker(pageSize: number, side: number|undefined, {tekstsoek, virksomhetsnummer}: Filter) {
    const variables = {
        virksomhetsnummer: virksomhetsnummer,
        tekstsoek: (tekstsoek === "") ? null : tekstsoek,
        offset: ((side ?? 0) - 1) * pageSize, /* if undefined, we should not send */
        limit: pageSize
    }

    const [fetchSaker, {loading, data, previousData}] = useLazyQuery(HENT_SAKER,  {
        fetchPolicy: "network-only", /* TODO: Fix caching */
        variables
    })

    useEffect(() => {
        if (virksomhetsnummer !== null && side !== undefined) {
            fetchSaker({ variables })
                .then(_ => { /* effect is seen in return of useLazyQuery */ })
                .catch(Sentry.captureException);
        }

    }, [virksomhetsnummer, tekstsoek, side])

    const {addAlert, clearAlert} = useContext(AlertContext);

    useEffect(()=>{
        if(data?.saker.feilAltinn ?? false) {
            addAlert("Saker");
        } else {
            clearAlert("Saker");
        }
    }, [data])
    return {loading, data, previousData}
}

