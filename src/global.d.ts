interface Window {
    minsideUmami?: {
        track: (eventName: string, eventData?: Record<string, any>) => void;
    };
}