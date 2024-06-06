const Demoprofil = {
    NarmesteLeder: 'Nærmeste Leder',
    Regnskapsforer: 'Regnskapsfører',
    DagligLeder: 'Daglig Leder',
};

export type Demoprofil = (typeof Demoprofil)[keyof typeof Demoprofil];

export const demoProfiler = Object.entries(Demoprofil).map(([profil, navn]) => ({
    profil,
    navn,
}));

export const useDemoprofil: () => {
    valgtDemoprofil: Demoprofil;
    setDemoprofil: (demoprofil: Demoprofil) => void;
} = () => {
    const { demoprofil } = Object.fromEntries(new URLSearchParams(window.location.search));

    const setDemoprofil = (demoprofil: Demoprofil) => {
        const url = new URL(window.location.href);
        url.searchParams.set('demoprofil', demoprofil);
        window.location.replace(url.toString());
    };

    return {
        valgtDemoprofil: demoprofil ?? 'DagligLeder',
        setDemoprofil,
    };
};
