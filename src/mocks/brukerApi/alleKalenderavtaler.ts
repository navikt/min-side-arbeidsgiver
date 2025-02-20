import { KalenderavtaleTidslinjeElement } from '../../api/graphql-types';
import { alleSaker } from './alleSaker';
import { tilKalenderAvtale } from './alleNotifikasjoner';

export const alleKalenderavtaler = alleSaker.flatMap((sak) => {
    return sak.tidslinje
        .filter((te) => te.__typename === 'KalenderavtaleTidslinjeElement')
        .map((te) => tilKalenderAvtale(te as KalenderavtaleTidslinjeElement, sak));
});