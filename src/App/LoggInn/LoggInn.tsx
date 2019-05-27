import React, { FunctionComponent} from "react";
import { Normaltekst } from "nav-frontend-typografi";
import { Hovedknapp } from "nav-frontend-knapper";
import "./Logginn.less";
import { logInfo } from "../../utils/metricsUtils";

const LoggInn: FunctionComponent = () => {

  const redirectTilLogin = () => {
    logInfo("klikk på login");
    window.location.href = "/ditt-nav-arbeidsgiver/redirect-til-login";
  };


    return (
      <div className="innloggingsside">
        <div className={"innloggingsside__innloggingsboks"}>
          <Normaltekst className={"innloggingsside__overtekst"}>
            Nå er det enklere for deg som arbeidsgiver å samarbeide med NAV
          </Normaltekst>
          <Normaltekst className={"innloggingsside__undertekst"}>
            Finn oppgaver som venter, kom i dialog med oss og utforsk relevante
            tjenester for din bedrift.
          </Normaltekst>
          <Hovedknapp
            className={"innloggingsside__loginKnapp"}
            onClick={redirectTilLogin}
          >
            Logg inn
          </Hovedknapp>
        </div>
      </div>
    );

};

export default LoggInn;
