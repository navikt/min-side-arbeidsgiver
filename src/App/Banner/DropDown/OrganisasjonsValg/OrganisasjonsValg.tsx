import React, { FunctionComponent } from "react";
import "./OrganisasjonsValg.less";
import bedriftsikon from "../../OrganisasjonsKnapp/bedriftsikon.svg";
import { Element, Normaltekst } from "nav-frontend-typografi";

import { withRouter, RouteComponentProps } from "react-router";

import { NedChevron } from "nav-frontend-chevron";
import { Organisasjon, OverenhetOrganisasjon } from "../../../../organisasjon";
import OrganisasjonsKnapp from "../../OrganisasjonsKnapp/Organisasjonsknapp";
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
        >
          <OrganisasjonsKnapp hovedOrganisasjon={organisasjon} />
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
        <AriaMenuButton.Button>
          <OrganisasjonsKnapp
            className={"under-meny__hovedknapp"}
            hovedOrganisasjon={props.hovedOrganisasjon.overordnetOrg}
          />
          <div className="under-meny__nedre-button">
            <NedChevron className="under-meny__nedre-button-chevron" />
            Vis {props.hovedOrganisasjon.UnderOrganisasjoner.length}{" "}
            underenheter
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
