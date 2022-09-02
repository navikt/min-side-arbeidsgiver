import React, {useContext, useEffect, useState} from 'react';
import {tiltaksgjennomforingURL} from '../../../../lenker';
import {OrganisasjonsDetaljerContext} from '../../../OrganisasjonDetaljerProvider';
import './Tiltakboks.css';
import tiltakikon from './tiltakboks-ikon.svg';
import {Arbeidsavtale, hentArbeidsavtaler} from '../../../../api/arbeidsavtalerApi';
import {Tjenesteboks} from "../Tjenesteboks";
import {BodyShort} from "@navikt/ds-react";
import * as Record from '../../../../utils/Record'

const displayname = {
    'ARBEIDSTRENING': 'arbeidstrening',
    'MIDLERTIDIG_LONNSTILSKUDD': 'lønnstilskudd',
    'VARIG_LONNSTILSKUDD': 'varig lønnstilskudd',
    'SOMMERJOBB': 'sommerjobb',
    'INKLUDERINGSTILSKUDD': 'inkluderingstilskudd',
    'MENTOR': 'mentortilskudd',
}

const displayorder: (keyof typeof displayname)[] = [
    'ARBEIDSTRENING',
    'MIDLERTIDIG_LONNSTILSKUDD',
    'VARIG_LONNSTILSKUDD',
    'SOMMERJOBB',
    'INKLUDERINGSTILSKUDD',
    'MENTOR',
]

const Tiltakboks = () => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    const orgnr = valgtOrganisasjon?.organisasjon?.OrganizationNumber
    const [avtaleoversikt, setAvtaleoversikt] = useState<Record<string, number>>({})

    useEffect(() => {
        if (orgnr !== undefined) {
            hentArbeidsavtaler(orgnr)
                .then((avtaler: Arbeidsavtale[]) => {
                    const avtalerMedTiltaktype = (tiltaktype: string) =>
                        avtaler.filter((avtale: Arbeidsavtale) => avtale.tiltakstype === tiltaktype).length;
                    setAvtaleoversikt({
                        'ARBEIDSTRENING': avtalerMedTiltaktype('ARBEIDSTRENING'),
                        'MIDLERTIDIG_LONNSTILSKUDD': avtalerMedTiltaktype('MIDLERTIDIG_LONNSTILSKUDD'),
                        'VARIG_LONNSTILSKUDD': avtalerMedTiltaktype('VARIG_LONNSTILSKUDD'),
                        'SOMMERJOBB': avtalerMedTiltaktype('SOMMERJOBB'),
                        'INKLUDERINGSTILSKUDD': avtalerMedTiltaktype('INKLUDERINGSTILSKUDD'),
                        'MENTOR': avtalerMedTiltaktype('MENTOR'),
                    })
                })
                .catch(_ => {
                    setAvtaleoversikt({})
                });
        }
    }, [orgnr]);

    const tiltakUrl = orgnr !== undefined && orgnr !== ''
        ? `${tiltaksgjennomforingURL}&bedrift=${orgnr}`
        : tiltaksgjennomforingURL;

    const tallElems = displayorder.flatMap(avtaletype => {
        const antall = avtaleoversikt[avtaletype] ?? 0;
        return antall > 0
            ? [<>
                <div key={`${avtaletype}-tall`} className='antall'>{antall}</div>
                <div key={`${avtaletype}-tekst`} className='tekst'>{displayname[avtaletype]}</div>
                </>
                ]
            : [];
    })

    return <Tjenesteboks
        ikon={tiltakikon}
        href={tiltakUrl}
        tittel={'Avtaler om tiltak'}
        aria-label={'Tiltak. Arbeidstrening, midlertidig lønnstilskudd, varig lønnstilskudd og sommerjobb. ' +
            'De ulike tiltakene krever egne tilganger i Altinn'}
    >
        <div className={"tiltakboks"}>
            {tallElems.length > 0
                ? <div className='tekstMedTallContainer'>
                    { tallElems }
                </div>
                : <TekstUtenTall />
            }
        </div>
    </Tjenesteboks>;
};

const TekstUtenTall = () =>
    <>
        <BodyShort className='avsnitt'>
            Arbeidstrening, lønnstilskudd, varig lønnstilskudd, mentortilskudd,
            inkluderingstilskudd og sommerjobb.
        </BodyShort>
        <BodyShort >
            De ulike tiltakene krever egne tilganger i Altinn
        </BodyShort>
    </>;


export default Tiltakboks;
