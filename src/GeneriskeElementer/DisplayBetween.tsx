import React, { FunctionComponent } from 'react';

interface Props {
    showFrom: Date,
    showUntil: Date,
    currentTime?: Date
}

export const DisplayBetween: FunctionComponent<Props> = (props) => {
    const {
        showFrom,
        showUntil,
        currentTime = new Date(),
        children
    } = props

    return (showFrom <= currentTime && currentTime < showUntil) ? <>{children}</> : null
}
