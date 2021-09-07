import { FunctionComponent, MouseEventHandler } from 'react';
import { loggNavigasjon } from '../utils/funksjonerForAmplitudeLogging';
import Lenkepanel, { LenkepanelProps } from 'nav-frontend-lenkepanel';
import { useLocation } from 'react-router-dom';

interface Props extends LenkepanelProps {
    loggTjeneste?: string;
    loggTekst?: string;
}

export const LenkepanelMedLogging: FunctionComponent<Props> = props => {
    const {onClick, loggTjeneste, loggTekst, ...rest} = props;
    const {pathname} = useLocation()

    const onClickLog: MouseEventHandler<HTMLAnchorElement> = event => {
        loggNavigasjon(loggTjeneste, props.href, loggTekst, pathname);
        onClick?.(event);
    };

    return <Lenkepanel onClick={onClickLog} {...rest} />;
};