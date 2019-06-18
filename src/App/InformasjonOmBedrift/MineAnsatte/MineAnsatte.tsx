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

  useEffect(() => {}, [mineAnsatte]);

  return (
    <div className={"hovedside-mine-ansatte"}>
      <table id="myTable">
        <tr>
          <td>cell 1</td>
          <td>cell 2</td>
        </tr>
        <tr>
          <td>cell 3</td>
          <td>cell 4</td>
        </tr>
      </table>
    </div>
  );
};

export default MineAnsatte;
