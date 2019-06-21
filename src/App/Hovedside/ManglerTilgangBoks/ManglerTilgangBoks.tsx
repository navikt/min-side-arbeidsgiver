import React, { FunctionComponent } from "react";
import "./ManglerTilgangBoks.less";

import Innholdsboks from "../Innholdsboks/Innholdsboks";
import Undertittel from "nav-frontend-typografi/lib/undertittel";
import { basename } from "../../../paths";
import Lenke from "nav-frontend-lenker";

interface Props {
  className?: string;
}

const ManglerTilgangBoks: FunctionComponent<Props> = props => (
  <Innholdsboks className={"mangler-tilgang"}>
    <Undertittel>Du mangler roller eller rettigheter i Altinn</Undertittel>
    For å se innholdet på denne siden må du være registrert med visse roller og
    rettigheter i Altinn.{" "}
    <Lenke href={basename + "/informasjon-om-tilgangsstyring"}>Her</Lenke> kan
    du se hvilke tjenester som krever hvilke rettigheter i Altinn
  </Innholdsboks>
);

export default ManglerTilgangBoks;
