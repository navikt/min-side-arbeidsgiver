import { useState } from 'react';
import { arbeidsplassenURL } from '../../../../lenker';
import PamboksIkon from './arbeidsplassen-ikon-kontrast.svg';
import './Arbeidsplassen.css';
import { StortTall, Tjenesteboks } from '../Tjenesteboks';
import { z } from 'zod';
import useSWR from 'swr';
import { erStøy } from '../../../../utils/util';
import { useOrganisasjonsDetaljerContext } from '../../../OrganisasjonsDetaljerContext';

const Arbeidsplassen = () => {
    const antallAnnonser = useAntallannonser();

    return (
        <Tjenesteboks
            ikon={PamboksIkon}
            href={arbeidsplassenURL}
            tittel={'Rekruttere på arbeidsplassen.no'}
            aria-label={
                'Rekruttere på arbeidsplassen.no, ' +
                (antallAnnonser > 0
                    ? `${antallAnnonser} Stillingsannonser aktive`
                    : 'Lag en stillingsannonse')
            }
        >
            {antallAnnonser > 0 ? (
                <div className={'pamboks__bunntekst'}>
                    <span>
                        {' '}
                        <StortTall>{antallAnnonser}</StortTall>
                        {antallAnnonser > 1
                            ? 'stillingsannonser (aktive)'
                            : 'stillingsannonse (aktiv)'}
                    </span>
                </div>
            ) : (
                <>Lag en stillingsannonse</>
            )}
        </Tjenesteboks>
    );
};

export default Arbeidsplassen;

const PamStatusAnnonser = z.object({
    PUBLISERT: z.number(),
});

const useAntallannonser = () => {
    const orgnr = useOrganisasjonsDetaljerContext().valgtOrganisasjon.organisasjon.orgnr;
    const [retries, setRetries] = useState(0);

    const { data } = useSWR(
        orgnr === undefined
            ? null
            : {
                  url: `${__BASE_PATH__}/stillingsregistrering-api/api/stillinger/numberByStatus`,
                  orgnr,
              },
        fetcher,
        {
            onError: (error) => {
                if (retries === 5 && !erStøy(error)) {
                    console.error(
                        `#MSA: hent AntallAnnonser fra stillingsregistrering-api feilet med ${
                            error.status !== undefined
                                ? `${error.status} ${error.statusText}`
                                : error
                        }`
                    );
                }
                setRetries((x) => x + 1);
            },
            onSuccess: () => {
                setRetries(0);
            },
            errorRetryInterval: 300,
        }
    );
    return data ?? 0;
};

const fetcher = async ({ url, orgnr }: { url: string; orgnr: string }) => {
    await fetch(`${__BASE_PATH__}/stillingsregistrering-api/api/arbeidsgiver/${orgnr}`, {
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
