import React, { useContext } from 'react';
import Lenkepanel from 'nav-frontend-lenkepanel';
import { Normaltekst } from 'nav-frontend-typografi';
import { tiltaksgjennomforingLink } from '../../../../lenker';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import { loggTjenesteTrykketPa } from '../../../../utils/funksjonerForAmplitudeLogging';
import TjenesteBoksBanner from '../TjenesteBoksBanner/TjenesteBoksBanner';
import './Tiltakboks.less';
const tiltakikon = require('./tiltakboks-ikon.svg');

const Tiltakboks = () => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    const tiltakUrl = valgtOrganisasjon && valgtOrganisasjon.organisasjon.OrganizationNumber
        ? `${tiltaksgjennomforingLink}&bedrift=${valgtOrganisasjon.organisasjon.OrganizationNumber}`
        : tiltaksgjennomforingLink;

    return (
        <div className="tiltakboks tjenesteboks-innhold">
            <TjenesteBoksBanner
                tittel="Tiltak"
                imgsource={tiltakikon}
                altTekst=""
            />
            <Lenkepanel
                href={tiltakUrl}
                onClick={() => loggTjenesteTrykketPa('Tiltak', tiltaksgjennomforingLink, "Tiltak")}
                tittelProps="normaltekst"
                aria-label="Tiltak. Arbeidstrening, midlertidig lønnstilskudd og varig lønnstilskudd. De ulike tiltakene krever egne tilganger i Altinn"
            >
                <Normaltekst className="avsnitt">
                    Arbeidstrening, midlertidig lønnstilskudd og varig lønnstilskudd.
                </Normaltekst>
                <Normaltekst>
                    De ulike tiltakene krever egne tilganger i Altinn
                </Normaltekst>
            </Lenkepanel>
        </div>
    );
};

export default Tiltakboks;
