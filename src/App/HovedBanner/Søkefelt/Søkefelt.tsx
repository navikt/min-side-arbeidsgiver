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

  const LagListeBasertPaSok = (orgnr: string) => {};

  return (
    <Innholdsboks>
      <input type="text" name="FirstName" />
    </Innholdsboks>
  );
};

export default Sokefelt;
