import React from 'react';
import { VarselIkon } from './varsel-ikon/VarselIkon';
import './VarslerKnapp.less';

export const varslerKnappId = 'varsler-knapp-id';

interface Props {
    erApen: boolean;
    setErApen: (bool: boolean) => void;
}

export const VarslerKnapp = ({ erApen, setErApen }: Props) => {
    return (
        <button
            onClick={() => setErApen(!erApen)}
            className="varselbjelle-knapp"
            id={varslerKnappId}
            aria-label={`Varsler. Trykk enter for å ${erApen ? 'lukke' : 'åpne'} varselpanelet`}
            aria-controls="varsler-dropdown"
            aria-expanded={erApen}
            aria-pressed={erApen}
            aria-haspopup="true"
        >
            <VarselIkon isOpen={erApen} antallUleste={5} />
            <div className="varselbjelle-knapp__understrek" />
        </button>
    );
};
