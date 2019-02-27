import { Sidetittel } from "nav-frontend-typografi";
import React, { FunctionComponent } from "react";
import "./Banner.less";
import companyImage from "./company.svg";
import { Select } from "nav-frontend-skjema";

interface Props {
  tittel: string;
  bildeurl: string;
  organisasjoner: string[];
}

const Banner: FunctionComponent<Props> = props => {
  return (
    <div className={"banner"}>
      <img src={companyImage} />
      <Sidetittel className={"banner__tittel"}> {props.tittel} </Sidetittel>

      <Select className={"banner__organisasjoner"} label="Organisasjoner">
        {props.organisasjoner.map(organisasjon => (
          <option key={organisasjon} value={organisasjon}>
            {organisasjon}
          </option>
        ))}
      </Select>
    </div>
  );
};

export default Banner;
