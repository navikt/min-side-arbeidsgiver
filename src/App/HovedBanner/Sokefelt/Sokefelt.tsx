import {
  Organisasjon,
  OverenhetOrganisasjon
} from "../../../Objekter/organisasjon";

const fuzzysort = require("fuzzysort");

export function LagMenyListe(
  organisasjonstre: OverenhetOrganisasjon[],
  organisasjoner: Organisasjon[],
  inputTekst: string
): OverenhetOrganisasjon[] {
  let sokeResultatUnderEnheter = fuzzysort
    .go(inputTekst, organisasjoner, {
      key: "Name",
      allowTypo: false,
      threshold: -1000
    })
    .map((underenhet: any) => {
      return underenhet.obj;
    });

  const lagSokeResultatListe = (): OverenhetOrganisasjon[] => {
    let sokeResultatListe: OverenhetOrganisasjon[] = [];
    organisasjonstre.forEach(juridiskEnhet => {
      console.log("underenheter i sok", sokeResultatUnderEnheter);
      let listeMedUnderEnheterFraSokeResultat: Organisasjon[] = juridiskEnhet.UnderOrganisasjoner.filter(
        underenhet => {
          console.log("underenhet som blir lest fra jurenhet: ", underenhet);
          if (sokeResultatUnderEnheter.includes(underenhet)) {
            console.log("underenhet funnet: ", underenhet);
            return underenhet;
          }
        }
      );
      console.log(
        "skal være tilhørende underenheter filtrert: ",
        listeMedUnderEnheterFraSokeResultat
      );

      if (listeMedUnderEnheterFraSokeResultat.length > 0) {
        sokeResultatListe.push({
          overordnetOrg: juridiskEnhet.overordnetOrg,
          UnderOrganisasjoner: listeMedUnderEnheterFraSokeResultat
        });
      }
    });

    console.log("sokeResultat", sokeResultatListe);
    return sokeResultatListe;
  };

  return lagSokeResultatListe();
}
