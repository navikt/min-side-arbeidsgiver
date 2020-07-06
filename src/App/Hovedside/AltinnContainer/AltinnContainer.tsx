import React, {FunctionComponent, useContext, useEffect, useState} from 'react';

import {OrganisasjonsDetaljerContext} from '../../../OrganisasjonDetaljerProvider';

import './AltinnContainer.less';
import {Undertittel} from 'nav-frontend-typografi';

import {
    ekspertbistand,
    inntekstmelding,
    soknadskjemaInkluderingstilskudd,
    soknadsskjemaLonnstilskudd,
    soknadTilskuddTilMentor,
} from '../../../lenker';
import {OrganisasjonsListeContext} from '../../../OrganisasjonsListeProvider';
import {finnOgTellTilganger, genererAltinnSkjema} from "./finnOgTellTilganger";

interface skjemaNavnOgLenke {
    navn: string;
    lenke: string
}

const skjemanavnMedLenker: skjemaNavnOgLenke[] = [
    {
        navn: 'Mentortilskudd',
        lenke: soknadTilskuddTilMentor()
    },
    {
        navn: 'Inkluderingstilskudd',
        lenke: soknadskjemaInkluderingstilskudd()
    },
    {
        navn: 'Ekspertbistand',
        lenke: ekspertbistand
    },
    {
        navn: 'Lønnstilskudd',
        lenke: soknadsskjemaLonnstilskudd()
    },
    {
        navn: 'Inntektsmelding',
        lenke: inntekstmelding
    },
]

export const AltinnContainer: FunctionComponent = () => {
    const [typeAntall, settypeAntall] = useState('');

    const [generellAltinnTilgang, setgenerellAltinnTilgang] = useState(false);

    const {valgtOrganisasjon} = useContext(OrganisasjonsDetaljerContext);
    const {listeMedSkjemaOgTilganger} = useContext(OrganisasjonsListeContext);

    const altinnSkjemaMedTilgang = finnOgTellTilganger(listeMedSkjemaOgTilganger, valgtOrganisasjon.OrganizationNumber);

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




    const lagAltinnlenker = (): any [] => {
        const altinnLenkeObjekt: any []= [];
        skjemanavnMedLenker.forEach( skjema => {
            if (altinnSkjemaMedTilgang.filter(navn => navn === skjema.navn).length) {
                altinnLenkeObjekt.push(genererAltinnSkjema(skjema.navn, skjema.lenke, typeAntall))
            }
        })
        return altinnLenkeObjekt
    }

    return (
        <div className={'altinn-container'}>
            {generellAltinnTilgang && (
                <div className={'altinn-container__tekst'}>
                    <Undertittel>Søknader og skjemaer på Altinn</Undertittel>
                </div>
            )}
            <div className={'altinn-container__bokser'}>
                {lagAltinnlenker()}
            </div>
        </div>
    );
};
