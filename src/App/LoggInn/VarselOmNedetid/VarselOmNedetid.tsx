import React, { FunctionComponent } from 'react';
import AlertStripe from 'nav-frontend-alertstriper';
import { Element } from 'nav-frontend-typografi';
import './VarselOmNedetid.less';

interface Props {
    nedetid: boolean
    advarselOmNedetid: boolean
}

export const VarselOmNedetid: FunctionComponent<Props> = props => {

    return (
        <div className={'nedetid'}>
            {props.nedetid && <AlertStripe className={'nedetid__varsel'} type={'advarsel'}>
                <Element className={'nedetid__varsel-overskrift'}>
                    Min side — er nede
                </Element>
                Jobber med vedlikehold
            </AlertStripe>}
            {props.advarselOmNedetid && <AlertStripe type={'info'} className={'nedetid__varsel'}>
                <Element className={'nedetid__varsel-overskrift'}>
                    Min side — vil være nede
                </Element>
                Planlagt nedetid
            </AlertStripe>
            }
        </div>
    );
};