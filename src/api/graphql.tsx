import {ApolloClient, InMemoryCache, gql, ApolloProvider} from '@apollo/client';
import {Beskjed} from './graphql-types';
import {inkluderNotifikasjonerFeatureToggle} from "../FeatureToggleProvider";
import {FC} from "react";
import { basename } from '../paths';

const createClient = () => new ApolloClient({
    uri: `${basename}/notifikasjon/api/graphql`,
    cache: new InMemoryCache()
});

export const ToggledApolloProvider : FC = ({children}) => {
    if (inkluderNotifikasjonerFeatureToggle) {
        return <ApolloProvider client={createClient()}>{children}</ApolloProvider>;
    } else {
        return <>{children}</>
    }
}


export interface HentNotifikasjonerData {
    notifikasjoner: Beskjed[];
}

export const HENT_NOTIFIKASJONER = gql`
    query hentNotifikasjoner {
        notifikasjoner {
            __typename
            ...on Beskjed {
                brukerKlikk {
                    id
                    klikketPaa
                }
                virksomhet {
                    navn
                    virksomhetsnummer
                }
                lenke
                tekst
                merkelapp
                opprettetTidspunkt
                id
            }
            ...on Oppgave {
                brukerKlikk {
                    id
                    klikketPaa
                }
                virksomhet {
                    navn
                    virksomhetsnummer
                }
                lenke
                tekst
                merkelapp
                opprettetTidspunkt
                tilstand
                id
            }
        }
    }
`;

export const NOTIFIKASJONER_KLIKKET_PAA = gql`
    mutation NotifikasjonKlikketPaa($id: ID!) {
        notifikasjonKlikketPaa(id: $id) {
            ... on BrukerKlikk {
                id
                klikketPaa
            }
            ... on UgyldigId {
                feilmelding
            }
        }
    }
`;
