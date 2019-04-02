import { Sidetittel } from "nav-frontend-typografi";
import React, { FunctionComponent, useContext } from "react";
import "./Banner.less";
import companyImage from "./company.svg";
import { Select } from "nav-frontend-skjema";
import { OrganisasjonsListeContext } from "../../OrganisasjonsListeProvider";
import { Normaltekst } from "nav-frontend-typografi";
import { OrganisasjonsDetaljerContext } from "../../OrganisasjonDetaljerProvider";

interface Props {
  tittel: string;
}

const Banner: FunctionComponent<Props> = props => {
  const { organisasjoner } = useContext(OrganisasjonsListeContext);
  const { endreOrganisasjon, valgtOrganisasjon } = useContext(
    OrganisasjonsDetaljerContext
  );

  const setValgtOrganisasjonIBanner = async (orgnr: string) => {
    const organisasjon = organisasjoner.find(
      org => orgnr === org.OrganizationNumber
    );
    if (organisasjon) {
      endreOrganisasjon(organisasjon);
    }
  };

  return (
    <div className={"banner"}>
      <img src={companyImage} alt="Ikon til Banneret på forsiden" />
      <Sidetittel className={"banner__tittel"}> {props.tittel} </Sidetittel>
      {organisasjoner.length > 0 && (
        <div className={"banner__select"}>
          <Select
            className={"banner__organisasjoner"}
            label={""}
            onChange={event => setValgtOrganisasjonIBanner(event.target.value)}
          >
            {organisasjoner.map(organisasjon => (
              <option
                className={"banner__option"}
                key={organisasjon.OrganizationNumber}
                value={organisasjon.OrganizationNumber}
              >
                {organisasjon.Name}
              </option>
            ))}
          </Select>
          {valgtOrganisasjon && (
            <Normaltekst className={"banner__orgnr"}>
              {"Org.nr " + valgtOrganisasjon.OrganizationNumber}{" "}
            </Normaltekst>
          )}
        </div>
      )}
    </div>
  );
};

export default Banner;
