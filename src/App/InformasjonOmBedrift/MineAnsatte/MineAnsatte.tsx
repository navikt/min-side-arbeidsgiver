import React, { FunctionComponent, useContext, useState } from "react";
import "./MineAnsatte.less";
import { OrganisasjonsDetaljerContext } from "../../../OrganisasjonDetaljerProvider";

interface Props {
  className?: string;
}

const MineAnsatte: FunctionComponent<Props> = props => {
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
    <div className={"hovedside-mine-ansatte"}>
      <table id="arbeidsforholdTable" className={"arbeidsforhold-table"}>
        <tr>
          <th className={"th"}>Navn</th>
          <th className={"th"}>Fødselsnummer</th>
          <th className={"th"}>Yrke</th>
          <th className={"th"}>Startdato</th>
          <th className={"th"}>Sluttdato</th>
          <th className={"th"}>Varsel</th>
        </tr>
        {rader}
      </table>
    </div>
  );
};

export default MineAnsatte;
