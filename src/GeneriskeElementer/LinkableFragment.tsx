import React, { FunctionComponent, PropsWithChildren, useEffect, useState } from 'react';

interface Props {
    fragment: string;
}

/* På grunn av en bug i altinn, så funker ikke fragment i redirect-URL-er. Benytter derfor
 * query-parameter enn så lenge. Når det er fikset, så hadde det vært naturlig å sjekke
 * fragment i stede for query parameter.
 */

export const LinkableFragment: FunctionComponent<PropsWithChildren<Props>> = ({
    fragment,
    children,
}) => {
    const [htmlElement, setHtmlElement] = useState<HTMLDivElement | null>(null);
    const shouldScroll = new URLSearchParams(window.location.search).get('fragment') === fragment;

    useEffect(() => {
        if (shouldScroll && htmlElement) {
            /* Timeout fordi vi må vente til både Reacts DOM er innarbeidet inn i den ekte
             * DOM-en _og_ på at den ekte DOM-en er rendret. */
            setTimeout(() => htmlElement.scrollIntoView({ behavior: 'smooth' }), 500);
        }
    }, [shouldScroll, htmlElement]);

    return <div ref={setHtmlElement}>{children}</div>;
};
