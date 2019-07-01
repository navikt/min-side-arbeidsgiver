import React, { FunctionComponent, useContext } from "react";
import { OrganisasjonsListeContext } from "../../../OrganisasjonsListeProvider";

import { withRouter, RouteComponentProps } from "react-router";
import "./DropDown.less";
import { OrganisasjonsDetaljerContext } from "../../../OrganisasjonDetaljerProvider";
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

  const OrganisasjonsMenyKomponenter = organisasjoner.map(function(
    organisasjon,
    index
  ) {
    return (
      <>
        {organisasjon.Name !== valgtOrganisasjon.Name && (
          <AriaMenuButton.MenuItem
            key={index}
            value={organisasjon.ParentOrganizationNumber}
            text={organisasjon.Name}
            className="organisasjons-meny__organisasjon"
          >
            <div className="organisasjons-meny__navn">{organisasjon.Name}</div>
          </AriaMenuButton.MenuItem>
        )}
      </>
    );
  });

  return (
    <AriaMenuButton.Wrapper
      className="organisasjons-meny"
      onSelection={(value: string) => settUrl(value)}
      style={{ marginTop: 20 }}
    >
      <AriaMenuButton.Button className="organisasjons-meny__trigger">
        <span className="organisasjons-meny__tekst">
          {valgtOrganisasjon.Name}
        </span>
      </AriaMenuButton.Button>
      <AriaMenuButton.Menu>{OrganisasjonsMenyKomponenter}</AriaMenuButton.Menu>
    </AriaMenuButton.Wrapper>
  );
};

export default withRouter(DropDown);
