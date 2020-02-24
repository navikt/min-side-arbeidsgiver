interface Logger {
    event: (navn: string, fields: {}, tags: {}) => void;
    error: (melding: string) => void;
    info: (logContent: { message: string; orgnr?: string }) => void;
}

export const logEvent = (eventNavn: string, felter?: {}, tags?: {}) => {
    const logger: Logger = (window as any).frontendlogger;
    if (logger) {
        logger.event(eventNavn, felter || {}, tags || {});
    }
};
export const logInfo = (message: string, orgnr?: string) => {
    const logger: Logger = (window as any).frontendlogger;
    if (logger) {
        if (orgnr) {
            logger.info({ message: message, orgnr: orgnr });
        } else {
            logger.info({ message: message });
        }
    }
};
