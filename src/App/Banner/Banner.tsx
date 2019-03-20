import { Sidetittel } from "nav-frontend-typografi";
import React, { FunctionComponent, useContext } from "react";
import "./Banner.less";
import companyImage from "./company.svg";
import { Select } from "nav-frontend-skjema";
import { OrganisasjonContext } from "../../OrganisasjonProvider";

interface Props {
  tittel: string;
}

const Banner: FunctionComponent<Props> = props => {
  const { organisasjoner, endreOrganisasjon } = useContext(OrganisasjonContext);

  return (
    <div className={"banner"}>
      <img src={companyImage} />
      <Sidetittel className={"banner__tittel"}> {props.tittel} </Sidetittel>
      {organisasjoner.length > 0 && (
        <Select
          className={"banner__organisasjoner"}
          label=""
          onChange={event => endreOrganisasjon(event.target.value)}
        >
          {organisasjoner.map(organisasjon => (
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
