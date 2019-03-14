import React, { Component } from "react";
import { hentOrganisasjoner } from "../../api/dnaApi";
import sykeIkon from "../iconSykemeldte.svg";
import rekrutteringsIkon from "../iconRekruttering.svg";
import { Organisasjon } from "../../organisasjon";
import TjenesteBoks from "./TjenesteBoks/TjenesteBoks";
import "./Hovedside.less";
import AltinnBoks from "./AltinnBoks/AltinnBoks";
import { Undertittel, Normaltekst } from "nav-frontend-typografi";

interface State {
  organisasjoner: Array<Organisasjon>;
}

class Hovedside extends Component<{}, State> {
  state = {
    organisasjoner: []
  };

  async componentDidMount() {
    let organisasjoner = await hentOrganisasjoner();
    this.setState({ organisasjoner });
  }
  render() {
    return (
      <div className="forside">
        <div className={"tjenestebokser"}>
          <TjenesteBoks
            tittel={"Dine sykemeldte"}
            undertekst={
              "Hold oversikten over sykemeldingene for de ansatte som du følger opp."
            }
            bildeurl={sykeIkon}
            lenketekst={"Gå til dine sykemeldte"}
            lenke={"https://www.nav.no/Forsiden"}
          />
          <TjenesteBoks
            tittel={"Rekruttering"}
            undertekst={
              "Utlys stillinger, finn kandidater og se deres annonser."
            }
            bildeurl={rekrutteringsIkon}
            lenketekst={"Gå til rekruttering"}
            lenke={"https://www.nav.no/Forsiden"}
          />
          <AltinnBoks> </AltinnBoks>
          <div className={"containerTlfogKontakt"}>
            <div className={"boks"}>
              <Undertittel>{"Arbeidsgivertelefonen"}</Undertittel>
              <Undertittel className={"tlfnr"}>{"55 55 33 36"}</Undertittel>
              <Normaltekst>{"Kl 08.00 - 15.30 (hverdager)"}</Normaltekst>
            </div>
            <div className={"boks"}>
              <Undertittel>{"Kom i kontakt med NAV"}</Undertittel>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Hovedside;
