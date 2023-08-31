import React, { useContext } from 'react';
import { tiltaksgjennomforingURL } from '../../../../lenker';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import './Tiltakboks.css';
import tiltakikon from './tiltakboks-ikon.svg';
import { Avtalenavn, useAvtaleoversikt } from './useAvtaleoversikt';
import { Tjenesteboks } from '../Tjenesteboks';
import { BodyShort } from '@navikt/ds-react';

const displayname: Record<Avtalenavn, string> = {
    ARBEIDSTRENING: 'arbeidstrening',
    MIDLERTIDIG_LONNSTILSKUDD: 'lønnstilskudd',
    VARIG_LONNSTILSKUDD: 'varig lønnstilskudd',
    SOMMERJOBB: 'sommerjobb',
    INKLUDERINGSTILSKUDD: 'inkluderingstilskudd',
    MENTOR: 'mentortilskudd',
};

const displayorder: Avtalenavn[] = [
    'ARBEIDSTRENING',
    'MIDLERTIDIG_LONNSTILSKUDD',
    'VARIG_LONNSTILSKUDD',
    'SOMMERJOBB',
    'INKLUDERINGSTILSKUDD',
    'MENTOR',
];

const Tiltakboks = () => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    const orgnr = valgtOrganisasjon?.organisasjon?.OrganizationNumber;

    const avtaler = useAvtaleoversikt();

    const tiltakUrl = `${tiltaksgjennomforingURL}&bedrift=${orgnr ?? ''}`;

    const tallElems = displayorder.flatMap((avtaletype) => {
        const antall = avtaler[avtaletype];
        return antall > 0
            ? [
                  <div key={`${avtaletype}-tall`} className="antall">
                      {antall}
                  </div>,
                  <div key={`${avtaletype}-tekst`} className="tekst">
                      {displayname[avtaletype]}
                  </div>,
              ]
            : [];
    });

    return (
        <Tjenesteboks
            ikon={tiltakikon}
            href={tiltakUrl}
            tittel={'Avtaler om tiltak'}
            aria-label={
                'Tiltak. Arbeidstrening, lønnstilskudd, mentortilskudd, inkluderingstilskudd og sommerjobb. ' +
                'De ulike tiltakene krever egne tilganger i Altinn'
            }
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
            Arbeidstrening, lønnstilskudd, mentortilskudd, inkluderingstilskudd og sommerjobb.
        </BodyShort>
        <BodyShort>De ulike tiltakene krever egne tilganger i Altinn</BodyShort>
    </>
);

export default Tiltakboks;
