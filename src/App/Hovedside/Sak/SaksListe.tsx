import { GQL } from '@navikt/arbeidsgiver-notifikasjon-widget';
import { SakPanel } from './SakPanel';
import "./SaksListe.less";

type Props = {
    saker: Array<GQL.Sak>;
}

export const SaksListe = ({saker}: Props) =>
    <ul className="saks-liste">
        {saker.map(sak =>
            <li key={sak.id}>
                <SakPanel sak={sak}/>
            </li>
        )}
    </ul>