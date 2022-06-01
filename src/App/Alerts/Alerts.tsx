import React, {FunctionComponent, useContext, useEffect, useState} from 'react';
import {Alert, BodyShort, Heading} from "@navikt/ds-react";

type AlertProps = {
    content: React.ReactNode
}
type Context = {
    alerts: Set<AlertType>
    addAlert: (subsystem: SubSystem) => void
    clearAlert: (subsystem: SubSystem) => void
}

const ALERTS: Record<AlertType, AlertProps> = {
    Altinn: {
        content: <>
            Vi opplever ustabilitet med Altinn. Hvis du mener at du har roller i Altinn kan
            du prøve å laste siden på nytt.
        </>
    },
    DigiSyfo: {
        content: <>Vi har problemer med å hente informasjon om eventuelle sykmeldte du skal følge
            opp. Vi jobber med å løse saken så raskt som mulig</>
    },
    DigiSyfoVirksomhetsvelger: {
        content: <>
            <Heading size="small">Sykemeldte er nå koblet til virksomhetsvelgeren</Heading>
            <BodyShort>Velg virksomhet for å se sykemeldte du skal følge opp der. Boksen “Sykemeldte” vises bare når du har noen sykemeldt å følge opp på valgt virksomhet.
            </BodyShort>
        </>
    }
}

type AlertType = "Altinn" | "DigiSyfo" | "DigiSyfoVirksomhetsvelger"
export type SubSystem = "TilgangerAltinn" | "TilgangerDigiSyfo" | "Saker" | "DigiSyfoVirksomhetsvelger"

export const AlertContext = React.createContext<Context>({} as Context);


const subSystemToAlertType: Record<SubSystem, AlertType> =
    {
        "TilgangerAltinn": "Altinn",
        "TilgangerDigiSyfo": "DigiSyfo",
        "Saker": "Altinn",
        "DigiSyfoVirksomhetsvelger": "DigiSyfoVirksomhetsvelger",
    }

const alertTypeToVariant: Record<AlertType, "error" | "warning" | "info" | "success"> =
    {
        "Altinn": "error",
        "DigiSyfo": "error",
        "DigiSyfoVirksomhetsvelger": "info",
    }

export const AlertsProvider: FunctionComponent = props => {
    const [subsystems, setSubsystems] = useState<Set<SubSystem>>(new Set())
    const [alerts, setAlerts] = useState<Set<AlertType>>(new Set())
    const addAlert = (subsystem: SubSystem) => {
        setSubsystems(
            new Set(subsystems.add(subsystem))
        )
    }
    const clearAlert = (subsystem: SubSystem) => {
        if (!subsystems.delete(subsystem)) {
            setSubsystems(
                new Set(subsystems)
            )
        }
    }

    useEffect(()=>{
        setAlerts(
        new Set(Array.from(subsystems).map(subsystem=>subSystemToAlertType[subsystem]))
        )
    }, [subsystems])


    const context:Context = {
        alerts,
        addAlert,
        clearAlert,
    }

    return <AlertContext.Provider value={context}>
        {props.children}
    </AlertContext.Provider>
}


export const Alerts = () => {
    const {alerts} = useContext(AlertContext)
    return (
        <>
            {Array.from(alerts).sort().map((alertType) =>
                <Alert key={alertType} variant={alertTypeToVariant[alertType]}>
                    {ALERTS[alertType].content}
                </Alert>
            )}
        </>
    );
};
