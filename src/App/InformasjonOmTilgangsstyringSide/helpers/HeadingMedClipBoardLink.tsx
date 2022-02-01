import React, {FunctionComponent} from 'react';
import {Heading} from '@navikt/ds-react';
import "@navikt/ds-css";
import {ClipBoardLink} from "./ClipBoardLink";

interface HeadingMedClipBoardLinkProps {
    id: string;
    title: string;
}

export const HeadingMedClipBoardLink: FunctionComponent<HeadingMedClipBoardLinkProps> = ({id, title}) => {
    return <>
        <Heading id={id} size='large' spacing>
            {title}
        </Heading>
        <ClipBoardLink hash={id}/>
    </>
}
