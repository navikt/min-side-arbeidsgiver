import React, { FunctionComponent } from "react";
import "./OrganisasjonsValg.less";
import bedriftsikon from "./bedriftsikon.svg";
import { Element, Normaltekst } from "nav-frontend-typografi";

import { withRouter, RouteComponentProps } from "react-router";

import { NedChevron } from "nav-frontend-chevron";
import { Organisasjon, OverenhetOrganisasjon } from "../../../../organisasjon";
const AriaMenuButton = require("react-aria-menubutton");

interface Props {
  className?: string;
  hovedOrganisasjon: OverenhetOrganisasjon;
}

const DropDownElement: FunctionComponent<
  Props & RouteComponentProps<{ className: string }>
> = props => {
  const settUrl = (orgnr: string) => {
    props.history.push("/" + orgnr);
  };

  const OrganisasjonsMenyKomponenter = props.hovedOrganisasjon.UnderOrganisasjoner.map(
    function(organisasjon: Organisasjon) {
      return (
        <AriaMenuButton.MenuItem
          key={organisasjon.OrganizationNumber}
          value={organisasjon.OrganizationNumber}
          text={organisasjon.Name}
          className="under-meny__organisasjon"
        >
          <div className="under-meny__navn">{organisasjon.Name}</div>
        </AriaMenuButton.MenuItem>
      );
    }
  );

  return (
    <div className="under-meny">
      <AriaMenuButton.Wrapper
        className="under-meny__wrapper"
        onSelection={(value: string) => settUrl(value)}
      >
        <AriaMenuButton.Button className="under-meny__button">
          <img src={bedriftsikon} />
          <div className="under-meny__button-tekst">
            <Element>{props.hovedOrganisasjon.overordnetOrg.Name}</Element>
            org. nr. {props.hovedOrganisasjon.overordnetOrg.OrganizationNumber}
          </div>
        </AriaMenuButton.Button>
        <div className="under-meny__meny-wrapper">
          <AriaMenuButton.Menu className={"under-meny"}>
            {OrganisasjonsMenyKomponenter}
          </AriaMenuButton.Menu>
        </div>
      </AriaMenuButton.Wrapper>
    </div>
  );
};

export default withRouter(DropDownElement);
