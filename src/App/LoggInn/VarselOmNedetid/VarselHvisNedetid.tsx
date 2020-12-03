import React, { FunctionComponent } from 'react';
import AlertStripe from 'nav-frontend-alertstriper';
import { Element } from 'nav-frontend-typografi';
import './VarselOmNedetid.less';

const erIFortiden = (tidspunktString: string) => {
    const tidspunkt = new Date(tidspunktString);
    const nåVærendeTidspunkt = new Date();
    return nåVærendeTidspunkt > tidspunkt;
};

export const VarselHvisNedetid: FunctionComponent = () => {
    // tidspunkt som argumentstreng skrives på formen (2020-11-30T09:22:00Z),
    // blir f.eks 30. november 2020, kl 10.22 ( 09:00 + en time = 10.00 pga tidsonen i Norge)
    const advarselboksSettesPåString = '2020-12-02T14:58:00Z';
    const nedetidboksSettesPaString = '2020-12-02T14:58:30Z';
    const bokserSkalSlutteÅVisesString = '2020-12-02T14:59:00Z';

    let visAdvarselBoks = false;
    let visNedetid = false;

    const bokserSkalSlutteÅVises = erIFortiden(bokserSkalSlutteÅVisesString);

    if (advarselboksSettesPåString.length > 0 && nedetidboksSettesPaString.length > 0 && !bokserSkalSlutteÅVises) {
        const nedetidVises = erIFortiden(nedetidboksSettesPaString);
        visNedetid = nedetidVises;
        if (erIFortiden(advarselboksSettesPåString) && !nedetidVises) {
            visAdvarselBoks = true;
        }
    }

    return (
        <div className={'nedetid'}>
            {visNedetid && (
                <AlertStripe className={'nedetid__varsel'} type={'advarsel'}>
                    <Element className={'nedetid__varsel-overskrift'}>Min side — er nede</Element>
                    Jobber med vedlikehold
                </AlertStripe>
            )}
            {visAdvarselBoks && (
                <AlertStripe type={'info'} className={'nedetid__varsel'}>
                    <Element className={'nedetid__varsel-overskrift'}>
                        Min side — vil være nede
                    </Element>
                    Planlagt nedetid
                </AlertStripe>
            )}
        </div>
    );
};
