import { Sidetittel } from "nav-frontend-typografi";
import React, { FunctionComponent, useContext } from "react";
import "./Banner.less";
import companyImage from "./company.svg";
import { Select } from "nav-frontend-skjema";
import { Organisasjon } from "../../organisasjon";
import { OrganisasjonContext } from "../../OrganisasjonProvider";

interface Props {
  tittel: string;
}

const Banner: FunctionComponent<Props> = props => {
  const context = useContext(OrganisasjonContext);
  return (
    <div className={"banner"}>
      <img src={companyImage} />
      <Sidetittel className={"banner__tittel"}> {props.tittel} </Sidetittel>
      {context.organisasjoner.length > 0 && (
        <Select
          className={"banner__organisasjoner"}
          label=""
          onChange={event => context.endreOrganisasjon(event.target.value)}
        >
          {context.organisasjoner.map(organisasjon => (
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
