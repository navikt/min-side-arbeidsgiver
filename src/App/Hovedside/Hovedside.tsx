import React, { Component } from "react";
import { hentOrganisasjoner } from "../../api/dnaApi";
import sykeIkon from "../iconSykemeldte.svg";
import rekrutteringsIkon from "../iconRekruttering.svg";
import { Organisasjon } from "../../organisasjon";
import TjenesteBoks from "./TjenesteBoks/TjenesteBoks";

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
        </div>
      </div>
    );
  }
}

export default Hovedside;
