import React, { FunctionComponent, useContext, useState } from "react";
import "./TabellMineAnsatte.less";
import { OrganisasjonsDetaljerContext } from "../../../../OrganisasjonDetaljerProvider";
import { Normaltekst } from "nav-frontend-typografi";

interface Props {
  className?: string;
}

const TabellMineAnsatte: FunctionComponent<Props> = props => {
  const { mineAnsatte } = useContext(OrganisasjonsDetaljerContext);
  const [arraySomVises, setArraySomVises] = useState(mineAnsatte);

  const rader = mineAnsatte.map(arbeidsforhold => (
    <tr className={"tr"}>
      <td className={"td"}>Kjell Magne</td>
      <td className={"td"}>{arbeidsforhold.arbeidstaker.offentligIdent}</td>
      <td className={"td"}>{arbeidsforhold.arbeidsavtaler[0].yrke}</td>
      <td className={"td"}>{arbeidsforhold.ansettelsesperiode.periode.fom}</td>
      <td className={"td"}>{arbeidsforhold.ansettelsesperiode.periode.tom}</td>
      <td className={"td"}>varslinger</td>
    </tr>
  ));

  return (
    <table id="arbeidsforholdTable" className={"arbeidsforhold-table"}>
      <thead className="thead">
        <tr>
          <th className={"th"}>Navn</th>
          <th className={"th"}>Fødselsnummer</th>
          <th className={"th"}>Yrke</th>
          <th className={"th"}>Startdato</th>
          <th className={"th"}>Sluttdato</th>
          <th className={"th"}>Varsel</th>
        </tr>
      </thead>
      {rader}
    </table>
  );
};

export default TabellMineAnsatte;
