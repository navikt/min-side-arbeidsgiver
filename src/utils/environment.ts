const environment = () => {
    try {
        return {
            MILJO: (window as any).appSettings.MILJO
        };
    } catch (_) {
        return {
            MILJO: 'local'
        };
    }
}

export default environment();
