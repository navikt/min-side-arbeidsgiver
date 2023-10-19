import React from 'react';
import { arbeidsplassenURL } from '../../../../lenker';
import PamboksIkon from './pamboks-ikon.svg';
import './Pamboks.css';
import { Tjenesteboks } from '../Tjenesteboks';
import { z } from 'zod';
import useSWR from 'swr';
import * as Sentry from '@sentry/browser';
import { useContext } from 'react';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';

const Pamboks = () => {
    const antallAnnonser = useAntallannonser();

    return (
        <Tjenesteboks
            ikon={PamboksIkon}
            href={arbeidsplassenURL}
            tittel={'Rekruttere på arbeidsplassen.no'}
            aria-label={
                'Rekruttere på arbeidsplassen.no, ' +
                (antallAnnonser > 0
                    ? `Stillingsannonser ( ${antallAnnonser} aktive)`
                    : 'Lag ny stillingsannonse') +
                ' og lag et jobbtreff'
            }
        >
            {antallAnnonser > 0 ? (
                <div className={'pamboks__bunntekst'}>
                    <span>
                        {' '}
                        <span className={'pamboks__antall'}>{antallAnnonser}</span>
                        {antallAnnonser > 1
                            ? 'stillingsannonser (aktive)'
                            : 'stillingsannonse (aktiv)'}
                    </span>
                    <div className={'pamboks__bunntekst'}>Lag et jobbtreff</div>
                </div>
            ) : (
                <>
                    Lag et jobbtreff
                    <br />
                    Lag en stillingsannonse
                </>
            )}
        </Tjenesteboks>
    );
};

export default Pamboks;

const PamStatusAnnonser = z.object({
    PUBLISERT: z.number(),
});

const useAntallannonser = () => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    const orgnr = valgtOrganisasjon?.organisasjon?.OrganizationNumber;

    const { data } = useSWR(
        orgnr === undefined
            ? null
            : {
                  url: '/min-side-arbeidsgiver/stillingsregistrering-api/api/stillinger/numberByStatus',
                  orgnr,
              },
        fetcher,
        {
            onError: (error) => {
                Sentry.captureMessage(
                    `hent AntallAnnonser fra stillingsregistrering-api feilet med ${
                        error.status !== undefined ? `${error.status} ${error.statusText}` : error
                    }`
                );
            },
        }
    );
    return data ?? 0;
};

const fetcher = async ({ url, orgnr }: { url: string; orgnr: string }) => {
    await fetch(`/min-side-arbeidsgiver/stillingsregistrering-api/api/arbeidsgiver/${orgnr}`, {
        method: 'POST',
    });

    const respons = await fetch(url, {
        method: 'GET',
        headers: {
            organizationNumber: orgnr,
        },
    });
    if (!respons.ok) throw respons;
    return PamStatusAnnonser.parse(await respons.json()).PUBLISERT;
};
