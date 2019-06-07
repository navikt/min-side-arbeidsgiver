import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState
} from "react";
import arbeidstreningikon from "./arbeidstreningikon.svg";
import Lenkepanel from "nav-frontend-lenkepanel";
import "./Arbeidstreningboks.less";

import TjenesteBoksBanner from "../TjenesteBoksBanner/TjenesteBoksBanner";
import { syfoLink } from "../../../../lenker";
import { OrganisasjonsDetaljerContext } from "../../../../OrganisasjonDetaljerProvider";
import { Arbeidsavtale } from "../../../../api/dnaApi";

interface Props {
  varseltekst?: string;
  className?: string;
}

const Arbeidstreningboks: FunctionComponent<Props> = props => {
  const { arbeidsavtaler } = useContext(OrganisasjonsDetaljerContext);
  const [
    antallKlareStillingsannonserTekst,
    setantallKlareStillingsannonserTekst
  ] = useState("");
  const [antallTilGodkjenningTekst, setantallTilGodkjenningTekst] = useState(
    ""
  );
  const [antallUnderArbeidTekst, setantallUnderArbeidTekst] = useState("");

  const LagTekstBasertPaAntall = (antall: string) => {
    if (antall === "1") {
      return " arbeidsavtale ";
    }
    return " arbeidsavtaler ";
  };

  useEffect(() => {
    const KlareForOppstartArbeidsavtaler: Arbeidsavtale[] = arbeidsavtaler.filter(
      arbeidsavtale => arbeidsavtale.status === "Klar for oppstart"
    );
    let antallAvtaler: string = KlareForOppstartArbeidsavtaler.length.toString();
    setantallUnderArbeidTekst(
      antallAvtaler +
        LagTekstBasertPaAntall(antallAvtaler) +
        "klare for oppstart"
    );
    const arbeidsavtalerTilGodkjenning: Arbeidsavtale[] = arbeidsavtaler.filter(
      arbeidsavtale => arbeidsavtale.status === "Mangler godkjenning"
    );
    antallAvtaler = arbeidsavtalerTilGodkjenning.length.toString();
    setantallTilGodkjenningTekst(
      antallAvtaler +
        LagTekstBasertPaAntall(antallAvtaler) +
        "mangler godkjenning"
    );
    const godkjentArbeidsavtaler: Arbeidsavtale[] = arbeidsavtaler.filter(
      arbeidsavtaler => arbeidsavtaler.status === "Godkjente"
    );
    antallAvtaler = godkjentArbeidsavtaler.length.toString();
    setantallKlareStillingsannonserTekst(
      antallAvtaler + " godkjente" + LagTekstBasertPaAntall(antallAvtaler)
    );
  }, [arbeidsavtaler]);

  return (
    <div className={"arbeidstreningboks " + props.className}>
      <TjenesteBoksBanner
        tittel={"Arbeidstrening"}
        imgsource={arbeidstreningikon}
        altTekst={"En industriarbeider med hjelm"}
      />

      <Lenkepanel
        className={"arbeidstreningboks__info"}
        href={syfoLink()}
        tittelProps={"normaltekst"}
        linkCreator={(props: any) => <a {...props}>{props.children}</a>}
      >
        {antallUnderArbeidTekst}
        <br />
        {antallTilGodkjenningTekst}
        <br />
        {antallKlareStillingsannonserTekst}
        <br />
      </Lenkepanel>
    </div>
  );
};

export default Arbeidstreningboks;
