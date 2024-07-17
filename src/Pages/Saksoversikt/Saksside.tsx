import './Saksside.css';
import { useEffect } from 'react';
import { InternLenkeMedLogging } from '../../GeneriskeElementer/LenkeMedLogging';
import { ChevronLeftIcon } from '@navikt/aksel-icons';
import { useSearchParams } from 'react-router-dom';
import { gql, TypedDocumentNode, useQuery } from '@apollo/client';
import { SakResultat } from '../../api/graphql-types';
import { SakPanel } from './SakPanel';
import { Alert, Heading } from '@navikt/ds-react';
import { useSessionStorage } from '../../hooks/useStorage';

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
                merkelapp
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
                nesteSteg
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
        }
    }
`;

const HENT_SAK_GRUPPERINGSID: TypedDocumentNode<SakQueryResponse> = gql`
    query HENT_SAK_GRUPPERINGSID($merkelapp: String!, $grupperingsid: String!) {
        sakByGrupperingsid(merkelapp: $merkelapp, grupperingsid: $grupperingsid) {
            feilAltinn
            sak {
                merkelapp
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
                nesteSteg
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

type Sakssideparametre = {
    saksid?: string;
    grupperingsid?: string;
    merkelapp?: string;
};

export const Saksside = () => {
    const [params, setParams] = useSearchParams();
    const [saksidparametre, setSaksidparametre] = useSessionStorage<Sakssideparametre>(
        'sakssideparametre',
        Object.fromEntries(params)
    );

    useEffect(() => {
        if (params.size === 0) return;

        const { saksid, grupperingsid, merkelapp } = Object.fromEntries(params);
        if (saksid !== undefined) {
            setSaksidparametre({ saksid });
        } else if (grupperingsid !== undefined && merkelapp !== undefined) {
            setSaksidparametre({ grupperingsid, merkelapp });
        }

        setParams({}, { replace: true });
    }, [params]);

    const { saksid, grupperingsid, merkelapp } = saksidparametre;
    const skip = saksid === undefined && merkelapp === undefined && grupperingsid === undefined;

    const { loading, data, error } = useQuery(
        saksid !== undefined ? HENT_SAK_ID : HENT_SAK_GRUPPERINGSID,
        {
            variables: { id: saksid, merkelapp: merkelapp, grupperingsid: grupperingsid },
            skip,
        }
    );

    const sak = data?.sakById?.sak ?? data?.sakByGrupperingsid?.sak;
    const feilIAltinn = data?.sakById?.feilAltinn ?? data?.sakByGrupperingsid?.feilAltinn ?? false;

    useEffect(() => {
        if (!sak && !skip && !loading && !feilIAltinn) {
            console.error(
                `#MSA: Saksside: Kunne ikke hente sak. Saksid: ${saksid}, merkelapp: ${merkelapp}. Apollo error: ${error?.message}`
            );
        }
    }, [sak, skip, loading, feilIAltinn]);

    if (loading || skip) return null;

    return (
        <div className="saksside">
            <InternLenkeMedLogging loggLenketekst="#/" href="saksoversikt">
                <ChevronLeftIcon width="2rem" height="2rem" aria-hidden={true} />
                Se alle saker
            </InternLenkeMedLogging>

            {!sak ? (
                <Alert variant="error">
                    <Heading size="small" level="2">
                        Noe gikk galt
                    </Heading>
                    Vi jobber med å løse problemet
                </Alert>
            ) : (
                <div className="saksside_sak">
                    {<SakPanel tvingEkspander={true} lenkeTilSak={false} sak={sak} />}
                </div>
            )}
        </div>
    );
};
