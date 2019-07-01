import React, { FunctionComponent, useContext } from "react";
import { OrganisasjonsListeContext } from "../../../OrganisasjonsListeProvider";

import { withRouter, RouteComponentProps } from "react-router";
import "./DropDown.less";
import { OrganisasjonsDetaljerContext } from "../../../OrganisasjonDetaljerProvider";
import { tomAltinnOrganisasjon } from "../../../organisasjon";
import { NedChevron } from "nav-frontend-chevron";
const AriaMenuButton = require("react-aria-menubutton");

interface Props {
  className?: string;
}

const DropDown: FunctionComponent<
  Props & RouteComponentProps<{ className: string }>
> = props => {
  const { organisasjoner } = useContext(OrganisasjonsListeContext);
  const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
  const settUrl = (orgnr: string) => {
    props.history.push("/" + orgnr);
  };

  const skrivSomSmaBokstaver = (orgnavn: string): string => {
    let nyString = orgnavn[0].toLocaleUpperCase();
    for (let index: number = 1; index < orgnavn.length; index++) {
      if (orgnavn[index - 1] === " ") {
        nyString += orgnavn[index];
      } else {
        nyString += orgnavn[index].toLocaleLowerCase();
      }
    }
    return nyString;
  };

  const OrganisasjonsMenyKomponenter = organisasjoner.map(function(
    organisasjon,
    index
  ) {
    return (
      <>
        {organisasjon.Name !== valgtOrganisasjon.Name && (
          <AriaMenuButton.MenuItem
            key={index}
            value={organisasjon.OrganizationNumber}
            text={skrivSomSmaBokstaver(organisasjon.Name)}
            className="organisasjons-meny__organisasjon"
          >
            <div className="organisasjons-meny__navn">{organisasjon.Name}</div>
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
            {valgtOrganisasjon.Name}
            <div className={"organisasjons-meny__chevron"}>
              <NedChevron />
            </div>
          </AriaMenuButton.Button>
        )}
        <AriaMenuButton.Menu className={"organisasjons-meny"}>
          {OrganisasjonsMenyKomponenter}
        </AriaMenuButton.Menu>
      </AriaMenuButton.Wrapper>
    </div>
  );
};

export default withRouter(DropDown);
