import React, { CSSProperties, FC } from 'react';
import { Close } from "@navikt/ds-icons";
import { Button } from '@navikt/ds-react';

export type Props = {
    className?: string;
    onClick: () => void;
}

export const Lukknapp: FC<Props> = ({className, onClick}) =>
    <Button className={className} onClick={onClick} variant="secondary">
        <Close title="Lukk"/>
    </Button>