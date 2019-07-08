import React, { FunctionComponent, useContext } from "react";
import { OrganisasjonsListeContext } from "../../../OrganisasjonsListeProvider";

import { withRouter, RouteComponentProps } from "react-router";
import "./DropDown.less";
import { OrganisasjonsDetaljerContext } from "../../../OrganisasjonDetaljerProvider";
import { tomAltinnOrganisasjon } from "../../../organisasjon";

import OrganisasjonsValg from "./OrganisasjonsValg/OrganisasjonsValg";
import OrganisasjonsKnapp from "../OrganisasjonsKnapp/Organisasjonsknapp";
import { Undertittel, Element } from "nav-frontend-typografi";
import bedriftsikon from "../OrganisasjonsKnapp/bedriftsikon.svg";

const AriaMenuButton = require("react-aria-menubutton");

interface Props {
  className?: string;
}

const DropDown: FunctionComponent<
  Props & RouteComponentProps<{ className: string }>
> = props => {
  const { organisasjonstre } = useContext(OrganisasjonsListeContext);
  const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
  const settUrl = (orgnr: string) => {
    props.history.push("/" + orgnr);
  };

  const OrganisasjonsMenyKomponenter = organisasjonstre.map(function(
    organisasjon,
    index
  ) {
    return (
      <>
        {organisasjon.overordnetOrg.OrganizationNumber !==
          valgtOrganisasjon.OrganizationNumber && (
          <AriaMenuButton.MenuItem
            key={index}
            value={organisasjon.overordnetOrg.OrganizationNumber}
            text={organisasjon.overordnetOrg.Name}
            className="organisasjons-meny__organisasjon"
          >
            <OrganisasjonsKnapp
              hovedOrganisasjon={organisasjon.overordnetOrg}
            />
          </AriaMenuButton.MenuItem>
        )}
      </>
    );
  });

  return (
    <div className="organisasjons-meny">
      <AriaMenuButton.Wrapper
        className="organisasjons-meny__wrapper"
        onSelection={(value: string) => settUrl(value)}
        style={{ marginTop: 20 }}
      >
        {valgtOrganisasjon !== tomAltinnOrganisasjon && (
          <AriaMenuButton.Button className="organisasjons-meny__button">
            <OrganisasjonsKnapp hovedOrganisasjon={valgtOrganisasjon} />
          </AriaMenuButton.Button>
        )}
        <div className="organisasjons-meny__meny-wrapper">
          <AriaMenuButton.Menu className={"organisasjons-meny"}>
            <div className={"organisasjons-meny__vis-valgt"}>
              <img src={bedriftsikon} />
              <div className="organisasjons-meny__vis-valgt-tekst">
                <Undertittel>{valgtOrganisasjon.Name}</Undertittel>
                org. nr. {valgtOrganisasjon.OrganizationNumber}
              </div>
            </div>
            <Undertittel className={"organisasjons-meny__dine-aktorer"}>
              Dine aktører{" "}
            </Undertittel>
            {organisasjonstre.length !== 0 && (
              <OrganisasjonsValg
                className="undermeny"
                hovedOrganisasjon={organisasjonstre[0]}
              />
            )}
            {OrganisasjonsMenyKomponenter}
          </AriaMenuButton.Menu>
        </div>
      </AriaMenuButton.Wrapper>
    </div>
  );
};

export default withRouter(DropDown);
