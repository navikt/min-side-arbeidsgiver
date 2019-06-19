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
    <tr className={"arbeidsforhold-table__rad"}>
      <td>Kjell Magne</td>
      <td>{arbeidsforhold.arbeidstaker.offentligIdent}</td>
      <td>{arbeidsforhold.arbeidsavtaler[0].yrke}</td>
      <td>{arbeidsforhold.ansettelsesperiode.periode.fom}</td>
      <td>{arbeidsforhold.ansettelsesperiode.periode.tom}</td>
      <td>varslinger</td>
    </tr>
  ));

  return (
    <div className={"hovedside-mine-ansatte"}>
      <table id="arbeidsforholdTable" className={"arbeidsforhold-table"}>
        <tr>
          <th>Navn</th>
          <th>Ident</th>
        </tr>
        {rader}
      </table>
    </div>
  );
};

export default MineAnsatte;
