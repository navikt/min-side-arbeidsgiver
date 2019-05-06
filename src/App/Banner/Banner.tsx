import { Sidetittel } from "nav-frontend-typografi";
import React, { FunctionComponent, useContext, useEffect } from "react";
import "./Banner.less";
import companyImage from "./company.svg";
import { Select } from "nav-frontend-skjema";
import { Normaltekst } from "nav-frontend-typografi";
import { OrganisasjonsListeContext } from "../../OrganisasjonsListeProvider";
import { OrganisasjonsDetaljerContext } from "../../OrganisasjonDetaljerProvider";

interface Props {
  tittel: string;
}

const Banner: FunctionComponent<Props> = props => {
  const { organisasjoner } = useContext(OrganisasjonsListeContext);
  const { endreOrganisasjon, valgtOrganisasjon } = useContext(
    OrganisasjonsDetaljerContext
  );

  const velgOrganisasjon = async (orgnr: string) => {
    const organisasjon = organisasjoner.find(
      org => orgnr === org.OrganizationNumber
    );
    if (organisasjon) {
      endreOrganisasjon(organisasjon);
    }
  };

  useEffect(() => {
    if (organisasjoner[0]) {
      endreOrganisasjon(organisasjoner[0]);
    }
  }, [organisasjoner]);

  return (
    <div className={"banner"}>
      <div className={"banner_container"}>
        <div className={"banner__ikon-og-overskrift"}>
          <img src={companyImage} alt="Ikon til Banneret på forsiden" />
          <Sidetittel className={"banner__tittel"}> {props.tittel} </Sidetittel>
        </div>
        {organisasjoner.length > 0 && (
          <div className={"banner__select"}>
            <Select
              className={"banner__organisasjoner"}
              label={""}
              onChange={event => velgOrganisasjon(event.target.value)}
            >
              {organisasjoner.map((organisasjon, index) => (
                <option
                  className={"banner__option"}
                  key={index}
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
    </div>
  );
};

export default Banner;
