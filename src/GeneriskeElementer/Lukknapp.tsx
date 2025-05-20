import React, { CSSProperties, FC } from 'react';
import { XMarkIcon } from "@navikt/aksel-icons";
import { Button } from '@navikt/ds-react';

export type Props = {
    className?: string;
    onClick: () => void;
}

export const Lukknapp: FC<Props> = ({className, onClick}) =>
    <Button className={className} onClick={onClick} variant="secondary" aria-label="Lukk">
        <XMarkIcon title="Lukk"/>
    </Button>
