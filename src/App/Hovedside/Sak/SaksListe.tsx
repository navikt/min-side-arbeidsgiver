import { GQL } from '@navikt/arbeidsgiver-notifikasjon-widget';
import { SakPanel } from './SakPanel';
import "./SaksListe.css";

type Props = {
    saker: Array<GQL.Sak>;
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