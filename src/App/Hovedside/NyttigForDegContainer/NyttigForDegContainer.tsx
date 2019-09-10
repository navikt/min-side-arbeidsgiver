import React, { FunctionComponent, useContext, useState, useEffect } from 'react';
import Bedriftsinfoknapp from './Bedriftsinfoknapp/Bedriftsinfoknapp';
import './NyttigForDegContainer.less';
import KontaktOss from './KontaktOss/KontaktOss';
import ArbeidsgiverTelefon from './ArbeidsgiverTelefon/ArbeidsgiverTelefon';
import { Undertittel } from 'nav-frontend-typografi';
import { OrganisasjonsListeContext } from '../../../OrganisasjonsListeProvider';

const NyttigForDegContainer: FunctionComponent = () => {
    const { organisasjoner } = useContext(OrganisasjonsListeContext);
    const [antallBokser, setAntallBokser] = useState('to');

    useEffect(() => {
        if (organisasjoner.length > 0) {
            setAntallBokser('tre');
        }
    }, [organisasjoner]);

    return (
        <div className={'nyttig-for-deg'}>
            <div className={'nyttig-for-deg__bokser'}>
                {organisasjoner.length > 0 && (
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
