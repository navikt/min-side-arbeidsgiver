import useSWR from 'swr';
import { useState } from 'react';
import { erDriftsforstyrrelse, erUnauthorized } from '../../utils/util';

type UseRawHtmlFromStorageResult = {
    rawHtml: string | undefined;
    isError: boolean;
};

export const useRawArtikkelHtml = ({
    objectName,
}: {
    objectName: string;
}): UseRawHtmlFromStorageResult => {
    const [retries, setRetries] = useState(0);
    const { data: rawHtml } = useSWR(
        objectName === undefined ? null : `/min-side-arbeidsgiver/artikler/${objectName}`,
        fetcher,
        {
            onSuccess: () => setRetries(0),
            onError: (error) => {
                if (
                    retries === 5 &&
                    !erDriftsforstyrrelse(error.status) &&
                    !erUnauthorized(error.status)
                ) {
                    console.error(
                        `#MSA: hent raw artikler html feilet med ${
                            error.status !== undefined
                                ? `${error.status} ${error.statusText}`
                                : error
                        }`
                    );
                }
                setRetries((x) => x + 1);
            },
            errorRetryInterval: 100,
        }
    );
    return {
        rawHtml,
        isError: rawHtml === undefined && retries >= 5,
    };
};

const fetcher = async (url: string) => {
    const respons = await fetch(url);
    if (respons.status !== 200) throw respons;

    return respons.text();
};
