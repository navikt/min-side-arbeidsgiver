import React, { FunctionComponent, useContext } from 'react';
import './IkkeTilgangTilDisseTjenestene.less';

import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import Organisasjonsbeskrivelse from './Organisasjonsbeskrivelse/Organisasjonsbeskrivelse';
import { OrganisasjonsListeContext } from '../../../OrganisasjonsListeProvider';
import { genererTekstbokser } from './finnManglendeTilgangOgGenererBokserFunksjoner';
import TjenesteInfo from './TjenesteInfo/TjenesteInfo';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import AlertStripeInfo from 'nav-frontend-alertstriper/lib/info-alertstripe';
import { Undertittel } from 'nav-frontend-typografi';

const IkkeTilgangTilDisseTjenestene: FunctionComponent = () => {
    const { listeMedSkjemaOgTilganger } = useContext(OrganisasjonsListeContext);
    const { tilgangsArray, valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);

    const tjenesteinfoBokser = genererTekstbokser(
        tilgangsArray,
        listeMedSkjemaOgTilganger,
        valgtOrganisasjon.OrganizationNumber
    ).map(info => {
        return (
            <TjenesteInfo
                overskrift={info.overskrift}
                lenkeTilBeOmTjeneste={info.lenkeTilBeOmTjeneste}
                innholdstekst={info.innholdstekst}
                erSyfo={info.erSyfo}
                key={info.overskrift}
            />
        );
    });

    const skalViseInnhold = tjenesteinfoBokser.length > 0;

    return (
        <div className="oversikt-over-manglende-tilganger__container">
            {skalViseInnhold && (
                <>
                    <div className="oversikt-over-manglende-tilganger__tittel">
                        <div className="divider"></div>
                        <Undertittel className="tekst">Trenger du til tilgang til flere tjenester?</Undertittel>
                        <div className="divider"></div>
                    </div>
                    <Ekspanderbartpanel
                        className={'oversikt-over-manglende-tilganger'}
                        tittel="Tjenester du kan be om tilgang til"
                    >
                        <div className="oversikt-over-manglende-tilganger__innhold">
                            <AlertStripeInfo className="oversikt-over-manglende-tilganger__info">
                                Du har ikke rettighetene som kreves for å bruke disse tjenestene. Du kan
                                be om tilgang til de spesifikke tjenestene ved å følge lenkene under.
                            </AlertStripeInfo>
                            {valgtOrganisasjon.OrganizationNumber !== '' && (
                                <Organisasjonsbeskrivelse
                                    navn={valgtOrganisasjon.Name}
                                    orgnummer={valgtOrganisasjon.OrganizationNumber}
                                />
                            )}
                            <div className="oversikt-over-manglende-tilganger__tjeneste-info-bokser">
                                {tjenesteinfoBokser}
                            </div>
                        </div>
                    </Ekspanderbartpanel>
                </>
            )}
        </div>
    );
};

export default IkkeTilgangTilDisseTjenestene;
