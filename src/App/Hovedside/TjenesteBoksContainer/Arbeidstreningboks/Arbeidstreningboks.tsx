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

  useEffect(() => {
    let klareArbeidsavtaler: Array<Arbeidsavtale> = arbeidsavtaler.filter(
      arbeidsavtale => arbeidsavtale.status === "Klar for oppstart"
    );
    setantallKlareStillingsannonserTekst(
      klareArbeidsavtaler.length.toString() +
        " arbeidsavtaler klare for oppstart"
    );
    const arbeidsavtalerTilGodkjenning: Array<
      Arbeidsavtale
    > = arbeidsavtaler.filter(
      arbeidsavtale => arbeidsavtale.status === "Mangler godkjenning"
    );
    setantallTilGodkjenningTekst(
      arbeidsavtalerTilGodkjenning.length.toString() +
        " arbeidsavtaler mangler godkjenning"
    );
    let arbeidsavtalerUnderArbeid: Array<Arbeidsavtale> = arbeidsavtaler.filter(
      arbeidsavtaler => arbeidsavtaler.status === "Påbegynt"
    );
    setantallUnderArbeidTekst(
      arbeidsavtalerUnderArbeid.length.toString() + " påbegynte arbeidsavtaler"
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
        {antallKlareStillingsannonserTekst + "\n"}
        {antallTilGodkjenningTekst + "\n"}
        {antallUnderArbeidTekst}
      </Lenkepanel>
    </div>
  );
};

export default Arbeidstreningboks;
