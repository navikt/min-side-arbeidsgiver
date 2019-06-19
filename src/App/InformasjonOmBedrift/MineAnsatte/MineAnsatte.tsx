import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState
} from "react";

import Lenkepanel from "nav-frontend-lenkepanel";
import { OrganisasjonsDetaljerContext } from "../../../OrganisasjonDetaljerProvider";

interface Props {
  className?: string;
}

const MineAnsatte: FunctionComponent<Props> = props => {
  const { mineAnsatte } = useContext(OrganisasjonsDetaljerContext);
  const [arraySomVises, setArraySomVises] = useState(mineAnsatte);

  useEffect(() => {
    let index: number = 0;
    let table = document.getElementById("arbeidsforholdTable");
    mineAnsatte.forEach(function(arbeidsforhold) {
      let row = table.insertRow(index);
      let col1 = row.insertCell(0);
      col1.innerHTML = "Kjell Magne";
      let col2 = row.insertCell(1);
      col2.innerHTML = arbeidsforhold.arbeidstaker.offentligIdent;
      let col3 = row.insertCell(2);
      col3.innerHTML = arbeidsforhold.arbeidsavtaler[0].yrke;
      let col4 = row.insertCell(3);
      col4.innerHTML = arbeidsforhold.ansettelsesperiode.periode.fom;
      let col5 = row.insertCell(4);
      col5.innerHTML = arbeidsforhold.ansettelsesperiode.periode.tom;
      let col6 = row.insertCell(5);
      col6.innerHTML = "varslinger";
    });
  }, [mineAnsatte]);

  return (
    <div className={"hovedside-mine-ansatte"}>
      <table id="arbeidsforholdTable" />
    </div>
  );
};

export default MineAnsatte;
