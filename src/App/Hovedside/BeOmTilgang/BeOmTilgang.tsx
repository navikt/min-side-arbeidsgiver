import React, { FunctionComponent, useContext } from 'react';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import AlertStripeInfo from 'nav-frontend-alertstriper/lib/info-alertstripe';
import { Undertittel } from 'nav-frontend-typografi';
import { OrganisasjonsListeContext } from '../../OrganisasjonsListeProvider';
import { OrganisasjonsDetaljerContext } from '../../OrganisasjonDetaljerProvider';
import Organisasjonsbeskrivelse from './Organisasjonsbeskrivelse/Organisasjonsbeskrivelse';
import { genererTekstbokser } from './finnManglendeTilgangOgGenererBokserFunksjoner';
import TjenesteInfo from './TjenesteInfo/TjenesteInfo';
import './BeOmTilgang.less';

const BeOmTilgang: FunctionComponent = () => {
    const { tilgangTilSyfo } = useContext(OrganisasjonsListeContext);
    const { valgtOrganisasjon, tilgangTilPam } = useContext(OrganisasjonsDetaljerContext);

    const tjenesteinfoBokser = genererTekstbokser(valgtOrganisasjon, {
        tilgangTilPam,
        tilgangTilSyfo,
    }).map(tjeneste => (
        <TjenesteInfo
            overskrift={tjeneste.overskrift}
            lenkeTilBeOmTjeneste={tjeneste.lenkeTilBeOmTjeneste}
            innholdstekst={tjeneste.innholdstekst}
            erSyfo={tjeneste.erSyfo}
            key={tjeneste.overskrift}
        />
    ));

    const skalViseInnhold = tjenesteinfoBokser.length > 0;

    return (
        <div className="be-om-tilgang">
            {skalViseInnhold && (
                <>
                    <div className="be-om-tilgang__tittel">
                        <div className="divider" />
                        <Undertittel className="tekst">
                            Trenger du tilgang til flere tjenester?
                        </Undertittel>
                        <div className="divider" />
                    </div>
                    <Ekspanderbartpanel
                        className="be-om-tilgang__container"
                        tittel="Tjenester du kan be om tilgang til"
                    >
                        <div className="be-om-tilgang__innhold">
                            <AlertStripeInfo className="be-om-tilgang__info">
                                Du har ikke rettighetene som kreves for å bruke disse tjenestene. Du
                                kan be om tilgang til de spesifikke tjenestene ved å følge lenkene
                                under.
                            </AlertStripeInfo>
                            {valgtOrganisasjon && (
                                <Organisasjonsbeskrivelse
                                    navn={valgtOrganisasjon.organisasjon.Name}
                                    orgnummer={valgtOrganisasjon.organisasjon.OrganizationNumber}
                                />
                            )}
                            <ul className="be-om-tilgang__tjenesteinfo-bokser">
                                {tjenesteinfoBokser}
                            </ul>
                        </div>
                    </Ekspanderbartpanel>
                </>
            )}
        </div>
    );
};

export default BeOmTilgang;
