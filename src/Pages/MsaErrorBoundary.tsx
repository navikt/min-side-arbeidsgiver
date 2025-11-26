'use client';

import { Alert } from '@navikt/ds-react';
import React, { ReactNode } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { SimpleBanner } from './Banner';

export const MsaErrorBoundary = ({ children }: { children: ReactNode }) => {
    function onError(error: Error, info: React.ErrorInfo) {
        console.error(
            `#FARO: Generisk feil ${error.name}:\nmessage: ${error.message}\ncomponentStack: ${info.componentStack}\n`
        );
    }

    return (
        <ErrorBoundary
            fallback={
                <>
                    <SimpleBanner />
                    <Alert className={'app-error-alert'} variant={'error'}>
                        En ukjent feil ble oppdaget. Du kan forsøke å laste inn siden på nytt.{' '}
                        <div>
                            <a href={window.location.href}>Last inn siden på nytt</a>
                        </div>
                        <div>
                            <a href={'/'}>Gå til forsiden</a>
                        </div>
                    </Alert>
                </>
            }
            onError={onError}
        >
            {children}
        </ErrorBoundary>
    );
};
