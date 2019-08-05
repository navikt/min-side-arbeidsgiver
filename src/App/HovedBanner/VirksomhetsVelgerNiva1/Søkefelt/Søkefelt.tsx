import React, {
  FunctionComponent,
  useContext,
  useState,
  useEffect
} from "react";
import { Input } from "nav-frontend-skjema";
import { OrganisasjonsListeContext } from "../../../../OrganisasjonsListeProvider";
import Innholdsboks from "../../../Hovedside/Innholdsboks/Innholdsboks";
import {Organisasjon, OverenhetOrganisasjon, tomAltinnOrganisasjon} from "../../../../Objekter/organisasjon";
import {EnhetsregisteretOrg} from "../../../../Objekter/enhetsregisteretOrg";
import {hentOverordnetEnhet} from "../../../../api/enhetsregisteretApi";
const fuzzysort = require("fuzzysort");

interface Props {
  className?: string;
}

const Sokefelt: FunctionComponent<Props> = props => {
  const { organisasjonstre, organisasjoner } = useContext(OrganisasjonsListeContext);
  const [inputTekst, setInputTekst] = useState("");
  const [sokeResultatUnderEnheter, setSokeResultatUnderEnheter] = useState(organisasjonstre);
  const [sokeResultatJuridiskeEnheter, setSokeResultatJuridiskeEnheter] = useState(organisasjonstre);

  const HentTekstOgSettState = (event: any) => {
    setInputTekst(event.currentTarget.value);
    setSokeResultatUnderEnheter(fuzzysort.go(inputTekst, organisasjonstre, { key: "Name" }));
    console.log(sokeResultatUnderEnheter);
  };


  const lagSokeResultatListe = (): OverenhetOrganisasjon[] => {
    let kopiAvOrganisansonsTre: OverenhetOrganisasjon[] = [];
    let SokeResultat: OverenhetOrganisasjon[];
    kopiAvOrganisansonsTre.forEach( juridiskEnhet => {
      let listeMedUnderEnheterFraSokeResultat: Organisasjon[];
      juridiskEnhet.UnderOrganisasjoner.forEach(underenhet => {
        if (sokeResultatUnderEnheter.find(underenhet)) {
          listeMedUnderEnheterFraSokeResultat.push(underenhet);

        }
      });






    }
    return SokeResultat;

  }
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
