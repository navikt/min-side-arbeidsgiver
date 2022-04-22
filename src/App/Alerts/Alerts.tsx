import React, {FunctionComponent, useContext, useState} from 'react';
import {Alert} from "@navikt/ds-react";

export type AlertProps = {
    variant: "error" | "warning" | "info" | "success",
    content: React.ReactNode
}
type Context = {
    alerts: Array<AlertProps>
    addAlert: (alert: AlertProps) => void
}
export const AlertContext = React.createContext<Context>({} as Context);

export const AlertsProvider : FunctionComponent = props => {
    const [alerts, setAlerts] = useState<Array<AlertProps>>([])
    const addAlert = (alert: AlertProps) => {
        setAlerts([
            ...alerts,
            alert
        ])
    }
    const context = {
        alerts,
        addAlert,
    }
    return <AlertContext.Provider value={context}>
        {props.children}
    </AlertContext.Provider>
}

export const Alerts = () => {
    const {alerts} = useContext(AlertContext)
    return (
        <>
            {alerts.map(({ variant, content}) =>
                <Alert variant={variant}>
                    {content}
                </Alert>
            )}
        </>
    );
};
