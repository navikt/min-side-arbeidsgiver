import React, {FunctionComponent, useContext, useState} from 'react';
import {Alert} from "@navikt/ds-react";
import {LenkeMedLogging} from "../../GeneriskeElementer/LenkeMedLogging";

export type AlertProps = {
    id: string,
    variant: "error" | "warning" | "info" | "success",
    content: React.ReactNode
}
type Context = {
    alerts: Map<string, AlertProps>
    addAlert: (alert: AlertProps) => void
}

export const ALERTS: Record<string, AlertProps> = {
    Altinn: {
        id: "altinn",
        variant: "error",
        content: <>
            Vi opplever ustabilitet med Altinn. Hvis du mener at du har roller i Altinn kan
            du prøve å{' '}
            <LenkeMedLogging
                loggLenketekst="laste siden på nytt"
                href={'https://arbeidsgiver.nav.no/min-side-arbeidsgiver'}
            >
                laste siden på nytt
            </LenkeMedLogging>
        </>
    },
    DigiSyfo: {
        id:"digisyfo",
        variant: "error",
        content: <>Vi har problemer med å hente informasjon om eventuelle sykmeldte du skal følge
            opp. Vi jobber med å løse saken så raskt som mulig</>
    }
}

export const AlertContext = React.createContext<Context>({} as Context);

export const AlertsProvider : FunctionComponent = props => {
    const [alerts, setAlerts] = useState<Map<string, AlertProps>>(new Map())
    const addAlert = (alert: AlertProps) => {
        setAlerts(
            new Map(alerts.set( alert.id, alert ))
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
