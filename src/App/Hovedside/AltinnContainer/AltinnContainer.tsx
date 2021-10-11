import React, { FunctionComponent, useContext } from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import { OrganisasjonsDetaljerContext } from '../../OrganisasjonDetaljerProvider';
import { altinnskjema, AltinnskjemaId } from '../../../altinn/tjenester';
import AltinnLenke from './AltinnLenke/AltinnLenke';
import './AltinnContainer.less';

const skjemarekkefølge: AltinnskjemaId[] = [
    'inntektsmelding',
    'mentortilskudd',
    'inkluderingstilskudd',
    'ekspertbistand',
    'utsendtArbeidstakerEØS',
];

export const AltinnContainer: FunctionComponent = () => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);

    if (valgtOrganisasjon === undefined) {
        return null;
    }

    const skjemaliste = skjemarekkefølge.flatMap(navn =>
        valgtOrganisasjon.altinntilgang[navn] ? [altinnskjema[navn]] : [],
    );

    const antall = skjemaliste.length;

    if (antall === 0) {
        return null;
    }

    let className = 'antall-skjema-';

    if (antall === 1) {
        className += 'en';
    } else if (antall % 2 === 0) {
        className += 'partall';
    } else {
        className += 'oddetall';
    }

    return (
        <div className={'altinn-container ' + className}>
            <Undertittel id='altinn-container-tittel' className='altinn-container__tittel'>
                Søknader og skjemaer på Altinn
            </Undertittel>

            <ul
                className={'altinn-container__bokser ' + className}
                aria-labelledby='altinn-container-tittel'
            >
                {skjemaliste.map(skjema => (
                    <AltinnLenke
                        key={skjema.navn}
                        className='altinn-lenke'
                        href={skjema.skjemaUrl}
                        tekst={skjema.navn}
                        nyFane={true}
                    />
                ))}
            </ul>
        </div>
    );
};
