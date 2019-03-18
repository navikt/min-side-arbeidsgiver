import { Sidetittel } from "nav-frontend-typografi";
import React, { FunctionComponent } from "react";
import "./Banner.less";
import companyImage from "./company.svg";
import { Select } from "nav-frontend-skjema";
import { Organisasjon } from "../../organisasjon";

interface Props {
  tittel: string;
  organisasjoner: Organisasjon[];
  organisasjon?: Organisasjon;
  endreOrganisasjon: (organisasjon: string) => void;
}

const Banner: FunctionComponent<Props> = props => {
  return (
    <div className={"banner"}>
      <img src={companyImage} />
      <Sidetittel className={"banner__tittel"}> {props.tittel} </Sidetittel>

      {props.organisasjoner.length > 0 && (
        <Select
          className={"banner__organisasjoner"}
          label=""
          onChange={event => props.endreOrganisasjon(event.target.value)}
        >
          {props.organisasjoner.map(organisasjon => (
            <option
              key={organisasjon.OrganizationNumber}
              value={organisasjon.OrganizationNumber}
            >
              {`${organisasjon.Name} org.nr: ${
                organisasjon.OrganizationNumber
              }`}
            </option>
          ))}
        </Select>
      )}
    </div>
  );
};

export default Banner;
