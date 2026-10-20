import { z } from 'zod';
import useSWR from 'swr';
import { useState } from 'react';
import { erStøy } from '../../../../utils/util';
import { useOrganisasjonsDetaljerContext } from '../../../OrganisasjonsDetaljerContext';
import { useOrganisasjonerOgTilgangerContext } from '../../../OrganisasjonerOgTilgangerContext';

const Arbeidsstedoversikt = z.object({
    aktiveArbeidsforhold: z.number().nullish(),
    inaktiveArbeidsforhold: z.number().nullish(),
});

// parent, parent.parent, ... til og med øverste ledd. Erstatter traverseringen av
// orgtreet som aareg-innsyn-arbeidsgiver-api gjorde mot Enhetsregisteret.
const kandidaterForOpplysningspliktig = (
    orgnr: string,
    orgnrTilParentMap: Map<string, string>
): string[] => {
    const kandidater: string[] = [];
    let gjeldende = orgnrTilParentMap.get(orgnr);
    while (gjeldende !== undefined && !kandidater.includes(gjeldende)) {
        kandidater.push(gjeldende);
        gjeldende = orgnrTilParentMap.get(gjeldende);
    }
    return kandidater;
};

const fetcher = async ({
    url,
    arbeidsstedId,
    opplysningspliktigIder,
}: {
    url: string;
    arbeidsstedId: string;
    opplysningspliktigIder: string[];
}): Promise<number> => {
    for (const opplysningspliktigId of opplysningspliktigIder) {
        const respons = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ opplysningspliktigId, arbeidsstedId }),
        });
        if (respons.status !== 200) throw respons;

        // aareg-services svarer 200 uten body når arbeidsstedet ikke hører til
        // opplysningspliktig (eller er filtrert bort av tilgangskontrollen).
        const body = (await respons.text()).trim();
        if (body === '' || body === 'null') continue;

        const { aktiveArbeidsforhold, inaktiveArbeidsforhold } = Arbeidsstedoversikt.parse(
            JSON.parse(body)
        );
        return (aktiveArbeidsforhold ?? 0) + (inaktiveArbeidsforhold ?? 0);
    }
    return 0;
};

export const useAntallArbeidsforholdFraAareg = (): number => {
    const { valgtOrganisasjon } = useOrganisasjonsDetaljerContext();
    const { orgnrTilParentMap } = useOrganisasjonerOgTilgangerContext();
    const [retries, setRetries] = useState(0);
    const arbeidsstedId = valgtOrganisasjon.organisasjon.orgnr;
    const opplysningspliktigIder = kandidaterForOpplysningspliktig(
        arbeidsstedId,
        orgnrTilParentMap
    );

    const { data } = useSWR(
        opplysningspliktigIder.length > 0
            ? {
                  url: `${__BASE_PATH__}/aareg-services/arbeidsstedoversikt`,
                  arbeidsstedId,
                  opplysningspliktigIder,
              }
            : null,
        fetcher,
        {
            onSuccess: () => setRetries(0),
            onError: (error) => {
                setRetries((x) => x + 1);
                if (retries === 5 && !erStøy(error)) {
                    console.error(
                        `#FARO: hent antall arbeidsforhold fra aareg-services feilet med ${
                            error.status !== undefined
                                ? `${error.status} ${error.statusText}`
                                : error
                        }`
                    );
                }
            },
            errorRetryInterval: 300,
            fallbackData: 0,
        }
    );

    return data;
};
