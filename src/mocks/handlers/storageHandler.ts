import { http, HttpResponse } from 'msw';
import { as } from 'vitest/dist/reporters-trlZlObr';

const storage: {
    [key: string]: { version: number; value: any };
} = {};

export const storageHandlers = [
    http.get('/min-side-arbeidsgiver/api/storage/:key', ({ params }) => {
        const storageItem = storage[params.key as string];
        console.log(
            `get storage for key ${params.key} => ${
                storageItem !== undefined ? 'found' : 'not found'
            } ${storageItem}`
        );

        if (storageItem === undefined) {
            return new HttpResponse(null, { status: 204 });
        }

        return HttpResponse.json(storageItem.value, {
            headers: {
                'Content-Type': 'application/json',
                version: `${storageItem.version}`,
            },
        });
    }),
    http.put('/min-side-arbeidsgiver/api/storage/:key', async ({ request, params }) => {
        const reqVersion = new URL(request.url).searchParams.get('version');
        const storageItem = storage[params.key as string];
        const newStorageValue = await request.json();
        if (
            reqVersion !== null &&
            storageItem !== undefined &&
            `${storageItem.version}` !== reqVersion
        ) {
            console.warn(`put storage for key ${params.key} failed due to version mismatch`, {
                newStorageValue,
            });
            return HttpResponse.json(storageItem.value, {
                status: 409,
                headers: {
                    'Content-Type': 'application/json',
                    version: `${storageItem.version}`,
                },
            });
        } else {
            console.log(`put storage for key ${params.key}`);

            storage[params.key as string] = {
                value: newStorageValue,
                version: (storageItem?.version ?? 0) + 1,
            };

            return HttpResponse.json(storage[params.key as string].value, {
                headers: {
                    'Content-Type': 'application/json',
                    version: `${storage[params.key as string].version}`,
                },
            });
        }
    }),
    http.delete('/min-side-arbeidsgiver/api/storage/:key', async ({ request, params }) => {
        const reqVersion = new URL(request.url).searchParams.get('version');
        const storageItem = storage[params.key as string];

        if (
            reqVersion !== null &&
            storageItem !== undefined &&
            `${storageItem.version}` !== reqVersion
        ) {
            console.warn(`delete storage for key ${params.key} failed due to version mismatch`);
            return HttpResponse.json(storageItem.value, {
                status: 409,
                headers: {
                    'Content-Type': 'application/json',
                    version: `${storageItem.version}`,
                },
            });
        } else {
            console.log(`delete storage for key ${params.key}`);

            delete storage[params.key as string];
            return HttpResponse.json(storage[params.key as string].value, {
                headers: {
                    'Content-Type': 'application/json',
                    version: `${storage[params.key as string].version}`,
                },
            });
        }
    }),
];
