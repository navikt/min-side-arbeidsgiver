import React, { FunctionComponent, ReactNode, useContext, useMemo, useState } from 'react';
import { Alert } from '@navikt/ds-react';
import { Set } from 'immutable';

type Context = {
    alerts: Set<AlertType>;
    setSystemAlert: (system: System, alerting: boolean) => void;
};

export type System = 'UserInfoAltinn' | 'UserInfoDigiSyfo' | 'SakerAltinn';
export const AlertContext = React.createContext<Context>({} as Context);

export const AlertsProvider: FunctionComponent = (props) => {
    const [alertingSystems, setAlertingSystems] = useState<Set<System>>(() => Set());

    const setSystemAlert = (system: System, alerting: boolean) => {
        setAlertingSystems((it) => (alerting ? it.add(system) : it.delete(system)));
    };

    const alerts = useMemo(
        () => alertingSystems.map((system) => systemToAlertType[system]),
        [alertingSystems]
    );

    return (
        <AlertContext.Provider value={{ setSystemAlert, alerts }}>
            {props.children}
        </AlertContext.Provider>
    );
};

type AlertType = 'Altinn' | 'DigiSyfo';

export const Alerts = () => {
    const { alerts } = useContext(AlertContext);
    if (alerts.size === 0) {
        return null;
    }
    return (
        <>
            {alerts
                .toArray()
                .sort()
                .map((alertType) => (
                    <Alert key={alertType} variant="error" role="status">
                        {ALERTS[alertType]}
                    </Alert>
                ))}
        </>
    );
};

const systemToAlertType: Record<System, AlertType> = {
    UserInfoAltinn: 'Altinn',
    UserInfoDigiSyfo: 'DigiSyfo',
    SakerAltinn: 'Altinn',
};

const ALERTS: Record<AlertType, ReactNode> = {
    Altinn: (
        <>
            Vi opplever ustabilitet med Altinn. Hvis du mener at du har roller i Altinn kan du prøve
            å laste siden på nytt.
        </>
    ),
    DigiSyfo: (
        <>
            Vi har problemer med å hente informasjon om eventuelle sykmeldte du skal følge opp. Vi
            jobber med å løse saken så raskt som mulig
        </>
    ),
};
