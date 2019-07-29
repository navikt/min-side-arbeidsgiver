import React, { FunctionComponent, useState } from "react";
import "./AndreNivaDropDown.less";

import { withRouter, RouteComponentProps } from "react-router";

import { NedChevron, OppChevron } from "nav-frontend-chevron";
import {
  Organisasjon,
  OverenhetOrganisasjon
} from "../../../../Objekter/organisasjon";
import OrganisasjonsVisning from "../../OrganisasjonsVisning/OrganisasjonsVisning";
import { WrapperState } from "react-aria-menubutton";

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
          console.log("onToggle kalt");
          setErApen(erApen.isOpen);
          if (props.hovedOrganisasjon.overordnetOrg.Type !== "Enterprise") {
            settUrl(props.hovedOrganisasjon.overordnetOrg.OrganizationNumber);
            console.log(
              "orgtype: ",
              props.hovedOrganisasjon.overordnetOrg.Type
            );
          }
        }}
      >
        {props.hovedOrganisasjon.overordnetOrg.Type !== "Enterprise" && (
          <AriaMenuButton.Button className={"under-meny__underenhet-valg"}>
            <OrganisasjonsVisning
              hovedOrganisasjon={props.hovedOrganisasjon.overordnetOrg}
            />
          </AriaMenuButton.Button>
        )}

        {props.hovedOrganisasjon.overordnetOrg.Type === "Enterprise" && (
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
        )}

        <div className="under-meny__meny-wrapper">
          <AriaMenuButton.Menu className={"under-meny"}>
            {OrganisasjonsMenyKomponenter}
          </AriaMenuButton.Menu>
        </div>
      </AriaMenuButton.Wrapper>
    </div>
  );
};

export default withRouter(AndreNivaDropDown);
