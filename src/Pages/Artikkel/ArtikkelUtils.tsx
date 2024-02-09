import { BodyShort, Heading } from '@navikt/ds-react';
import React from 'react';
import './ArtikkelUtils.css';

export const Bilde = ({ src, bildetekst }: { src: string; bildetekst: string }) => {
    return (
        <div className="artikkel-util-bildecontainer">
            <img width="100%" src={src} alt={bildetekst} />
            <BodyShort size="small" className="artikkel-util-bildetekst">
                {bildetekst}
            </BodyShort>
        </div>
    );
};

const dateFormat = new Intl.DateTimeFormat('no', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
});

export const Ingress = ({
    ingress,
    publiseringstidspunkt,
}: {
    ingress: string;
    publiseringstidspunkt: Date;
}) => {
    return (
        <div className="artikkel-util-ingress">
            <Heading level="2" size="medium">
                {ingress}
            </Heading>
            <BodyShort size="small">
                Publisert: {dateFormat.format(publiseringstidspunkt)}
            </BodyShort>
        </div>
    );
};

export const Tekstfelt = ({ children }: { children: React.ReactNode }) => {
    return <div className="artikkel-util-tekstfelt">{children}</div>;
};

export const NL = () => {
    return (
        <>
            <br />
            <br />
        </>
    );
};
