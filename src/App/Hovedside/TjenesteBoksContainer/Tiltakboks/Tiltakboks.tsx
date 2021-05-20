import React, { useContext } from 'react';
import Lenkepanel from 'nav-frontend-lenkepanel';
import { Normaltekst } from 'nav-frontend-typografi';
import { tiltaksgjennomforingURL } from '../../../../lenker';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import { loggTjenesteTrykketPa } from '../../../../utils/funksjonerForAmplitudeLogging';
import TjenesteBoksBanner from '../TjenesteBoksBanner/TjenesteBoksBanner';
import './Tiltakboks.less';

import tiltakikon from './tiltakboks-ikon.svg';

const Tiltakboks = () => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    const tiltakUrl = valgtOrganisasjon && valgtOrganisasjon.organisasjon.OrganizationNumber !== ''
        ? `${tiltaksgjennomforingURL}&bedrift=${valgtOrganisasjon.organisasjon.OrganizationNumber}`
        : tiltaksgjennomforingURL;

    return (
        <div className="tiltakboks tjenesteboks-innhold">
            <TjenesteBoksBanner
                tittel="Tiltak"
                imgsource={tiltakikon}
                altTekst=""
            />
            <Lenkepanel
                href={tiltakUrl}
                onClick={() => loggTjenesteTrykketPa('Tiltak', tiltaksgjennomforingURL, "Tiltak")}
                tittelProps="normaltekst"
                aria-label="Tiltak. Arbeidstrening, midlertidig lønnstilskudd, varig lønnstilskudd og sommerjobb. De ulike tiltakene krever egne tilganger i Altinn"
            >
                <Normaltekst className="avsnitt">
                    Arbeidstrening, midlertidig lønnstilskudd, varig lønnstilskudd og sommerjobb.
                </Normaltekst>
                <Normaltekst>
                    De ulike tiltakene krever egne tilganger i Altinn
                </Normaltekst>
            </Lenkepanel>
        </div>
    );
};

export default Tiltakboks;
