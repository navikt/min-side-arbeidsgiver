import React, { FunctionComponent } from "react";
import "./OrganisasjonsValg.less";

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
        style={{ marginTop: 20 }}
      >
        <AriaMenuButton.Button className="under-meny__button">
          {props.hovedOrganisasjon.overordnetOrg.Name +
            ", " +
            props.hovedOrganisasjon.overordnetOrg.OrganizationNumber}
          <div className={"under-meny__chevron"}>
            <NedChevron />
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
