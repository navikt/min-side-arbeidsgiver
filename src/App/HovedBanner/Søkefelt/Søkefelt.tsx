import React, {
  FunctionComponent,
  useContext,
  useState,
  useEffect
} from "react";
import { Input } from "nav-frontend-skjema";
import { OrganisasjonsListeContext } from "../../../OrganisasjonsListeProvider";
import {
  Organisasjon,
  OverenhetOrganisasjon
} from "../../../Objekter/organisasjon";
import Innholdsboks from "../../Hovedside/Innholdsboks/Innholdsboks";
const fuzzysort = require("fuzzysort");
const AriaMenuButton = require("react-aria-menubutton");

interface Props {
  className?: string;
}

const Sokefelt: FunctionComponent<Props> = props => {
  const { organisasjoner } = useContext(OrganisasjonsListeContext);
  const [inputTekst, setInputTekst] = useState("");
  const [sokeResultat, setSokeResultat] = useState(organisasjoner);

  const HentTekstOgSettState = (event: any) => {
    setInputTekst(event.currentTarget.value);
    setSokeResultat(fuzzysort.go(inputTekst, organisasjoner, { key: "Name" }));
    console.log(sokeResultat);
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
