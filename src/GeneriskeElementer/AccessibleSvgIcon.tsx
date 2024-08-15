import React, { useId } from 'react';

export const AccessibleSvgIcon = ({
                                      title,
                                      children,
                                      'aria-hidden': ariaHidden,
                                      ...props
                                  }: {
    title: string;
    /* Vi krever at man må ta stilling til om SVG-en skal lese opp eller ikke. */
    'aria-hidden': boolean
} & React.SVGProps<SVGSVGElement>) => {
    /* Her ønsker vi følge best practice fra aksel:
     * https://aksel.nav.no/god-praksis/artikler/tilgjengelig-ikonbruk
     */
    const id = useId();
    return (
        <svg {...props}
             aria-hidden={ariaHidden}
             focusable="false"
             role="img"
             aria-labelledby={id}>
            <title id={id}>{title}</title>
            {children}
        </svg>
    );
};