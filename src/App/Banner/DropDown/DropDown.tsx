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
  const [valgtOrgNavn, setValgtOrgNavn] = useState(" ");

  useEffect(() => {
    if (valgtOrganisasjon.Name.length > 23) {
      setValgtOrgNavn(valgtOrganisasjon.Name.substring(0, 22) + "...");
    } else {
      setValgtOrgNavn(valgtOrganisasjon.Name);
      setErApen(false);
    }
  }, [valgtOrganisasjon]);

  const OrganisasjonsMenyKomponenter = organisasjonstre.map(function(
    organisasjon
  ) {
    return (
      <>
        {organisasjon.overordnetOrg.OrganizationNumber !==
          valgtOrganisasjon.OrganizationNumber && (
          <AriaMenuButton.MenuItem>
            {" "}
            {organisasjon.overordnetOrg.Type === "Enterprise" && (
              <div className={"organisasjons-meny__juridisk-enhet"}>
                <img src={bedriftsikon} />

                <div className="organisasjons-meny__juridisk-enhet-tekst">
                  <Element>{organisasjon.overordnetOrg.Name}</Element>
                  org. nr. {organisasjon.overordnetOrg.OrganizationNumber}
                </div>
              </div>
            )}
            <OrganisasjonsValg hovedOrganisasjon={organisasjon} />
          </AriaMenuButton.MenuItem>
        )}
      </>
    );
  });

  return (
    <div className="organisasjons-meny noselect">
      <AriaMenuButton.Wrapper
        className="organisasjons-meny__wrapper"
        style={{ marginTop: 20 }}
        onMenuToggle={(erApen: WrapperState) => setErApen(erApen.isOpen)}
        closeOnSelection={false}
        id={"wrapper-id"}
      >
        {valgtOrganisasjon !== tomAltinnOrganisasjon && (
          <AriaMenuButton.Button className="organisasjons-meny__button">
            <img src={bedriftsikon} />
            <div className="organisasjons-meny__button-tekst">
              <Element>{valgtOrgNavn}</Element>
              org. nr. {valgtOrganisasjon.OrganizationNumber}
            </div>
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
