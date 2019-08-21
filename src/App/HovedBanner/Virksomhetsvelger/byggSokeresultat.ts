import fuzzysort from 'fuzzysort';
import {
    Organisasjon,
    JuridiskEnhetMedUnderEnheter,
} from '../../../Objekter/Organisasjoner/OrganisasjonerFraAltinn';

const fuzzysortConfig = {
    key: 'Name',
    allowTypo: false,
    threshold: -1000,
};

export function byggSokeresultat(
    organisasjonstre: JuridiskEnhetMedUnderEnheter[],
    organisasjoner: Organisasjon[],
    inputTekst: string
): JuridiskEnhetMedUnderEnheter[] {
    const sokeresultat = finnUnderEnheterMedSok(organisasjoner, inputTekst);

    return matchResultatMedJuridiskEnhet(organisasjonstre, sokeresultat);
}

const finnUnderEnheterMedSok = (organisasjoner: Organisasjon[], inputTekst: string) =>
    fuzzysort
        .go(inputTekst, organisasjoner, fuzzysortConfig)
        .map((underenhet: any) => underenhet.obj);

const matchResultatMedJuridiskEnhet = (
    organisasjonstre: JuridiskEnhetMedUnderEnheter[],
    sokeresultat: Organisasjon[]
): JuridiskEnhetMedUnderEnheter[] => {
    let sokeResultatListe: JuridiskEnhetMedUnderEnheter[] = [];

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
