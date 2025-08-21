import React, {
    FunctionComponent,
    PropsWithChildren,
    ReactNode,
    useContext,
    useMemo,
    useState,
} from 'react';
import { Alert } from '@navikt/ds-react';

type Context = {
    alerts: AlertType[];
    setSystemAlert: (system: System, alerting: boolean) => void;
};

export type System = 'UserInfoAltinn' | 'UserInfoDigiSyfo' | 'SakerAltinn';
export const AlertContext = React.createContext<Context>({} as Context);

export const AlertsProvider: FunctionComponent<PropsWithChildren> = (props) => {
    const [alertingSystems, setAlertingSystems] = useState<System[]>(() => []);

    const setSystemAlert = (system: System, alerting: boolean) => {
        setAlertingSystems((prev) =>
            alerting
                ? prev.includes(system)
                    ? prev
                    : [...prev, system]
                : prev.filter((s) => s !== system)
        );
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
    if (alerts.length === 0) {
        return null;
    }
    return (
        <>
            {alerts.sort().map((alertType) => (
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
            Vi har problemer med å hente informasjon om hvilke virksomheter du kan representere.
            Hvis du mener at du har tilganger i Altinn kan du prøve å laste siden på nytt.
        </>
    ),
    DigiSyfo: (
        <>
            Vi har problemer med å hente informasjon om eventuelle sykmeldte du skal følge opp. Vi
            jobber med å løse saken så raskt som mulig
        </>
    ),
};
