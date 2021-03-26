import {ApolloClient, InMemoryCache, gql, ApolloProvider} from '@apollo/client';
import {Beskjed} from './graphql-types';
import environment from '../utils/environment'
import {inkluderVarslerFeatureToggle} from "../FeatureToggleProvider";
import {FC} from "react";

const createClient = () => new ApolloClient({
    uri: environment.BRUKER_API_URL ?? '/api/graphql',
    cache: new InMemoryCache()
});


export const ToggledApolloProvider : FC = ({children}) => {
    if (inkluderVarslerFeatureToggle) {
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
            ... on Beskjed {
                tekst
                lenke
                merkelapp
                opprettetTidspunkt
            }
        }
    }
`;
