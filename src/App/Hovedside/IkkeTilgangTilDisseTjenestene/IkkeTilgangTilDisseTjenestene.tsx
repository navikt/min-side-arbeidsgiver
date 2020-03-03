import React, {FunctionComponent, useContext} from 'react';
import './IkkeTilgangTilDisseTjenestene.less';

import Ekspanderbartpanel from "nav-frontend-ekspanderbartpanel";
import {AlertStripeInfo} from "nav-frontend-alertstriper";
import {OrganisasjonsDetaljerContext} from "../../../OrganisasjonDetaljerProvider";
import Organisasjonsbeskrivelse from "./Organisasjonsbeskrivelse/Organisasjonsbeskrivelse";
import {OrganisasjonsListeContext} from "../../../OrganisasjonsListeProvider";
import {genererTekstbokser} from "./finnManglendeTilgangOgGenererBokserFunksjoner";
import TjenesteInfo from "./TjenesteInfo/TjenesteInfo";




const IkkeTilgangTilDisseTjenestene: FunctionComponent = () => {
    const { listeMedSkjemaOgTilganger } = useContext(OrganisasjonsListeContext);
    const {tilgangsArray,
        valgtOrganisasjon,
    } = useContext(OrganisasjonsDetaljerContext);

    const tjenesteinfoBokser = genererTekstbokser(tilgangsArray,listeMedSkjemaOgTilganger, valgtOrganisasjon.OrganizationNumber).map( info => {
        return <TjenesteInfo overskrift={info.overskrift} lenkeTilBeOmTjeneste={info.lenkeTilBeOmTjeneste} innholdstekst={info.innholdstekst}/>
    } );

    const skalViseInnhold = tjenesteinfoBokser.length>0;

    return (
        <> {skalViseInnhold &&
        <Ekspanderbartpanel className={"oversikt-over-manglende-tilganger"} tittel="Tjenester du ikke har tilgang til">
            <div className={"oversikt-over-manglende-tilganger__container"}>
                <AlertStripeInfo className="oversikt-over-manglende-tilganger__info">
                    Du har for øyeblikket ikke rettighetene som kreves for å bruke disse tjenestene.
                </AlertStripeInfo>
                <Organisasjonsbeskrivelse navn={valgtOrganisasjon.Name} orgnummer={valgtOrganisasjon.OrganizationNumber}/>
                {tjenesteinfoBokser}
            </div>
        </Ekspanderbartpanel>
        }
        </>
);
};

export default IkkeTilgangTilDisseTjenestene;
