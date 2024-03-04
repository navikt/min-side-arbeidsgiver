import useSWR from 'swr';
import * as Sentry from '@sentry/browser';
import { ReactNode, useState } from 'react';

export const useRawArtikkelHtml = ({ objectName }: { objectName: string }): string | undefined => {
    const [retries, setRetries] = useState(0);
    const { data: rawHtml } = useSWR(
        objectName === undefined ? null : `/min-side-arbeidsgiver/artikler/${objectName}`,
        fetcher,
        {
            onSuccess: () => setRetries(0),
            onError: (error) => {
                console.error('error', error);
                if (retries === 5) {
                    Sentry.captureMessage(
                        `hent raw artikler html feilet med ${
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
    return rawHtml;
};

const fetcher = async (url: string) => {
    const respons = await fetch(url);
    if (respons.status !== 200) throw respons;

    return respons.text();
};
