import React, { FunctionComponent, useContext, useEffect } from "react";
import "./Banner.less";
import { Select } from "nav-frontend-skjema";
import { Normaltekst } from "nav-frontend-typografi";
import { OrganisasjonsListeContext } from "../../OrganisasjonsListeProvider";
import { OrganisasjonsDetaljerContext } from "../../OrganisasjonDetaljerProvider";
import { defaultAltinnOrg } from "../../organisasjon";

interface Props {
  tittel?: string;
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
    console.log("useeffect for banner");
    if (organisasjoner[0] && valgtOrganisasjon === defaultAltinnOrg) {
      endreOrganisasjon(organisasjoner[0]);
    }
  }, [organisasjoner, endreOrganisasjon, valgtOrganisasjon]);

  return (
    <div className={"banner"}>
      {organisasjoner.length > 0 && (
        <div className={"banner__container"}>
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
                {"Org.nr " + valgtOrganisasjon.OrganizationNumber}
              </Normaltekst>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Banner;
