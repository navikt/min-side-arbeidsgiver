import React, { FunctionComponent, useContext, useState } from "react";
import { Input } from "nav-frontend-skjema";
import { OrganisasjonsListeContext } from "../../../OrganisasjonsListeProvider";
import Innholdsboks from "../../Hovedside/Innholdsboks/Innholdsboks";
import {
  Organisasjon,
  OverenhetOrganisasjon
} from "../../../Objekter/organisasjon";

const fuzzysort = require("fuzzysort");

interface Props {
  className?: string;
}

const Sokefelt: FunctionComponent<Props> = props => {
  const { organisasjonstre, organisasjoner } = useContext(
    OrganisasjonsListeContext
  );
  const [inputTekst, setInputTekst] = useState("");
  const [sokeResultatUnderEnheter, setSokeResultatUnderEnheter] = useState(
    organisasjoner
  );
  const [menyObjekter, setMenyObjekter] = useState(organisasjonstre);

  const HentTekstOgSettState = (event: any) => {
    setInputTekst(event.currentTarget.value);
    setSokeResultatUnderEnheter(
      fuzzysort
        .go(inputTekst, organisasjoner, { key: "Name" })
        .map((underenhet: any) => {
          return underenhet.obj;
        })
    );
    setMenyObjekter(lagSokeResultatListe);
  };

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
  console.log("menyobjekter", menyObjekter);

  return (
    <>
      <Innholdsboks>
        <Input
          label={"tekst over"}
          value={inputTekst}
          onChange={HentTekstOgSettState}
        />
      </Innholdsboks>
    </>
  );
};

export default Sokefelt;
