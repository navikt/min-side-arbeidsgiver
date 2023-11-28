import React, { FunctionComponent, PropsWithChildren } from 'react';

interface Props {
    showFrom: Date;
    showUntil: Date;
    currentTime?: Date;
}

export const shouldDisplay = ({
    showFrom,
    currentTime,
    showUntil,
}: {
    showFrom: Date;
    currentTime: Date;
    showUntil: Date;
}) => showFrom <= currentTime && currentTime < showUntil;

export const DisplayBetween: FunctionComponent<PropsWithChildren<Props>> = (props) => {
    const { showFrom, showUntil, currentTime = new Date(), children } = props;

    return shouldDisplay({ showFrom, currentTime, showUntil }) ? <>{children}</> : null;
};
