import React, {
  FunctionComponent,
  useContext,
  useState,
  useEffect
} from "react";
import { OrganisasjonsListeContext } from "../../../OrganisasjonsListeProvider";

import { withRouter, RouteComponentProps } from "react-router";
import "./DropDown.less";
import { OrganisasjonsDetaljerContext } from "../../../OrganisasjonDetaljerProvider";
import { tomAltinnOrganisasjon } from "../../../organisasjon";

import OrganisasjonsValg from "./OrganisasjonsValg/OrganisasjonsValg";
import OrganisasjonsKnapp from "../OrganisasjonsKnapp/Organisasjonsknapp";
import { Undertittel, Element } from "nav-frontend-typografi";
import bedriftsikon from "../OrganisasjonsKnapp/bedriftsikon.svg";
import { WrapperState } from "react-aria-menubutton";

const AriaMenuButton = require("react-aria-menubutton");

interface Props {
  className?: string;
}

const DropDown: FunctionComponent<
  Props & RouteComponentProps<{ className: string }>
> = props => {
  const { organisasjonstre } = useContext(OrganisasjonsListeContext);
  const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
  const [erApen, setErApen] = useState(false);
  const settUrl = (orgnr: string) => {
    props.history.push("/" + orgnr);
  };

  console.log(organisasjonstre);

  const OrganisasjonsMenyKomponenter = organisasjonstre.map(function(
    organisasjon,
    index
  ) {
    return (
      <>
        {organisasjon.overordnetOrg.OrganizationNumber !==
          valgtOrganisasjon.OrganizationNumber && (
          <>
            {" "}
            {organisasjon.overordnetOrg.OrganizationForm === "BEDR" && (
              <AriaMenuButton.MenuItem
                key={index}
                value={organisasjon.overordnetOrg.OrganizationNumber}
                text={organisasjon.overordnetOrg.Name}
                className={"organisasjons-meny__organisasjon}"}
              >
                <OrganisasjonsKnapp
                  hovedOrganisasjon={organisasjon.overordnetOrg}
                />
              </AriaMenuButton.MenuItem>
            )}
            {organisasjon.overordnetOrg.Type === "Enterprise" && (
              <OrganisasjonsValg hovedOrganisasjon={organisasjon} />
            )}
          </>
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
        onMenuToggle={(erApen: WrapperState) => setErApen(erApen.isOpen)}
      >
        {valgtOrganisasjon !== tomAltinnOrganisasjon && (
          <AriaMenuButton.Button className="organisasjons-meny__button">
            <OrganisasjonsKnapp hovedOrganisasjon={valgtOrganisasjon} />
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
