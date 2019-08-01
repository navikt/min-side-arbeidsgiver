import React, {
  FunctionComponent,
  useContext,
  useState,
  useEffect
} from "react";
import { Input } from "nav-frontend-skjema";
import { OrganisasjonsListeContext } from "../../../OrganisasjonsListeProvider";
import { OverenhetOrganisasjon } from "../../../Objekter/organisasjon";
import Innholdsboks from "../../Hovedside/Innholdsboks/Innholdsboks";
const fuzzysort = require("fuzzysort");
const AriaMenuButton = require("react-aria-menubutton");

interface Props {
  className?: string;
}

const Sokefelt: FunctionComponent<Props> = props => {
  const { organisasjonstre } = useContext(OrganisasjonsListeContext);
  const [inputTekst, setInputTekst] = useState("");

  const HentTekstOgSettState = (event: any) => {
    setInputTekst(event.currentTarget.value);
  };

  useEffect(() => {
    //if (document.getElementById("input-felt").value) !== null {
    //console.log(document.getElementById("input-felt").value);
  }, []);

  const LagListeBasertPaSok = () => {};

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
