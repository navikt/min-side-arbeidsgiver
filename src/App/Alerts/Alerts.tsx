import React, {FunctionComponent, useContext, useState} from 'react';
import {Alert} from "@navikt/ds-react";

export type AlertProps = {
    id: string,
    variant: "error" | "warning" | "info" | "success",
    content: React.ReactNode
}
type Context = {
    alerts: Map<string, AlertProps>
    addAlert: (alert: AlertProps) => void
}
export const AlertContext = React.createContext<Context>({} as Context);

export const AlertsProvider : FunctionComponent = props => {
    const [alerts, setAlerts] = useState<Map<string, AlertProps>>(new Map())
    const addAlert = (alert: AlertProps) => {
        setAlerts(
            alerts.set( alert.id, alert )
        )
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
            {Array.from(alerts.values()).map(({id, variant, content}) =>
                <Alert key={id} variant={variant}>
                    {content}
                </Alert>
            )}
        </>
    );
};
