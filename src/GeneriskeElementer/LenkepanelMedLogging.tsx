import { FunctionComponent, MouseEventHandler } from 'react';
import { loggNavigasjon } from '../utils/funksjonerForAmplitudeLogging';
import Lenkepanel, { LenkepanelProps } from 'nav-frontend-lenkepanel';
import { useLocation } from 'react-router-dom';

interface Props extends LenkepanelProps {
    loggLenketekst: string;
}

export const LenkepanelMedLogging: FunctionComponent<Props> = props => {
    const {onClick, loggLenketekst, ...rest} = props;
    const {pathname} = useLocation()

    const onClickLog: MouseEventHandler<HTMLAnchorElement> = event => {
        loggNavigasjon(props.href, loggLenketekst, pathname);
        onClick?.(event);
    };

    return <Lenkepanel onClick={onClickLog} {...rest} />;
};