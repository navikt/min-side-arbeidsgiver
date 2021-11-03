import React, { useContext, useEffect, useState } from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import { tiltaksgjennomforingURL } from '../../../../lenker';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import TjenesteBoksBanner from '../TjenesteBoksBanner/TjenesteBoksBanner';
import './Tiltakboks.less';

import tiltakikon from './tiltakboks-ikon.svg';
import { LenkepanelMedLogging } from '../../../../GeneriskeElementer/LenkepanelMedLogging';
import { Arbeidsavtale, hentArbeidsavtaler } from '../../../../api/arbeidsavtalerApi';
import { EksperimentContext } from '../../../EksperimentProvider';

const Tiltakboks = () => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    const { visTall } = useContext(EksperimentContext);
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
        <div className={'tekst'}><span className={'antall'}>{antall}</span>{tekst}</div>;

    const TekstMedTall = () =>
        <div className={'tekstMedTallContainer'}>
            {midlertidigLonnstilskuddAvtaler > 0 ? lagTekstMedTallElement(midlertidigLonnstilskuddAvtaler, 'midlertildig lønnstilskudd') : null}
            {arbeidstreningsavtaler > 0 ? lagTekstMedTallElement(arbeidstreningsavtaler, 'arbeidstrening') : null}
            {varigLonnstilskuddAvtaler > 0 ? lagTekstMedTallElement(varigLonnstilskuddAvtaler, 'varig lønnstilskudd') : null}
            {sommerjobbAvtaler > 0 ? lagTekstMedTallElement(sommerjobbAvtaler, 'sommerjobb') : null}
        </div>;

    const TekstUtenTall = () =>
        <>
            <Normaltekst className='avsnitt'>
                Arbeidstrening, midlertidig lønnstilskudd, varig lønnstilskudd og sommerjobb.
            </Normaltekst>
            <Normaltekst>
                De ulike tiltakene krever egne tilganger i Altinn
            </Normaltekst>
        </>;
    return (
        <div className='tiltakboks tjenesteboks-innhold'>
            <TjenesteBoksBanner
                tittel='Avtaler om tiltak'
                imgsource={tiltakikon}
                altTekst=''
            />
            <LenkepanelMedLogging
                href={tiltakUrl}
                loggLenketekst='Tiltak'
                tittelProps='normaltekst'
                aria-label='Tiltak. Arbeidstrening, midlertidig lønnstilskudd, varig lønnstilskudd og sommerjobb. De ulike tiltakene krever egne tilganger i Altinn'
            >
                {tiltaksAvtaler.length > 0 && visTall === true ? TekstMedTall() : TekstUtenTall()}
            </LenkepanelMedLogging>
        </div>
    );
};

export default Tiltakboks;
