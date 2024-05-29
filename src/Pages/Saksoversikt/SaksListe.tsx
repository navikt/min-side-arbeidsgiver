import { SakPanel } from './SakPanel';
import './SaksListe.css';
import { Sak } from '../../api/graphql-types';
import { useEffect } from 'react';

type Props = {
    saker: Array<Sak>;
    placeholder?: boolean;
    pos?: number;
};

export const SaksListe = ({ saker, placeholder, pos }: Props) => {
    useEffect(() => {
        if (pos !== undefined && pos > 0) scroll(0, pos);
    }, [saker]);
    return (
        <ul className="saks-liste">
            {saker.map((sak) => (
                <li key={sak.id}>
                    <SakPanel sak={sak} placeholder={placeholder} />
                </li>
            ))}
        </ul>
    );
};
