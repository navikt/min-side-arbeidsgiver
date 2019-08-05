import React, {
  FunctionComponent,
  useContext,
  useState,
  useEffect
} from "react";
import { Input } from "nav-frontend-skjema";
import { OrganisasjonsListeContext } from "../../../../OrganisasjonsListeProvider";
import Innholdsboks from "../../../Hovedside/Innholdsboks/Innholdsboks";
import {
  Organisasjon,
  OverenhetOrganisasjon
} from "../../../../Objekter/organisasjon";

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
  const [
    sokeResultatJuridiskeEnheter,
    setSokeResultatJuridiskeEnheter
  ] = useState(organisasjonstre);

  const HentTekstOgSettState = (event: any) => {
    setInputTekst(event.currentTarget.value);
    setSokeResultatUnderEnheter(
      fuzzysort.go(inputTekst, organisasjoner, { key: "Name" })
    );
    setMenyObjekter(lagSokeResultatListe);
    console.log("menyobjekter", menyObjekter);
  };

  const lagSokeResultatListe = (): OverenhetOrganisasjon[] => {
    let sokeResultat = organisasjonstre.filter(juridiskEnhet => {
      console.log("underenheter i sok", sokeResultatUnderEnheter);
      let listeMedUnderEnheterFraSokeResultat: Organisasjon[] = [];
      juridiskEnhet.UnderOrganisasjoner.forEach(underenhet => {
        console.log("for-løkka gjennom underenheter");
        if (sokeResultatUnderEnheter.includes(underenhet)) {
          console.log("underenhet funnet: ", underenhet);
          listeMedUnderEnheterFraSokeResultat.push(underenhet);
        }
      });
      if (listeMedUnderEnheterFraSokeResultat.length > 0) {
        return {
          overordnetOrg: juridiskEnhet.overordnetOrg,
          UnderOrganisasjoner: listeMedUnderEnheterFraSokeResultat
        };
      }
    });
    console.log("sokeResultatsamlet", sokeResultat);

    return sokeResultat;
  };

  return (
    <Innholdsboks>
      <Input
        label={"tekst over"}
        value={inputTekst}
        onChange={HentTekstOgSettState}
      />
    </Innholdsboks>
  );
};

export default Sokefelt;
