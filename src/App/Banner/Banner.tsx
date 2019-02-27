import { Sidetittel } from "nav-frontend-typografi";
import React, { FunctionComponent } from "react";
import "./Banner.less";
import companyImage from "./company.svg";
import { Select } from "nav-frontend-skjema";
import { Organisasjon } from "../../organisasjon";

interface Props {
  tittel: string;
  bildeurl: string;
  organisasjoner: Organisasjon[];
}

const Banner: FunctionComponent<Props> = props => {
  return (
    <div className={"banner"}>
      <img src={companyImage} />
      <Sidetittel className={"banner__tittel"}> {props.tittel} </Sidetittel>

      <Select className={"banner__organisasjoner"} label="Organisasjoner">
        {props.organisasjoner.map(organisasjon => (
          <option key={organisasjon.orgNo} value={organisasjon.navn}>
            {organisasjon.navn}
          </option>
        ))}
      </Select>
    </div>
  );
};

export default Banner;
