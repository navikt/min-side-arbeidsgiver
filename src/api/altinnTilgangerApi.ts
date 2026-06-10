import useSWR from 'swr';
import { erStøy } from '../utils/util';
import {
    AltinnTilgangOrganisasjon,
    AltinnTilgangerResponse,
    AltinnTilgangerResponseSchema,
} from './altinnTilgangerSchema';

export const useAltinnTilganger = (): {
    data: AltinnTilgangerResponse | undefined;
    isLoading: boolean;
} => {
    const { data, isLoading } = useSWR(`${__BASE_PATH__}/api/altinn-tilganger`, fetcher, {
        onError: (error) => {
            if (!erStøy(error)) {
                console.error(
                    `#FARO: hent altinn-tilganger fra min-side-arbeidsgiver-api feilet med ${
                        error.status !== undefined ? `${error.status} ${error.statusText}` : error
                    }`
                );
            }
        },
    });

    return {
        data,
        isLoading,
    };
};

const fetcher = async (url: string) => {
    const respons = await fetch(url, { method: 'POST' });
    if (!respons.ok) throw respons;
    return AltinnTilgangerResponseSchema.parse(await respons.json());
};

export const finnOrganisasjonIHierarki = (
    organisasjoner: AltinnTilgangOrganisasjon[],
    orgnr: string
): AltinnTilgangOrganisasjon | undefined => {
    for (const organisasjon of organisasjoner) {
        if (organisasjon.orgnr === orgnr) {
            return organisasjon;
        }

        const underenhet = finnOrganisasjonIHierarki(organisasjon.underenheter, orgnr);
        if (underenhet !== undefined) {
            return underenhet;
        }
    }

    return undefined;
};
