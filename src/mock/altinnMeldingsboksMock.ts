import fetchMock from 'fetch-mock';
import { altinnUrl } from '../lenker';
import { OrganisasjonerResponse } from './altinnMock';

const reportees = {
    _links: {},
    _embedded: {
        reportees: OrganisasjonerResponse.map(org => ({
            ...org,
            _links: {
                self: {
                    href: 'someUrl',
                },
                messages: {
                    href: `https://tt02.altinn.no/api/reportee${org.OrganizationNumber}/messages`,
                },
            },
        })),
    },
};

let getRandomInt = (min: number, max: number): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
};

let randomStatus = () => (Math.random() < 0.5 ? 'Ulest' : 'Lest');

const uniqueMessageId = (id => () => {
    id += 1;
    return `r${id}`;
})(0);

const randomMessage = (org: any): any => {
    let måned = getRandomInt(1, 11).toString();
    let dag = getRandomInt(1, 28).toString();

    if (måned.length === 1) {
        måned = '0' + måned;
    }

    if (dag.length === 1) {
        dag = '0' + dag;
    }

    return {
        MessageId: uniqueMessageId(),
        Subject: `Innvilgelse refusjon forskudd lønn permittering  ${org.Name}`,
        Status: randomStatus(),
        LastChangedDateTime: '2020-06-18T15:03:15.893',
        CreatedDate: `2020-${måned}-${dag}T15:03:15.867`,
        LastChangedBy: 'NAV',
        ServiceOwner: 'NAV (Arbeids- og velferdsetaten)',
        Type: 'Correspondence',
        MessageSender: 'NAV',
        ServiceCode: '5562',
        ServiceEdition: 1,
        _links: {
            self: {
                href: 'https://tt02.altinn.no/api/r50179335/messages/a9069768',
            },
            portalview: {
                href:
                    'https://tt02.altinn.no/Pages/ServiceEngine/Correspondence/Correspondences.aspx?ReporteeElementID=9069768&ESC=5562&ESEC=1',
            },
            metadata: {
                href: 'https://tt02.altinn.no/api/metadata/correspondence/5562/1',
            },
        },
    };
};

const randomMessages = (org: any): any[] => {
    const length = getRandomInt(0, 15);
    const result: any[] = [];
    for (let i = 0; i < length; i++) {
        result.push(randomMessage(org));
    }
    return result;
};

let allMessages: { [key: string]: any } = {};
OrganisasjonerResponse.forEach(org => {
    allMessages[`reportee${org.OrganizationNumber}`] = {
        _links: {
            portalview: {
                href: 'https://tt02.altinn.no/min-meldingsboks',
            },
        },
        _embedded: {
            messages: randomMessages(org),
        },
    };
});

const getMessagesForReportee = (url: string): any => {
    const match = new RegExp('.*/api/([^/]+)/messages?.*$')?.exec(url);
    const reporteeId = match ? match[1] : '';
    if (reporteeId in allMessages) {
        return allMessages[reporteeId];
    }
    return {};
};

export const mock = () => {
    fetchMock.get(`${altinnUrl}/api/reportees`, reportees);

    fetchMock.get(`glob:${altinnUrl}/api/*/messages*`, getMessagesForReportee);
}