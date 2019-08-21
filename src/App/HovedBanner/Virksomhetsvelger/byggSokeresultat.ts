import fuzzysort from 'fuzzysort';
import {
    Organisasjon,
    JuridiskEnhetMedUnderEnheterArray,
} from '../../../Objekter/Organisasjoner/OrganisasjonerFraAltinn';

const fuzzysortConfig = {
    key: 'Name',
    allowTypo: false,
    threshold: -1000,
};

export function byggSokeresultat(
    organisasjonstre: JuridiskEnhetMedUnderEnheterArray[],
    organisasjoner: Organisasjon[],
    inputTekst: string
): JuridiskEnhetMedUnderEnheterArray[] {
    const sokeresultat = finnUnderEnheterMedSok(organisasjoner, inputTekst);

    return matchResultatMedJuridiskEnhet(organisasjonstre, sokeresultat);
}

const finnUnderEnheterMedSok = (organisasjoner: Organisasjon[], inputTekst: string) =>
    fuzzysort
        .go(inputTekst, organisasjoner, fuzzysortConfig)
        .map((underenhet: any) => underenhet.obj);

const matchResultatMedJuridiskEnhet = (
    organisasjonstre: JuridiskEnhetMedUnderEnheterArray[],
    sokeresultat: Organisasjon[]
): JuridiskEnhetMedUnderEnheterArray[] => {
    let sokeResultatListe: JuridiskEnhetMedUnderEnheterArray[] = [];

    organisasjonstre.forEach(juridiskEnhet => {
        let listeMedUnderEnheterFraSokeResultat = juridiskEnhet.Underenheter.filter(underenhet =>
            sokeresultat.includes(underenhet)
        );

        if (listeMedUnderEnheterFraSokeResultat.length > 0) {
            sokeResultatListe.push({
                JuridiskEnhet: juridiskEnhet.JuridiskEnhet,
                Underenheter: listeMedUnderEnheterFraSokeResultat,
            });
        }
    });

    return sokeResultatListe;
};
