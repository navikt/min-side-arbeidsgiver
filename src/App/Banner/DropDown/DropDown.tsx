import React, { FunctionComponent, useContext } from "react";
import { OrganisasjonsListeContext } from "../../../OrganisasjonsListeProvider";
const AriaMenuButton = require("react-aria-menubutton");
import { withRouter, RouteComponentProps } from "react-router";

import { Button, Wrapper, Menu, MenuItem } from "react-aria-menubutton";



const DropDown: FunctionComponent<
    RouteComponentProps<>
    > = props => {
  const { organisasjoner } = useContext(OrganisasjonsListeContext);
  const settUrl = (orgnr: string) => {
    props.history.push("/" + orgnr);
  };


  const OrganisasjonsMenyKomponenter = organisasjoner.map(function(organisasjon, index) {
    return (
        <AriaMenuButton.MenuItem
            key={index}
            tag='li'
            value={organisasjon.ParentOrganizationNumber}
            text={organisasjon.Name}
            className='organisasjonsmeny-organisasjon'
        >
          <div className='organisasjonsmeny-navn'>
            {organisasjon.Name}
          </div>
        </AriaMenuButton.MenuItem>
      );
  });

  return (
      <Wrapper
          className='MyMenuButton'
          onSelection={settUrl()}
      >
        <Button className='MyMenuButton-button'>
          click me
        </Button>
        <Menu className='MyMenuButton-menu'>
          <ul>{OrganisasjonsMenyKomponenter}</ul>
        </Menu>
      </Wrapper>
  );
}
};

export default withRouter(DropDown);
