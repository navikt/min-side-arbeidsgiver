import './Saksside.css';
import React, { useEffect } from 'react';
import { LenkeMedLogging } from '../../GeneriskeElementer/LenkeMedLogging';
import { ChevronLeftIcon } from '@navikt/aksel-icons';
import { useSearchParams } from 'react-router-dom';
import { gql, TypedDocumentNode, useQuery } from '@apollo/client';
import { SakResultat } from '../../api/graphql-types';
import { SakPanel } from './SakPanel';
import { Alert, Heading } from '@navikt/ds-react';
import * as Sentry from '@sentry/browser';

/**
 * Denne typen trengs for at useQuery skal forstå at vi kan få både sakById og sakByGrupperingsid
 */
type SakQueryResponse = {
    sakById?: SakResultat;
    sakByGrupperingsid?: SakResultat;
};

const HENT_SAK_ID: TypedDocumentNode<SakQueryResponse> = gql`
    query HENT_SAK_ID($id: ID!) {
        sakById(id: $id) {
            feilAltinn
            sak {
                tittel
                lenke
                tittel
                virksomhet {
                    navn
                    virksomhetsnummer
                }
                sisteStatus {
                    tidspunkt
                }
                tidslinje {
                    ... on OppgaveTidslinjeElement {
                        id
                        tekst
                        opprettetTidspunkt
                        tilstand
                        paaminnelseTidspunkt
                        utgaattTidspunkt
                        utfoertTidspunkt
                        frist
                        tilstand
                    }
                    ... on BeskjedTidslinjeElement {
                        id
                        tekst
                        opprettetTidspunkt
                    }
                }
            }
        }
    }
`;

const HENT_SAK_GRUPPERINGSID: TypedDocumentNode<SakQueryResponse> = gql`
    query HENT_SAK_GRUPPERINGSID($merkelapp: String!, $grupperingsid: String!) {
        sakByGrupperingsid(merkelapp: $merkelapp, grupperingsid: $grupperingsid) {
            feilAltinn
            sak {
                tittel
                lenke
                tittel
                virksomhet {
                    navn
                    virksomhetsnummer
                }
                sisteStatus {
                    tidspunkt
                }
                tidslinje {
                    ... on OppgaveTidslinjeElement {
                        id
                        tekst
                        opprettetTidspunkt
                        tilstand
                        paaminnelseTidspunkt
                        utgaattTidspunkt
                        utfoertTidspunkt
                        frist
                        tilstand
                    }
                    ... on BeskjedTidslinjeElement {
                        id
                        tekst
                        opprettetTidspunkt
                    }
                }
            }
        }
    }
`;

export const Saksside = () => {
    const [params, setParams] = useSearchParams();
    const saksid = params.get('saksid');
    const merkelapp = params.get('merkelapp');
    const grupperingsid = params.get('grupperingsid');

    const skip = saksid === null && (merkelapp === null || grupperingsid === null);

    const { loading, data, error } = useQuery(
        saksid !== null ? HENT_SAK_ID : HENT_SAK_GRUPPERINGSID,
        {
            variables: { id: saksid, merkelapp: merkelapp, grupperingsid: grupperingsid },
            skip,
        }
    );

    const sak = data?.sakById?.sak ?? data?.sakByGrupperingsid?.sak;
    const feilIAltinn = data?.sakById?.feilAltinn ?? data?.sakByGrupperingsid?.feilAltinn ?? false;

    const harFeil = sak === undefined || sak === null;

    useEffect(() => {
        if (harFeil && !loading && !feilIAltinn) {
            Sentry.captureMessage(
                `Saksside: Kunne ikke hente sak. Saksid: ${saksid}, merkelapp: ${merkelapp}. Apollo error: ${error?.message}`
            );
        }
    }, [harFeil, loading, feilIAltinn]);

    if (loading) return null;

    return (
        <div className="saksside">
            <LenkeMedLogging loggLenketekst="#/" href="saksoversikt">
                <ChevronLeftIcon width="2rem" height="2rem" aria-hidden={true} />
                Se alle saker
            </LenkeMedLogging>

            {harFeil ? (
                <Alert variant="error">
                    <Heading size="small" level="2">
                        Noe gikk galt
                    </Heading>
                    Vi jobber med å løse problemet
                </Alert>
            ) : (
                <div className="saksside_sak">{<SakPanel saksside={true} sak={sak} />}</div>
            )}
        </div>
    );
};
