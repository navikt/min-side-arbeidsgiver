import React, { FunctionComponent, useContext } from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import { OrganisasjonsDetaljerContext } from '../../OrganisasjonDetaljerProvider';
import { OrganisasjonsListeContext } from '../../OrganisasjonsListeProvider';
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
    navn: string;
    lenke: string;
}

const skjemanavnMedLenker: SkjemanavnOgLenke[] = [
    {
        navn: 'Mentortilskudd',
        lenke: soknadTilskuddTilMentor,
    },
    {
        navn: 'Inkluderingstilskudd',
        lenke: soknadskjemaInkluderingstilskudd,
    },
    {
        navn: 'Ekspertbistand',
        lenke: ekspertbistand,
    },
    {
        navn: 'Lønnstilskudd',
        lenke: soknadsskjemaLonnstilskudd,
    },
    {
        navn: 'Inntektsmelding',
        lenke: inntekstmelding,
    },
];

export const AltinnContainer: FunctionComponent = () => {
    const { valgtOrganisasjon: {OrganizationNumber} } = useContext(OrganisasjonsDetaljerContext);
    const { listeMedSkjemaOgTilganger } = useContext(OrganisasjonsListeContext);

    const harTilgang = (skjema: SkjemanavnOgLenke) =>
        listeMedSkjemaOgTilganger.some(tilgang =>
            skjema.navn === tilgang.Skjema.navn &&
            tilgang.OrganisasjonerMedTilgang.some(
                org => org.OrganizationNumber === OrganizationNumber
            )
        );

    return <AltinnContainerRender skjemaListe={skjemanavnMedLenker.filter(harTilgang)}/>;
};

interface Props {
   skjemaListe: SkjemanavnOgLenke[];
}

const AltinnContainerRender = ({skjemaListe}: Props) => {
    const antall = skjemaListe.length;

    let className = 'antall-skjema-';

    if (!(antall > 0)) {
        return null;
    } else if (antall % 2 === 0) {
        className += 'partall';
    } else if (antall % 2 !== 0 && antall !== 1) {
        className += 'oddetall';
    } else {
        className += 'en';
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
                {skjemaListe
                    .map(skjema => (
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

