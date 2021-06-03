import React from 'react';
import {VarselIkon} from './varsel-ikon/VarselIkon';
import './VarslerKnapp.less';

export const varslerKnappId = 'varsler-knapp-id';

interface Props {
    antallUlesteVarsler?: number;
    erApen: boolean;
    setErApen: (bool: boolean) => void;
    onApnet?: () => void;
}

export const VarslerKnapp = (
    {
        antallUlesteVarsler = 0,
        erApen,
        setErApen,
        onApnet = () => {
            // default noop
        }
    }: Props
) => {

    return (
        <button
            onClick={() => {
                if (!erApen) {
                    onApnet()
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
            <VarselIkon isOpen={erApen} antallUleste={antallUlesteVarsler}/>
            {erApen && (
                <div className="varselbjelle-knapp__understrek"/>
            )}
        </button>
    );
};
