interface Logger {
    event: (navn: string, fields: {}, tags: {}) => void;
    error: (melding: string) => void;
    info: (message: string ) => void;
}

export const logEvent = (eventNavn: string, felter?: {}, tags?: {}) => {
    const logger: Logger = (window as any).frontendlogger;
    if (logger) {
        logger.event(eventNavn, felter || {}, tags || {});
    }
};
export const logInfo = (message: string, ) => {
    const logger: Logger = (window as any).frontendlogger;
    if (logger) {
        logger.info(message);
    }
};