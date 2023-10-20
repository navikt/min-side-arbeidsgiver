import { SakPanel } from './SakPanel';
import "./SaksListe.css";
import {Sak} from "../../api/graphql-types";

type Props = {
    saker: Array<Sak>;
    placeholder?: boolean;
}

export const SaksListe = ({saker, placeholder}: Props) =>
    <ul className="saks-liste">
        {saker.map(sak =>
            <li key={sak.id}>
                <SakPanel sak={sak} placeholder={placeholder} />
            </li>
        )}
    </ul>