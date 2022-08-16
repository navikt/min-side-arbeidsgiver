import React, { CSSProperties, FC } from 'react';
import { Close } from "@navikt/ds-icons";
import { Button } from '@navikt/ds-react';

export type Props = {
    className?: string;
    onClick: () => void;
    style?: CSSProperties;
}

export const Lukknapp: FC<Props> = ({className, onClick, style}) =>
    <Button style={style} className={""} onClick={onClick} variant="secondary">
        <Close title="Lukk"/>
    </Button>