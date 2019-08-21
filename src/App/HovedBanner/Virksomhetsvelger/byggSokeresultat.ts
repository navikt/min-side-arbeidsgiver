import { Organisasjon, OverenhetOrganisasjon } from '../../../Objekter/organisasjon';
import fuzzysort from 'fuzzysort';

const fuzzysortConfig = {
    key: 'Name',
    allowTypo: false,
    threshold: -1000,
};

export function byggSokeresultat(
    organisasjonstre: OverenhetOrganisasjon[],
    organisasjoner: Organisasjon[],
    inputTekst: string
): OverenhetOrganisasjon[] {
    const sokeresultat = finnUnderEnheterMedSok(organisasjoner, inputTekst);

    return matchResultatMedJuridiskEnhet(organisasjonstre, sokeresultat);
}

const finnUnderEnheterMedSok = (organisasjoner: Organisasjon[], inputTekst: string) =>
    fuzzysort
        .go(inputTekst, organisasjoner, fuzzysortConfig)
        .map((underenhet: any) => underenhet.obj);

const matchResultatMedJuridiskEnhet = (
    organisasjonstre: OverenhetOrganisasjon[],
    sokeresultat: Organisasjon[]
): OverenhetOrganisasjon[] => {
    let sokeResultatListe: OverenhetOrganisasjon[] = [];

    organisasjonstre.forEach(juridiskEnhet => {
        let listeMedUnderEnheterFraSokeResultat = juridiskEnhet.UnderOrganisasjoner.filter(
            underenhet => sokeresultat.includes(underenhet)
        );

        if (listeMedUnderEnheterFraSokeResultat.length > 0) {
            sokeResultatListe.push({
                overordnetOrg: juridiskEnhet.overordnetOrg,
                UnderOrganisasjoner: listeMedUnderEnheterFraSokeResultat,
            });
        }
    });

    return sokeResultatListe;
};
