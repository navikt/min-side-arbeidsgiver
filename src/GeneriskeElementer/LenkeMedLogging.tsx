import { FunctionComponent, MouseEventHandler } from 'react';
import Lenke, {Props as LenkeProps} from 'nav-frontend-lenker';
import { loggNavigasjon } from '../utils/funksjonerForAmplitudeLogging';
import { useLocation } from 'react-router-dom';

export interface Props extends LenkeProps {
    loggLenketekst?: string;
}

export const LenkeMedLogging: FunctionComponent<Props> = props => {
    const {onClick, loggLenketekst, ...rest} = props;
    const {pathname} = useLocation()

    const onClickLog: MouseEventHandler<HTMLAnchorElement> = event => {
        loggNavigasjon(props.href, loggLenketekst, pathname);
        onClick?.(event);
    };

    return <Lenke onClick={onClickLog} {...rest} />;
};