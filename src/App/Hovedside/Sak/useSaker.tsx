import { gql, TypedDocumentNode, useLazyQuery } from '@apollo/client';
import React, {useContext, useEffect} from 'react';
import * as Sentry from '@sentry/react';
import { Query } from '../../../api/graphql-types';
import {AlertContext} from "../../Alerts/Alerts";
import { Filter } from './Saksoversikt/useOversiktStateTransitions';

type SakerResultat = Pick<Query, "saker">

const HENT_SAKER: TypedDocumentNode<SakerResultat> = gql`
    query hentSaker($virksomhetsnumre: [String!]!, $tekstsoek: String, $sortering: SakSortering!, $offset: Int, $limit: Int) {
        saker(virksomhetsnumre: $virksomhetsnumre, tekstsoek: $tekstsoek, sortering: $sortering, offset: $offset, limit: $limit) {
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
                frister
                oppgaver {
                    tilstand
                    paaminnelseTidspunkt
                    frist
                }
            }
            feilAltinn
            totaltAntallSaker
        }
    }
`

export function useSaker(
    pageSize: number,
    {side, tekstsoek, virksomhetsnumre, sortering}: Filter,
) {
    const variables = {
        virksomhetsnumre: virksomhetsnumre,
        tekstsoek: (tekstsoek === "") ? null : tekstsoek,
        sortering: sortering,
        offset: ((side ?? 0) - 1) * pageSize, /* if undefined, we should not send */
        limit: pageSize
    }

    const [fetchSaker, {loading, data, error, previousData}] = useLazyQuery(HENT_SAKER,  {
        variables
    })

    useEffect(() => {
        if (error) {
            Sentry.captureException(error)
            return
        }

        if (virksomhetsnumre !== undefined && side !== undefined) {
            fetchSaker({ variables })
                .then(_ => { /* effect is seen in return of useLazyQuery */ })
                .catch(Sentry.captureException);
        }

    }, [JSON.stringify(virksomhetsnumre), tekstsoek, side, sortering, error])

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

