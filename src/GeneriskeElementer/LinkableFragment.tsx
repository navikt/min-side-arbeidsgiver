import React, { FunctionComponent, useCallback, useEffect, useState } from 'react';

interface Props {
    fragment: string;
}

const fragmentIs = (fragment: string): boolean => window.location.hash === `#${fragment}`;

export const LinkableFragment: FunctionComponent<Props> = ({ fragment, children }) => {
    const [shouldScroll, setShouldScroll] = useState(fragmentIs(fragment));
    const [htmlElement, setHtmlElement] = useState<HTMLDivElement | null>(null);

    const onLocationChange = useCallback(() => setShouldScroll(fragmentIs(fragment)), [fragment]);

    useEffect(() => {
        window.addEventListener('popstate', onLocationChange);
        return () => window.removeEventListener('popstate', onLocationChange);
    }, [onLocationChange]);

    useEffect(() => {
        if (shouldScroll && htmlElement) {
            setShouldScroll(false);
            /* Timeout fordi vi må vente til både Reacts DOM er innarbeidet inn i den ekte
             * DOM-en _og_ på at den ekte DOM-en er rendret. */
            setTimeout(() => htmlElement.scrollIntoView({ behavior: 'smooth' }), 500);
        }
    }, [shouldScroll, htmlElement]);

    return <div ref={setHtmlElement}>{children}</div>;
};
