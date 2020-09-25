import React, { FunctionComponent, useContext } from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import { OrganisasjonsDetaljerContext } from '../../OrganisasjonDetaljerProvider';
import { AltinnSkjemanavn } from '../../OrganisasjonsListeProvider';
import AltinnLenke from './AltinnLenke/AltinnLenke';
import {
    ekspertbistand,
    inntekstmelding,
    soknadskjemaInkluderingstilskudd,
    soknadsskjemaLonnstilskudd,
    soknadTilskuddTilMentor,
} from '../../../lenker';
import './AltinnContainer.less';

interface SkjemanavnOgLenke {
    navn: AltinnSkjemanavn;
    lenke: string;
}

const skjemanavnMedLenker: SkjemanavnOgLenke[] = [
    { navn: 'Mentortilskudd', lenke: soknadTilskuddTilMentor },
    { navn: 'Inkluderingstilskudd', lenke: soknadskjemaInkluderingstilskudd },
    { navn: 'Ekspertbistand', lenke: ekspertbistand },
    { navn: 'Lønnstilskudd', lenke: soknadsskjemaLonnstilskudd },
    { navn: 'Inntektsmelding', lenke: inntekstmelding },
];

export const AltinnContainer: FunctionComponent = () => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);

    if (valgtOrganisasjon === undefined) {
        return null;
    }

    const skjemaliste = skjemanavnMedLenker.filter(
        skjema => valgtOrganisasjon.altinnSkjematilgang[skjema.navn]
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
            <div className={'altinn-container__tekst'}>
                <Undertittel id="altinn-container-tittel">
                    Søknader og skjemaer på Altinn
                </Undertittel>
            </div>

            <ul
                className={'altinn-container__bokser ' + className}
                aria-labelledby="altinn-container-tittel"
            >
                {skjemaliste.map(skjema => (
                    <AltinnLenke
                        key={skjema.navn}
                        className="altinn-lenke"
                        href={skjema.lenke}
                        tekst={skjema.navn}
                        nyFane={true}
                    />
                ))}
            </ul>
        </div>
    );
};
