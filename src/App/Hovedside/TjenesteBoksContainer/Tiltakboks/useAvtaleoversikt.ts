import { useContext, useMemo } from 'react';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import useSWR from 'swr';
import { z } from 'zod';
import * as Sentry from '@sentry/browser';
import { count } from '../../../../utils/util';

export type Avtaleoversikt = {
    ARBEIDSTRENING: number;
    MIDLERTIDIG_LONNSTILSKUDD: number;
    VARIG_LONNSTILSKUDD: number;
    SOMMERJOBB: number;
    INKLUDERINGSTILSKUDD: number;
    MENTOR: number;
};

export type Avtalenavn = keyof Avtaleoversikt;

export const useAvtaleoversikt = (): Avtaleoversikt => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    const { data: avtaler = [] } = useSWR(
        valgtOrganisasjon !== undefined
            ? `/min-side-arbeidsgiver/tiltaksgjennomforing-api/avtaler/min-side-arbeidsgiver?bedriftNr=${valgtOrganisasjon.organisasjon.OrganizationNumber}`
            : null,
        fetcher
    );

    return useMemo(
        () => ({
            ARBEIDSTRENING: antallAvtaler(avtaler, 'ARBEIDSTRENING'),
            MIDLERTIDIG_LONNSTILSKUDD: antallAvtaler(avtaler, 'MIDLERTIDIG_LONNSTILSKUDD'),
            VARIG_LONNSTILSKUDD: antallAvtaler(avtaler, 'VARIG_LONNSTILSKUDD'),
            SOMMERJOBB: antallAvtaler(avtaler, 'SOMMERJOBB'),
            INKLUDERINGSTILSKUDD: antallAvtaler(avtaler, 'INKLUDERINGSTILSKUDD'),
            MENTOR: antallAvtaler(avtaler, 'MENTOR'),
        }),
        [avtaler]
    );
};

const antallAvtaler = (avtaler: Arbeidsavtale[], tiltaktype: Avtalenavn) =>
    count(avtaler, (it) => it.tiltakstype === tiltaktype);

interface Arbeidsavtale {
    tiltakstype: string;
}

const arbeidsavtaleResponsType = z.array(
    z.object({
        tiltakstype: z.string(),
    })
);

const fetcher = async (url: string) => {
    try {
        const respons = await fetch(url);
        if (respons.ok) {
            return arbeidsavtaleResponsType.parse(await respons.json());
        }
    } catch (error) {
        Sentry.captureException(error);
    }
    return arbeidsavtaleResponsType.parse([]);
};
