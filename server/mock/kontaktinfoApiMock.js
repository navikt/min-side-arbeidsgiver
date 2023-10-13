const response = [
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

export const mock = (app) => {
    app.post('/min-side-arbeidsgiver/api/kontaktinfo/v1', (req, res) => {
        const randomRespons = response[Math.floor(Math.random() * 5)];
        return res.send(randomRespons);
    });
};
