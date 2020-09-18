import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { Undertittel } from 'nav-frontend-typografi';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import { OrganisasjonsListeContext } from '../../../OrganisasjonsListeProvider';
import { SkjemaMedOrganisasjonerMedTilgang } from '../../../api/dnaApi';
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

const navnPåAltinnSkjema = skjemanavnMedLenker.map(_ => _.navn);

export const AltinnContainer: FunctionComponent = () => {
    const [typeAntall, settypeAntall] = useState('');

    const [generellAltinnTilgang, setgenerellAltinnTilgang] = useState(false);

    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    const { listeMedSkjemaOgTilganger } = useContext(OrganisasjonsListeContext);

    const altinnSkjemaMedTilgang = finnOgTellTilganger(
        listeMedSkjemaOgTilganger,
        valgtOrganisasjon.OrganizationNumber
    );

    useEffect(() => {
        const antallTilganger = altinnSkjemaMedTilgang.length;
        setgenerellAltinnTilgang(antallTilganger > 0);
        if (antallTilganger % 2 === 0) {
            settypeAntall('antall-skjema-partall');
        }
        if (antallTilganger % 2 !== 0 && antallTilganger !== 1) {
            settypeAntall('antall-skjema-oddetall');
        }
        if (antallTilganger === 1) {
            settypeAntall('antall-skjema-en');
        }
    }, [altinnSkjemaMedTilgang]);

    return (
        <div className={'altinn-container ' + typeAntall}>

            {generellAltinnTilgang && (
                <div className={'altinn-container__tekst'}>
                    <Undertittel id="altinn-container-tittel">
                        Søknader og skjemaer på Altinn
                    </Undertittel>
                </div>
            )}

            <ul
                className={'altinn-container__bokser ' + typeAntall}
                aria-labelledby="altinn-container-tittel"
            >
                {skjemanavnMedLenker
                    .filter(skjema => altinnSkjemaMedTilgang.some(navn => navn === skjema.navn))
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

const finnOgTellTilganger = (
    altinnTjenester: SkjemaMedOrganisasjonerMedTilgang[],
    valgtOrganisasjon: string
): string[] => {
    const listeMedNavnPaTilganger: string[] = [];
    navnPåAltinnSkjema.forEach(skjemaNavn => {
        altinnTjenester.forEach(tjeneste => {
            if (tjeneste.Skjema.navn === skjemaNavn) {
                const harTilgang = sjekkOmTilgangTilAltinnSkjema(valgtOrganisasjon, tjeneste);
                harTilgang && listeMedNavnPaTilganger.push(skjemaNavn);
            }
        });
    });
    return listeMedNavnPaTilganger;
};

const sjekkOmTilgangTilAltinnSkjema = (orgnr: string, skjema: SkjemaMedOrganisasjonerMedTilgang) =>
    skjema.OrganisasjonerMedTilgang.some(org => org.OrganizationNumber === orgnr);
