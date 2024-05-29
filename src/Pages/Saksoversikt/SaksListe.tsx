import { SakPanel } from './SakPanel';
import './SaksListe.css';
import { Sak } from '../../api/graphql-types';
import { RefObject, useEffect } from 'react';

type Props = {
    saker: Array<Sak>;
    placeholder?: boolean;
    stuck?: boolean;
    saksoversiktRef?: RefObject<HTMLDivElement>;
};

export const SaksListe = ({ saker, placeholder, stuck, saksoversiktRef }: Props) => {
    useEffect(() => {
        if (stuck !== true) return;
        if (saksoversiktRef === undefined || saksoversiktRef.current === null) return;
        saksoversiktRef.current.scrollIntoView();
    }, [saker, saksoversiktRef?.current]);

    return (
        <ul className="saks-liste">
            {saker.map((sak, index) => (
                <li key={sak.id}>
                    <SakPanel sak={sak} placeholder={placeholder} />
                </li>
            ))}
        </ul>
    );
};
