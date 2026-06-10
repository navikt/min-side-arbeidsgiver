import React from 'react';
import './TiltakAvtaler.css';
import tiltakikon from './tiltak-avtaler-ikon-kontrast.svg';
import { Avtalenavn, useAvtaleoversikt } from './useAvtaleoversikt';
import { StortTall, Tjenesteboks } from '../Tjenesteboks';
import { BodyShort } from '@navikt/ds-react';
import { useOrganisasjonsDetaljerContext } from '../../../OrganisasjonsDetaljerContext';
import { gittMiljo } from '../../../../utils/environment';

const displayname: Record<Avtalenavn, string> = {
    ARBEIDSTRENING: 'arbeidstrening',
    MIDLERTIDIG_LONNSTILSKUDD: 'lønnstilskudd',
    VARIG_LONNSTILSKUDD: 'varig lønnstilskudd',
    SOMMERJOBB: 'sommerjobb',
    INKLUDERINGSTILSKUDD: 'inkluderingstilskudd',
    MENTOR: 'mentortilskudd',
    VTAO: 'varig tilrettelagt arbeid',
    FIREARIG_LONNSTILSKUDD: 'fireårig lønnstilskudd for unge',
};

const displayorder: Avtalenavn[] = [
    'ARBEIDSTRENING',
    'MIDLERTIDIG_LONNSTILSKUDD',
    'VARIG_LONNSTILSKUDD',
    'SOMMERJOBB',
    'INKLUDERINGSTILSKUDD',
    'MENTOR',
    'VTAO',
    'FIREARIG_LONNSTILSKUDD',
];

const TiltakAvtaler = () => {
    const orgnr = useOrganisasjonsDetaljerContext().valgtOrganisasjon.organisasjon.orgnr;

    // Tilgangsstyring skjer i tiltaksgjennomforing-api; responsen inneholder kun avtaletyper
    // brukeren har tilgang til for valgt virksomhet.
    const avtaler = useAvtaleoversikt();

    const tiltakUrl = `${gittMiljo({
        prod: 'https://arbeidsgiver.nav.no/tiltaksgjennomforing/?part=arbeidsgiver',
        demo: 'https://tiltaksgjennomforing-labs.ekstern.dev.nav.no/tiltaksgjennomforing/?part=arbeidsgiver',
        other: 'https://tiltaksgjennomforing.intern.dev.nav.no/tiltaksgjennomforing/?part=arbeidsgiver',
    })}&bedrift=${orgnr ?? ''}`;

    const tallElems = displayorder.flatMap((avtaletype) => {
        const antall = avtaler[avtaletype];
        return antall > 0
            ? [
                  <StortTall key={`${avtaletype}-tall`}>{antall}</StortTall>,
                  <div key={`${avtaletype}-tekst`} className="tekst">
                      {displayname[avtaletype]}
                  </div>,
              ]
            : [];
    });

    const aria_label =
        'Avtaler om Tiltak.' +
        displayorder.flatMap((avtaletype) => {
            const antall = avtaler[avtaletype];
            return antall > 0 ? ` ${antall} ${displayname[avtaletype]}` : '';
        });
    return (
        <Tjenesteboks
            ikon={tiltakikon}
            href={tiltakUrl}
            tittel={'Avtaler om tiltak'}
            aria-label={aria_label}
        >
            <div className={'tiltakboks'}>
                {tallElems.length > 0 ? (
                    <div className="tekstMedTallContainer">{tallElems}</div>
                ) : (
                    <TekstUtenTall />
                )}
            </div>
        </Tjenesteboks>
    );
};

const TekstUtenTall = () => (
    <>
        <BodyShort className="avsnitt">
            Arbeidstrening, lønnstilskudd, mentortilskudd, inkluderingstilskudd, varig tilrettelagt
            arbeid og sommerjobb.
        </BodyShort>
        <BodyShort>De ulike tiltakene krever egne tilganger i Altinn</BodyShort>
    </>
);

export default TiltakAvtaler;
