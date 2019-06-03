import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useCallback
} from "react";
import "./Banner.less";
import { Select } from "nav-frontend-skjema";
import { Normaltekst } from "nav-frontend-typografi";
import { OrganisasjonsListeContext } from "../../OrganisasjonsListeProvider";
import { OrganisasjonsDetaljerContext } from "../../OrganisasjonDetaljerProvider";
import { tomAltinnOrganisasjon, Organisasjon } from "../../organisasjon";
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
  console.log("rendrer Banner");

  const endreOrgCallback = useCallback(
    orgnr => {
      const organisasjon = organisasjoner.find(
        org => org.OrganizationNumber === orgnr
      );
      const lengdeMidlertidigUrl = props.location.pathname.length;
      if (organisasjon && organisasjon !== valgtOrganisasjon) {
        endreOrganisasjon(organisasjon);
      }
      if (lengdeMidlertidigUrl === 30) {
        props.history.replace("/" + orgnr + "/bedriftsinformasjon");
      } else {
        props.history.replace("/" + orgnr);
      }
    },
    [
      endreOrganisasjon,
      organisasjoner,
      props.history,
      props.location.pathname,
      valgtOrganisasjon
    ]
  );

  useEffect(() => {
    const forrigeOrganisasjon: Organisasjon = valgtOrganisasjon;
    console.log("useEffect i banner kallt: forrige org: ", forrigeOrganisasjon);
    let orgnrFraUrl = props.location.pathname.split("/")[1];
    console.log("orgnr i url; ", orgnrFraUrl);
    const orgnrErSattIUrl = orgnrFraUrl && orgnrFraUrl.length > 0;

    if (
      orgnrErSattIUrl &&
      orgnrFraUrl !== forrigeOrganisasjon.OrganizationNumber
    ) {
      console.log(
        "org finnes i url og er forskjellig fra forrige org, forrige org var: ",
        forrigeOrganisasjon.Name
      );
      const organisasjonFraListe = organisasjoner.find(
        organisasjon => orgnrFraUrl === organisasjon.OrganizationNumber
      );
      if (organisasjonFraListe) {
        console.log("org nr fra url finnes i lista");
        endreOrgCallback(organisasjonFraListe.OrganizationNumber);
      }
    } else if (
      organisasjoner[0] &&
      valgtOrganisasjon === tomAltinnOrganisasjon
    ) {
      console.log("foerste bedrift velges til foerste i lista");
      endreOrgCallback(organisasjoner[0].OrganizationNumber);
    }
    console.log(
      "useEffect i banner siste linje, organisasjoner satt til: ",
      organisasjoner
    );
  }, [
    organisasjoner,
    valgtOrganisasjon,
    props.location.pathname,
    endreOrgCallback
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
              onChange={event => endreOrgCallback(event.target.value)}
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
