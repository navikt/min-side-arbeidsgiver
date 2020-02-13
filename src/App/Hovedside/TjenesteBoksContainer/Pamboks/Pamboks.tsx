import React, { FunctionComponent, useContext, useEffect, useState } from 'react';

import './Pamboks.less';
import Lenkepanel from 'nav-frontend-lenkepanel';
import { OrganisasjonsDetaljerContext } from '../../../../OrganisasjonDetaljerProvider';
import { linkTilArbeidsplassen } from '../../../../lenker';
import pamikon from './search.svg';
import TjenesteBoksBanner from '../TjenesteBoksBanner/TjenesteBoksBanner';
import {loggTjenesteTrykketPa} from "../../../../utils/funksjonerForAmplitudeLogging";

interface Props {
    className?: string;
}

const Pamboks: FunctionComponent<Props> = props => {
    const { antallAnnonser } = useContext(OrganisasjonsDetaljerContext);
    const [stillingsAnnonseTekst, setStillingsAnnonseTekst] = useState('Lag ny stillingsannonse');

    useEffect(() => {
        if (antallAnnonser > 0) {
            setStillingsAnnonseTekst('Stillingsannonser (' + antallAnnonser + ' aktive)');
        }
    }, [antallAnnonser]);

    const loggAtKlikketPaArbeidstrening = () => {
        loggTjenesteTrykketPa("Arbeidstrening");
    };

    return (
        <div onClick={loggAtKlikketPaArbeidstrening} className={'pamboks ' + props.className}>
            <TjenesteBoksBanner tittel={'Rekruttere'} imgsource={pamikon} altTekst={''} />
            <Lenkepanel
                className={'pamboks__lenke'}
                href={linkTilArbeidsplassen()}
                tittelProps={'normaltekst'}
                border={false}
            >
                {'Finn kandidater'}
                <br />
                {stillingsAnnonseTekst}
            </Lenkepanel>
        </div>
    );
};

export default Pamboks;
