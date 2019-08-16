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
import { arbeidsAvtaleLink } from "../../../../lenker";
import { OrganisasjonsDetaljerContext } from "../../../../OrganisasjonDetaljerProvider";

interface Props {
  varseltekst?: string;
  className?: string;
}

const Arbeidstreningboks: FunctionComponent<Props> = props => {
  const { arbeidsavtaler } = useContext(OrganisasjonsDetaljerContext);

  const hentAntallArbeidsavtalerMedEnStatus = (status: string) => {
    return arbeidsavtaler.filter(
      arbeidsavtale => arbeidsavtale.status === status
    ).length;
  };

  const [antallKlareStillingsannonser,setantallKlareStillingsannonser] = useState(hentAntallArbeidsavtalerMedEnStatus("Klar for oppstart"));
  const [antallTilGodkjenning, setantallTilGodkjenning] = useState(hentAntallArbeidsavtalerMedEnStatus("Mangler godkjenning"));
  const [antallPabegynt, setAntallPabegynt] = useState(hentAntallArbeidsavtalerMedEnStatus("Påbegynt"));

  const boyArbeidsavtaler = (antall: number) => {
    if (antall === 1) {
      return " arbeidsavtale ";
    }
    return " arbeidsavtaler ";
  };

  const lagTekstBasertPaAntall = (antall: number, typeTekst: string) => {
    return antall + boyArbeidsavtaler(antall) + typeTekst;
  };

  useEffect(() => {
    setAntallPabegynt( hentAntallArbeidsavtalerMedEnStatus("Påbegynt"));
    setantallTilGodkjenning(  hentAntallArbeidsavtalerMedEnStatus("Mangler godkjenning"));
    setantallKlareStillingsannonser(hentAntallArbeidsavtalerMedEnStatus("Klar for oppstart"))
  }, [arbeidsavtaler]);

  return (
    <div className={"arbeidstreningboks " + props.className}>
      <TjenesteBoksBanner
        tittel={"Arbeidstrening"}
        imgsource={arbeidstreningikon}
        altTekst={"En stresskoffert"}
      />

      <Lenkepanel
        className={"arbeidstreningboks__info"}
        href={arbeidsAvtaleLink()}
        tittelProps={"normaltekst"}
        linkCreator={(props: any) => <a {...props}>{props.children}</a>}
      >
        {lagTekstBasertPaAntall(antallPabegynt, " påbegynt")}
        <br />
        {lagTekstBasertPaAntall(antallTilGodkjenning, "mangler godkjenning")}
        <br />
        {lagTekstBasertPaAntall(antallKlareStillingsannonser, "klare for oppstart")}
        <br />
      </Lenkepanel>
    </div>
  );
};

export default Arbeidstreningboks;
