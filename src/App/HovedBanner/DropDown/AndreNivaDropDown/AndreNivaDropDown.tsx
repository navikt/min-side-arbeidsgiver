import React, { FunctionComponent, useState } from "react";
import "./AndreNivaDropDown.less";
import { Collapse } from "react-collapse";

import { withRouter, RouteComponentProps } from "react-router";

import { NedChevron, OppChevron } from "nav-frontend-chevron";
import {
  Organisasjon,
  OverenhetOrganisasjon
} from "../../../../Objekter/organisasjon";

import { WrapperState } from "react-aria-menubutton";
import OrganisasjonsVisning from "../OrganisasjonsVisning/OrganisasjonsVisning";

const AriaMenuButton = require("react-aria-menubutton");

interface Props {
  className?: string;
  hovedOrganisasjon: OverenhetOrganisasjon;
}

const AndreNivaDropDown: FunctionComponent<
  Props & RouteComponentProps<{ className: string }>
> = props => {
  const settUrl = (orgnr: string) => {
    props.history.push("/" + orgnr);
  };

  const [erApen, setErApen] = useState(false);

  const OrganisasjonsMenyKomponenter = props.hovedOrganisasjon.UnderOrganisasjoner.map(
    function(organisasjon: Organisasjon) {
      return (
        <AriaMenuButton.MenuItem
          key={organisasjon.OrganizationNumber}
          value={organisasjon.OrganizationNumber}
          text={organisasjon.Name}
          tabIndex={0}
          className="under-meny__menyobjekt"
        >
          <OrganisasjonsVisning hovedOrganisasjon={organisasjon} />
        </AriaMenuButton.MenuItem>
      );
    }
  );

  return (
    <div className="under-meny">
      <AriaMenuButton.Wrapper
        className="under-meny__wrapper"
        onSelection={(value: string) => settUrl(value)}
        closeOnSelection={false}
        onMenuToggle={(erApen: WrapperState) => {
          setErApen(erApen.isOpen);
          if (props.hovedOrganisasjon.overordnetOrg.Type !== "Enterprise") {
            settUrl(props.hovedOrganisasjon.overordnetOrg.OrganizationNumber);
          }
        }}
      >
        <AriaMenuButton.Button className={"under-meny__nedre-button"}>
          {!erApen && (
            <>
              <NedChevron className="under-meny__nedre-button-chevron" />
              Vis {props.hovedOrganisasjon.UnderOrganisasjoner.length}{" "}
              underenheter
            </>
          )}
          {erApen && (
            <>
              <OppChevron className="under-meny__nedre-button-chevron" />
              Skjul {props.hovedOrganisasjon.UnderOrganisasjoner.length}{" "}
              underenheter
            </>
          )}
        </AriaMenuButton.Button>

        <div className="under-meny__meny-wrapper">
          <Collapse isOpened={true || false}>
            <AriaMenuButton.Menu className={"under-meny"}>
              {OrganisasjonsMenyKomponenter}
            </AriaMenuButton.Menu>
          </Collapse>
        </div>
      </AriaMenuButton.Wrapper>
    </div>
  );
};

export default withRouter(AndreNivaDropDown);
