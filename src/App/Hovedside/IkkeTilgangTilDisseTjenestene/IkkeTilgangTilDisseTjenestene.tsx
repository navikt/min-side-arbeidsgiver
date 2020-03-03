import React, {FunctionComponent, useContext} from 'react';
import './IkkeTilgangTilDisseTjenestene.less';

import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";
import TjenesteInfo from "./TjenesteInfo/TjenesteInfo";
import {AlertStripeInfo} from "nav-frontend-alertstriper";
import {OrganisasjonsDetaljerContext} from "../../../OrganisasjonDetaljerProvider";
import Organisasjonsbeskrivelse from "./Organisasjonsbeskrivelse/Organisasjonsbeskrivelse";




const IkkeTilgangTilDisseTjenestene: FunctionComponent = () => {

    const {tilgangsArray,
        valgtOrganisasjon,
    } = useContext(OrganisasjonsDetaljerContext);

    return (
        <Ekspanderbartpanel className={"oversikt-over-manglende-tilganger"} tittel="Tjenester du ikke har tilgang til">
            <div className={"oversikt-over-manglende-tilganger__container"}>
                <AlertStripeInfo className="oversikt-over-manglende-tilganger__info">
                    Du har for øyeblikket ikke rettighetene som kreves for å bruke disse tjenestene.
                </AlertStripeInfo>
                <Organisasjonsbeskrivelse navn={valgtOrganisasjon.Name} orgnummer={valgtOrganisasjon.OrganizationNumber}/>
                <TjenesteInfo overskrift={'Rekruttering'} innholdstekst={'Finn kandidater og legg ut stillingsannonser pa Arbeidsplassen.no'} lenkeTilBeOmTjeneste={'hei'}/>
                <TjenesteInfo overskrift={'Rekruttering'} innholdstekst={'Finn kandidater og legg ut stillingsannonser pa Arbeidsplassen.no'} lenkeTilBeOmTjeneste={'hei'}/>
            </div>
        </Ekspanderbartpanel>
);
};

export default IkkeTilgangTilDisseTjenestene;
