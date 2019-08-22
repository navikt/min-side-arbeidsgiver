import React, { FunctionComponent } from 'react';
import { Input } from 'nav-frontend-skjema';

import { ReactComponent as Kryss } from './kryss.svg';
import { ReactComponent as Sok } from './forstorrelsesglass.svg';
import './Sokefelt.less';

interface Props {
    soketekst: string;
    onChange: (soketekst: string) => void;
}

const Sokefelt: FunctionComponent<Props> = ({ soketekst, onChange }) => (
    <div className="sokefelt">
        <Input
            className="sokefelt__felt"
            type="search"
            label={''}
            value={soketekst}
            onChange={e => onChange(e.target.value)}
            placeholder="Søk etter underenheter"
        />
        <div className="sokefelt__ikon">
            {soketekst.length === 0 ? (
                <Sok />
            ) : (
                <Kryss className="sokefelt__ikon--klikkbart" onClick={() => onChange('')} />
            )}
        </div>
    </div>
);

export default Sokefelt;
