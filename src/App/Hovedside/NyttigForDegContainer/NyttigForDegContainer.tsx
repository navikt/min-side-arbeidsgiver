import React, { FunctionComponent, useContext, useState, useEffect } from 'react';
import Bedriftsinfoknapp from './Bedriftsinfoknapp/Bedriftsinfoknapp';
import './NyttigForDegContainer.less';
import KontaktOss from './KontaktOss/KontaktOss';
import ArbeidsgiverTelefon from './ArbeidsgiverTelefon/ArbeidsgiverTelefon';
import {OrganisasjonsDetaljerContext} from "../../../OrganisasjonDetaljerProvider";
import {tomAltinnOrganisasjon} from "../../../Objekter/Organisasjoner/OrganisasjonerFraAltinn";

const NyttigForDegContainer: FunctionComponent = () => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    const [antallBokser, setAntallBokser] = useState('to');

    useEffect(() => {
        if (valgtOrganisasjon !==  tomAltinnOrganisasjon) {
            setAntallBokser('tre');
        }
    }, [valgtOrganisasjon]);

    return (
        <div className={'nyttig-for-deg'}>
            <div className={'nyttig-for-deg__bokser'}>
                {valgtOrganisasjon !== tomAltinnOrganisasjon && (
                    <div className={'nyttig-for-deg__boks-' + antallBokser}>
                        <Bedriftsinfoknapp />
                    </div>
                )}
                <div className={'nyttig-for-deg__boks-' + antallBokser}>
                    <KontaktOss />
                </div>
                <div className={'nyttig-for-deg__boks-' + antallBokser}>
                    <ArbeidsgiverTelefon />
                </div>
            </div>
        </div>
    );
};

export default NyttigForDegContainer;