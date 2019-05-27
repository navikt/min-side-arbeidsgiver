interface Logger {
    event: (navn: string, fields: {}, tags: {}) => void;
    error: (melding: string) => void;
    info: (logContent: {message: string , x_Message?: string}) => void;
}

export const logEvent = (eventNavn: string, felter?: {}, tags?: {}) => {
  const logger: Logger = (window as any).frontendlogger;
  if (logger) {
    logger.event(eventNavn, felter || {}, tags || {});
  }
};
export const logInfo = (message: string, x_Message?: string ) => {
    const logger: Logger = (window as any).frontendlogger;
    if (logger) {
        if(x_Message){
            logger.info({"message":message, "x_Message": x_Message});
    }else{
            logger.info({"message":message});

        }}
};
