import React, {useContext, useEffect, useState} from 'react';
import {tiltaksgjennomforingURL} from '../../../../lenker';
import {OrganisasjonsDetaljerContext} from '../../../OrganisasjonDetaljerProvider';
import './Tiltakboks.less';
import tiltakikon from './tiltakboks-ikon.svg';
import {Arbeidsavtale, hentArbeidsavtaler} from '../../../../api/arbeidsavtalerApi';
import {Tjenesteboks} from "../Tjenesteboks";
import {BodyShort} from "@navikt/ds-react";

const Tiltakboks = () => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    const [tiltaksAvtaler, setTiltaksavtaler] = useState(Array<Arbeidsavtale>());
    const [arbeidstreningsavtaler, setArbeidstreningsavtaler] = useState(0);
    const [midlertidigLonnstilskuddAvtaler, setMidlertidigLonnstilskuddAvtaler] = useState(0,
    );
    const [varigLonnstilskuddAvtaler, setVarigLonnstilskuddAvtaler] = useState(0,
    );
    const [sommerjobbAvtaler, setSommerjobbAvtaler] = useState(
        0,
    );

    useEffect(() => {
        if (valgtOrganisasjon)
            hentArbeidsavtaler(valgtOrganisasjon.organisasjon)
                .then((avtaler: Arbeidsavtale[]) => {
                    setTiltaksavtaler(avtaler);
                    const avtalerMedTiltaktype = (tiltaktype: string) =>
                        avtaler.filter(
                            (avtale: Arbeidsavtale) => avtale.tiltakstype === tiltaktype,
                        ).length;
                    setArbeidstreningsavtaler(avtalerMedTiltaktype('ARBEIDSTRENING'));
                    setMidlertidigLonnstilskuddAvtaler(
                        avtalerMedTiltaktype('MIDLERTIDIG_LONNSTILSKUDD'),
                    );
                    setVarigLonnstilskuddAvtaler(avtalerMedTiltaktype('VARIG_LONNSTILSKUDD'));
                    setSommerjobbAvtaler(avtalerMedTiltaktype('SOMMERJOBB'));
                })
                .catch(_ => {
                    setTiltaksavtaler([]);
                    setArbeidstreningsavtaler(0);
                    setMidlertidigLonnstilskuddAvtaler(0);
                    setVarigLonnstilskuddAvtaler(0);
                    setSommerjobbAvtaler(0);
                });
    }, [valgtOrganisasjon]);

    const tiltakUrl = valgtOrganisasjon && valgtOrganisasjon.organisasjon.OrganizationNumber !== ''
        ? `${tiltaksgjennomforingURL}&bedrift=${valgtOrganisasjon.organisasjon.OrganizationNumber}`
        : tiltaksgjennomforingURL;

    const lagTekstMedTallElement = (antall: number, tekst: string) =>
        <div className='tekst'><span className='antall'>{antall}</span>{tekst}</div>;

    const TekstMedTall = () =>
        <div className='tekstMedTallContainer'>
            {midlertidigLonnstilskuddAvtaler > 0 ? lagTekstMedTallElement(midlertidigLonnstilskuddAvtaler, 'midlertildig lønnstilskudd') : null}
            {arbeidstreningsavtaler > 0 ? lagTekstMedTallElement(arbeidstreningsavtaler, 'arbeidstrening') : null}
            {varigLonnstilskuddAvtaler > 0 ? lagTekstMedTallElement(varigLonnstilskuddAvtaler, 'varig lønnstilskudd') : null}
            {sommerjobbAvtaler > 0 ? lagTekstMedTallElement(sommerjobbAvtaler, 'sommerjobb') : null}
        </div>;

    const TekstUtenTall = () =>
        <>
            <BodyShort className='avsnitt'>
                Arbeidstrening, midlertidig lønnstilskudd, varig lønnstilskudd og sommerjobb.
            </BodyShort>
            <BodyShort >
                De ulike tiltakene krever egne tilganger i Altinn
            </BodyShort>
        </>;
    return <Tjenesteboks
        ikon={tiltakikon}
        href={tiltakUrl}
        tittel={'Avtaler om tiltak'}
        aria-label={'Tiltak. Arbeidstrening, midlertidig lønnstilskudd, varig lønnstilskudd og sommerjobb. ' +
            'De ulike tiltakene krever egne tilganger i Altinn'}
    >
        <div className={"tiltakboks"}>
            {tiltaksAvtaler.length > 0 ? TekstMedTall() : TekstUtenTall()}
        </div>
    </Tjenesteboks>;
};

export default Tiltakboks;
