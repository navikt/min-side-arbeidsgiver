import React, {
  FunctionComponent,
  useContext,
  useState,
  useEffect
} from "react";
import { OrganisasjonsListeContext } from "../../../OrganisasjonsListeProvider";

import "./DropDown.less";
import { OrganisasjonsDetaljerContext } from "../../../OrganisasjonDetaljerProvider";
import {
  OverenhetOrganisasjon,
  tomAltinnOrganisasjon
} from "../../../Objekter/organisasjon";

import OrganisasjonsValg from "./AndreNivaDropDown/AndreNivaDropDown";

import OrganisasjonsVisning from "./OrganisasjonsVisning/OrganisasjonsVisning";

import { Undertittel, Element } from "nav-frontend-typografi";
import bedriftsikon from "./OrganisasjonsVisning/bedriftsikon.svg";
import { WrapperState } from "react-aria-menubutton";
import { withRouter, RouteComponentProps } from "react-router";

interface Props {
  className?: string;
}

const AriaMenuButton = require("react-aria-menubutton");

const DropDown: FunctionComponent<Props & RouteComponentProps> = props => {
  const { organisasjonstre } = useContext(OrganisasjonsListeContext);
  const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
  const [erApen, setErApen] = useState(false);
  const [valgtOrgNavn, setValgtOrgNavn] = useState(" ");

  const setOrganisasjonHvisUnderEnhet = (org: OverenhetOrganisasjon) => {
    if (org.overordnetOrg.Type !== "Enterprise") {
      props.history.push("/" + org.overordnetOrg.OrganizationNumber);
      setErApen(false);
    }
  };

  useEffect(() => {
    setErApen(false);
    if (valgtOrganisasjon.Name.length > 23) {
      setValgtOrgNavn(valgtOrganisasjon.Name.substring(0, 22) + "...");
    } else {
      setValgtOrgNavn(valgtOrganisasjon.Name);
    }
  }, [valgtOrganisasjon]);

  const OrganisasjonsMenyKomponenter = organisasjonstre.map(function(
    organisasjon
  ) {
    return (
      <>
        {organisasjon.overordnetOrg.OrganizationNumber !==
          valgtOrganisasjon.OrganizationNumber && (
          <>
            {" "}
            {organisasjon.overordnetOrg.Type === "Enterprise" && (
              <>
                <div className={"organisasjons-meny__juridisk-enhet"}>
                  <img src={bedriftsikon} />

                  <div className="organisasjons-meny__juridisk-enhet-tekst">
                    <Element>{organisasjon.overordnetOrg.Name}</Element>
                    org. nr. {organisasjon.overordnetOrg.OrganizationNumber}
                  </div>
                </div>
                <AriaMenuButton.MenuItem value={organisasjon}>
                  <OrganisasjonsValg hovedOrganisasjon={organisasjon} />
                </AriaMenuButton.MenuItem>
              </>
            )}
            {organisasjon.overordnetOrg.Type !== "Enterprise" && (
              <AriaMenuButton.MenuItem
                className={"organisasjons-meny__underenhet-valg"}
                tabIndex={0}
                value={organisasjon}
              >
                <OrganisasjonsVisning
                  hovedOrganisasjon={organisasjon.overordnetOrg}
                />
              </AriaMenuButton.MenuItem>
            )}
          </>
        )}
      </>
    );
  });

  return (
    <div className={"organisasjons-meny noselect" + props.className}>
      <AriaMenuButton.Wrapper
        className="organisasjons-meny__wrapper"
        style={{ marginTop: 20 }}
        onMenuToggle={(erApen: WrapperState) => {
          setErApen(erApen.isOpen);
        }}
        closeOnSelection={false}
        onSelection={(value: OverenhetOrganisasjon) =>
          setOrganisasjonHvisUnderEnhet(value)
        }
        id={"wrapper-id"}
      >
        {valgtOrganisasjon !== tomAltinnOrganisasjon && (
          <AriaMenuButton.Button className="organisasjons-meny__button">
            <img src={bedriftsikon} />
            <div className="organisasjons-meny__button-tekst">
              <Element>{valgtOrgNavn}</Element>
              org. nr. {valgtOrganisasjon.OrganizationNumber}
            </div>
          </AriaMenuButton.Button>
        )}
        <div
          className={
            erApen
              ? "organisasjons-meny__wrapper-apen"
              : "organisasjons-meny__wrapper-lukket"
          }
        >
          <AriaMenuButton.Menu className={"organisasjons-meny"}>
            <div className={"organisasjons-meny__vis-valgt-bedrift"}>
              <img src={bedriftsikon} />
              <div className="organisasjons-meny__vis-valgt-bedrift-tekst">
                <Undertittel>{valgtOrganisasjon.Name}</Undertittel>
                org. nr. {valgtOrganisasjon.OrganizationNumber}
              </div>
            </div>
            <Undertittel className={"organisasjons-meny__dine-aktorer-tekst"}>
              Dine aktører{" "}
            </Undertittel>
            {OrganisasjonsMenyKomponenter}
          </AriaMenuButton.Menu>
        </div>
      </AriaMenuButton.Wrapper>
    </div>
  );
};

export default withRouter(DropDown);
