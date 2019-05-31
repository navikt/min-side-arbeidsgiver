import React, { FunctionComponent, useContext, useEffect, useRef } from "react";
import "./Banner.less";
import { Select } from "nav-frontend-skjema";
import { Normaltekst } from "nav-frontend-typografi";
import { OrganisasjonsListeContext } from "../../OrganisasjonsListeProvider";
import { OrganisasjonsDetaljerContext } from "../../OrganisasjonDetaljerProvider";
import { defaultAltinnOrg, Organisasjon } from "../../organisasjon";
import { logInfo } from "../../utils/metricsUtils";
import { withRouter, RouteComponentProps } from "react-router";

interface Props {
  tittel?: string;
}

const Banner: FunctionComponent<
  Props & RouteComponentProps<{ orgnummer: string }>
> = props => {
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
      props.history.replace("/" + orgnr);
    }
  };

  useEffect(() => {
    const previousOrg: Organisasjon = valgtOrganisasjon;
    let orgnr = props.location.pathname.split("/")[1];
    if (orgnr && orgnr.length > 0 && orgnr !== previousOrg.OrganizationNumber) {
      orgnr = props.location.pathname.split("/")[1];
      const organisasjon = organisasjoner.find(
        org => orgnr === org.OrganizationNumber
      );
      if (organisasjon && organisasjon !== previousOrg) {
        velgOrganisasjon(organisasjon.OrganizationNumber);
        console.log("endre organisasjon valgt i useEffect 1");
      }
    }
  }, [
    organisasjoner,
    velgOrganisasjon,
    valgtOrganisasjon,
    props.location.pathname
  ]);

  useEffect(() => {
    const previousOrg: Organisasjon = valgtOrganisasjon;
    let orgnr = props.location.pathname.split("/")[1];
    if (orgnr && orgnr.length > 0 && orgnr !== previousOrg.OrganizationNumber) {
      //velgOrganisasjon(props.location.pathname.split('/')[1]);
      orgnr = props.location.pathname.split("/")[1];
      const organisasjon = organisasjoner.find(
        org => orgnr === org.OrganizationNumber
      );
      if (organisasjon && organisasjon !== previousOrg) {
        velgOrganisasjon(organisasjon.OrganizationNumber);
      }
    } else if (organisasjoner[0] && valgtOrganisasjon === defaultAltinnOrg) {
      console.log("endre til foerste org");
      velgOrganisasjon(organisasjoner[0].OrganizationNumber);
    }
  }, [
    organisasjoner,
    valgtOrganisasjon,
    velgOrganisasjon,
    props.location.pathname
  ]);

  if (valgtOrganisasjon) {
    logInfo(
      "besok fra organisasjon: " + valgtOrganisasjon.OrganizationNumber,
      valgtOrganisasjon.OrganizationNumber
    );
  }

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
                  selected={organisasjon === valgtOrganisasjon}
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

export default withRouter(Banner);
