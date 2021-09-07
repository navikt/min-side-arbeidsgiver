import { FunctionComponent, MouseEventHandler } from 'react';
import Lenke, {Props as LenkeProps} from 'nav-frontend-lenker';
import { loggNavigasjon } from '../utils/funksjonerForAmplitudeLogging';
import { useLocation } from 'react-router-dom';

interface Props extends LenkeProps {
    loggTjeneste?: string;
    loggTekst?: string;
}

export const LenkeMedLogging: FunctionComponent<Props> = props => {
    const {onClick, loggTjeneste, loggTekst, ...rest} = props;
    const {pathname} = useLocation()

    const onClickLog: MouseEventHandler<HTMLAnchorElement> = event => {
        loggNavigasjon(loggTjeneste, props.href, loggTekst, pathname);
        onClick?.(event);
    };

    return <Lenke onClick={onClickLog} {...rest} />;
};