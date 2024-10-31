import { http, HttpResponse } from 'msw';
import { faker } from '@faker-js/faker';

const eksempler = [
    {
        hovedenhet: null,
        underenhet: null,
    },
    {
        hovedenhet: {
            eposter: [],
            telefonnumre: [],
        },
        underenhet: {
            eposter: [],
            telefonnumre: [],
        },
    },
    {
        hovedenhet: {
            eposter: ['post@firma.no'],
            telefonnumre: [],
        },
        underenhet: {
            eposter: [],
            telefonnumre: ['+4700000'],
        },
    },
    {
        hovedenhet: {
            eposter: ['post@firma.no', 'post1@firma.no'],
            telefonnumre: [],
        },
        underenhet: {
            eposter: ['post@firma.no'],
            telefonnumre: ['+4700000'],
        },
    },
    {
        hovedenhet: {
            eposter: ['post@firma.no', 'post1@firma.no'],
            telefonnumre: ['+4700000'],
        },
        underenhet: {
            eposter: [],
            telefonnumre: ['+4700000'],
        },
    },
];

export const kontaktinfoHandler = http.post('/min-side-arbeidsgiver/api/kontaktinfo/v1', () =>
    HttpResponse.json(faker.helpers.arrayElement(eksempler))
);
