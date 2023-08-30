import { useContext } from 'react';
import { OrganisasjonsDetaljerContext } from '../App/OrganisasjonDetaljerProvider';
import useSWR, { SWRResponse } from 'swr';
import { z } from 'zod';
import * as Sentry from '@sentry/browser';

export interface Arbeidsavtale {
    tiltakstype: string;
}

const arbeidsavtaleResponsType = z.array(
    z.object({
        tiltakstype: z.string(),
    })
);

export const useArbeidsavtaler = (): SWRResponse<Array<Arbeidsavtale>, any> => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    const orgnr = valgtOrganisasjon?.organisasjon?.OrganizationNumber;

    const url = `/min-side-arbeidsgiver/tiltaksgjennomforing-api/avtaler/min-side-arbeidsgiver?bedriftNr=${orgnr}`;
    const fetcher = async (url: string) => {
        const respons = await fetch(url);
        return arbeidsavtaleResponsType.parse(await respons.json());
    };

    const respons = useSWR(valgtOrganisasjon !== undefined ? url : null, fetcher);
    const { error } = respons;

    if (error !== undefined) {
        Sentry.captureException(error);
    }

    return respons;
};
