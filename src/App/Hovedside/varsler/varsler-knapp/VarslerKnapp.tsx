import React, { useContext } from 'react';
import { VarselIkon } from './varsel-ikon/VarselIkon';
import './VarslerKnapp.less';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import { settTrykketPaaBjelle } from '../../../../api/varslerApi';

export const varslerKnappId = 'varsler-knapp-id';

interface Props {
    erApen: boolean;
    setErApen: (bool: boolean) => void;
}

export const VarslerKnapp = ({ erApen, setErApen }: Props) => {
    const { antallUlesteVarsler, setAntallUlesteVarsler, tidspunktHentVarsler } = useContext(OrganisasjonsDetaljerContext);

    return (
        <button
            onClick={() => {
                if (!erApen) {
                    setAntallUlesteVarsler(0);
                    settTrykketPaaBjelle(tidspunktHentVarsler);
                }
                setErApen(!erApen);
            }}
            className="varselbjelle-knapp"
            id={varslerKnappId}
            aria-label={`Varsler. Trykk enter for å ${erApen ? 'lukke' : 'åpne'} varselpanelet`}
            aria-controls="varsler-dropdown"
            aria-expanded={erApen}
            aria-pressed={erApen}
            aria-haspopup="true"
        >
            <VarselIkon isOpen={erApen} antallUleste={antallUlesteVarsler} />
            { (antallUlesteVarsler > 0 || (antallUlesteVarsler === 0 && erApen)) && (
                <div className="varselbjelle-knapp__understrek"/>
            )}
        </button>
    );
};
