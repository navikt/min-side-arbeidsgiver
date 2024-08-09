import React from 'react';
import { fa } from '@faker-js/faker';

export const NyOppgaveIkon = ({ title }: { title: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
        focusable="false"
        role="img"
    >
        <title>{title}</title>
        <path
            fill="#C77300"
            fillRule="evenodd"
            d="M12.031 11.587a.25.25 0 0 1 .033-.11l2.985-5.17a.25.25 0 0 1 .341-.092l3.032 1.75a.25.25 0 0 1 .091.341l-2.985 5.17a.25.25 0 0 1-.079.084l-3.265 2.156a.25.25 0 0 1-.387-.223zm4.11-6.671a.25.25 0 0 1-.092-.342l.486-.84a2 2 0 1 1 3.464 2l-.486.84a.25.25 0 0 1-.341.092zm-5.604 6.522a1.5 1.5 0 0 1 .198-.66l4.13-7.153a.25.25 0 0 0-.216-.375H5.5c-.69 0-1.25.56-1.25 1.25v16c0 .69.56 1.25 1.25 1.25h12c.69 0 1.25-.56 1.25-1.25v-8.67c0-.257-.339-.347-.466-.126l-1.486 2.574a1.5 1.5 0 0 1-.473.501l-3.732 2.465a1.5 1.5 0 0 1-2.324-1.342z"
            clipRule="evenodd"
        ></path>
    </svg>
);

export const OppgaveUtgaattIkon = ({ title }: { title: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
        focusable="false"
        role="img"
    >
        <title>{title}</title>
        <path
            fill="rgba(2, 12, 28, 0.68)"
            fillRule="evenodd"
            d="M12.031 11.587a.25.25 0 0 1 .033-.11l2.985-5.17a.25.25 0 0 1 .341-.092l3.032 1.75a.25.25 0 0 1 .091.341l-2.985 5.17a.25.25 0 0 1-.079.084l-3.265 2.156a.25.25 0 0 1-.387-.223zm4.11-6.671a.25.25 0 0 1-.092-.342l.486-.84a2 2 0 1 1 3.464 2l-.486.84a.25.25 0 0 1-.341.092zm-5.604 6.522a1.5 1.5 0 0 1 .198-.66l4.13-7.153a.25.25 0 0 0-.216-.375H5.5c-.69 0-1.25.56-1.25 1.25v16c0 .69.56 1.25 1.25 1.25h12c.69 0 1.25-.56 1.25-1.25v-8.67c0-.257-.339-.347-.466-.126l-1.486 2.574a1.5 1.5 0 0 1-.473.501l-3.732 2.465a1.5 1.5 0 0 1-2.324-1.342z"
            clipRule="evenodd"
        ></path>
    </svg>
);

export const OppgaveUtfortIkon = ({ title }: { title: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
        focusable="false"
        role="img"
    >
        <title>{title}</title>
        <path
            fill="#33AA5F"
            fillRule="evenodd"
            d="M12 21.75c5.385 0 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25 2.25 6.615 2.25 12s4.365 9.75 9.75 9.75m4.954-12.475a.813.813 0 0 0-1.24-1.05l-5.389 6.368L7.7 11.967a.812.812 0 0 0-1.15 1.15l3.25 3.25a.81.81 0 0 0 1.195-.05z"
            clipRule="evenodd"
        ></path>
    </svg>
);

export const BeskjedIkon = ({ title }: { title: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
        focusable="false"
        role="img"
    >
        <title>{title}</title>
        <path
            fill="rgba(35, 107, 125, 1)"
            fillRule="evenodd"
            d="M3.25 6A2.75 2.75 0 0 1 6 3.25h12A2.75 2.75 0 0 1 20.75 6v9A2.75 2.75 0 0 1 18 17.75H9.208l-4.822 2.893A.75.75 0 0 1 3.25 20z"
            clipRule="evenodd"
        ></path>
    </svg>
);

export const NesteStegIkon = ({ title }: { title: string }) => (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
        <title>{title}</title>
        <circle cx="13" cy="13" r="9.5" stroke="black" strokeDasharray="2 2" />
    </svg>
);

export const KalenderavtaleIkon = ({
    title,
    variant = 'grå',
}: {
    title: string;
    variant: 'oransje' | 'blå' | 'grå';
}) => {
    const farge = {
        oransje: 'rgba(199, 115, 0, 1)',
        blå: 'rgba(35, 107, 125, 1)',
        grå: 'rgba(2, 12, 28, 0.68)',
    };
    return (
        <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            role="img"
        >
            <title>{title}</title>
            <path
                fill={farge[variant]}
                fillRule="evenodd"
                d="M9 2.25a.75.75 0 0 1 .75.75v4a.75.75 0 0 1-1.5 0V3A.75.75 0 0 1 9 2.25m6 0a.75.75 0 0 1 .75.75v4a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75M13.25 4.5a.25.25 0 0 0-.25-.25h-2a.25.25 0 0 0-.25.25V7a1.75 1.75 0 1 1-3.5 0V4.5A.25.25 0 0 0 7 4.25H4.5c-.69 0-1.25.56-1.25 1.25V9c0 .138.112.25.25.25h17a.25.25 0 0 0 .25-.25V5.5c0-.69-.56-1.25-1.25-1.25H17a.25.25 0 0 0-.25.25V7a1.75 1.75 0 1 1-3.5 0zm7.5 6.5a.25.25 0 0 0-.25-.25h-17a.25.25 0 0 0-.25.25v7.5c0 .69.56 1.25 1.25 1.25h15c.69 0 1.25-.56 1.25-1.25zm-14 2a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 0 1.5h-1a.75.75 0 0 1-.75-.75m4.75-.75a.75.75 0 0 0 0 1.5h1a.75.75 0 0 0 0-1.5zm3.25.75a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 0 1.5h-1a.75.75 0 0 1-.75-.75m-3.25 2.25a.75.75 0 0 0 0 1.5h1a.75.75 0 0 0 0-1.5zm3.25.75a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 0 1.5h-1a.75.75 0 0 1-.75-.75m-7.25-.75a.75.75 0 0 0 0 1.5h1a.75.75 0 0 0 0-1.5z"
                clipRule="evenodd"
            ></path>
        </svg>
    );
};

export const StipletTidslinjeLinjeIkon = ({ height = 32 }: { height?: number }) =>
    TidslinjeLinjeIkon({ height, stiplet: true });

export const DelvisStipletTidslinjeLinjeIkon = ({ height = 32 }: { height?: number }) =>
    TidslinjeLinjeIkon({ height, delvis: true });

export const SolidTidslinjeLinjeIkon = ({ height = 32 }: { height?: number }) =>
    TidslinjeLinjeIkon({ height });

const TidslinjeLinjeIkon = ({
    height = 32,
    stiplet = false,
    delvis = false,
}: {
    height?: number;
    stiplet?: boolean;
    delvis?: boolean;
}) => (
    <svg
        width="24"
        height={height}
        viewBox={`0 0 24 ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-hidden="true"
    >
        <line
            x1="11.5"
            y1={delvis ? height / 2 : height}
            x2="11.5"
            stroke="#979797"
            strokeDasharray={stiplet ? '2 2' : undefined}
        />
        <line
            x1="11.5"
            y1={height / 2}
            x2="11.5"
            y2={delvis ? height : height / 2}
            stroke="#979797"
            strokeDasharray={stiplet || delvis ? '2 2' : undefined}
        />
    </svg>
);
