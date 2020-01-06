import React, { FunctionComponent } from 'react';
import AlertStripe from 'nav-frontend-alertstriper';

type VarselOmNedetidProps =
    | {
          visVarselOmNedeTid: true;
          visFraDato: Date;
          visTilDato: Date;
      }
    | {
          visVarselOmNedeTid: false;
      };

export const VarselOmNedetid: FunctionComponent<VarselOmNedetidProps> = props => {
    const dagensDato: Date = new Date();
    if (
        !props.visVarselOmNedeTid ||
        dagensDato > props.visTilDato ||
        dagensDato < props.visFraDato
    ) {
        return null;
    }
    return (
        <div>
            <AlertStripe type={'advarsel'}>
                {' '}
                Altinn vil være utilgjengelig 01.01.2020 i tidsrommet 17:00 til ca. 23:00. Dette vil
                medføre at en del tjenester på Min Side - Arbeidsgiver ikke vil fungere som normalt.
            </AlertStripe>
        </div>
    );
};
