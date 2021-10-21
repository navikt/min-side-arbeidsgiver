import React, { useContext, useEffect, useState } from 'react';
import { Normaltekst } from 'nav-frontend-typografi';
import { tiltaksgjennomforingURL } from '../../../../lenker';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import TjenesteBoksBanner from '../TjenesteBoksBanner/TjenesteBoksBanner';
import './Tiltakboks.less';

import tiltakikon from './tiltakboks-ikon.svg';
import { LenkepanelMedLogging } from '../../../../GeneriskeElementer/LenkepanelMedLogging';
import { Arbeidsavtale, hentArbeidsavtaler } from '../../../../api/arbeidsavtalerApi';

const Tiltakboks = () => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    const [arbeidstreningsavtaler, setArbeidstreningsavtaler] = useState(Array<Arbeidsavtale>());
    const [midlertidigLonnstilskuddAvtaler, setMidlertidigLonnstilskuddAvtaler] = useState(
        Array<Arbeidsavtale>()
    );
    const [varigLonnstilskuddAvtaler, setVarigLonnstilskuddAvtaler] = useState(
        Array<Arbeidsavtale>()
    );
    useEffect(()=>{
        if(valgtOrganisasjon)
        hentArbeidsavtaler(valgtOrganisasjon.organisasjon)
            .then((avtaler: Arbeidsavtale[]) => {
                const avtalerMedTiltaktype = (tiltaktype: string) =>
                    avtaler.filter(
                        (avtale: Arbeidsavtale) => avtale.tiltakstype === tiltaktype
                    );
                setArbeidstreningsavtaler(avtalerMedTiltaktype('ARBEIDSTRENING'));
                setMidlertidigLonnstilskuddAvtaler(
                    avtalerMedTiltaktype('MIDLERTIDIG_LONNSTILSKUDD')
                );
                setVarigLonnstilskuddAvtaler(avtalerMedTiltaktype('VARIG_LONNSTILSKUDD'));
            })
            .catch(_ => {
                setArbeidstreningsavtaler([]);
                setMidlertidigLonnstilskuddAvtaler([]);
                setVarigLonnstilskuddAvtaler([]);
            });
    }, [valgtOrganisasjon])

    const tiltakUrl = valgtOrganisasjon && valgtOrganisasjon.organisasjon.OrganizationNumber !== ''
        ? `${tiltaksgjennomforingURL}&bedrift=${valgtOrganisasjon.organisasjon.OrganizationNumber}`
        : tiltaksgjennomforingURL;
    const TekstMedAlleTall = () =>
        <>
            <div><span className={'topptekst'}> <span className={'antall'}>{midlertidigLonnstilskuddAvtaler.length}</span> midlertidig lønnstilskudd </span>
                <span className={'topptekst'}> <span className={'antall'}>{arbeidstreningsavtaler.length}</span> arbeidstrening </span></div>
            <div><span className={'topptekst'}> <span className={'antall'}>{varigLonnstilskuddAvtaler.length}</span> varig lønnstilskudd </span>
                <span className={'topptekst'}> <span className={'antall'}>{3}</span> sommerjobb </span></div>
        </>
    const TekstUtenTall = () =>
        <>
            <Normaltekst className="avsnitt">
                Arbeidstrening, midlertidig lønnstilskudd, varig lønnstilskudd og sommerjobb.
            </Normaltekst>
            <Normaltekst>
                De ulike tiltakene krever egne tilganger i Altinn
            </Normaltekst>
        </>
    return (
        <div className="tiltakboks tjenesteboks-innhold">
            <TjenesteBoksBanner
                tittel="Avtaler om tiltak"
                imgsource={tiltakikon}
                altTekst=""
            />
            <LenkepanelMedLogging
                href={tiltakUrl}
                loggLenketekst="Tiltak"
                tittelProps="normaltekst"
                aria-label="Tiltak. Arbeidstrening, midlertidig lønnstilskudd, varig lønnstilskudd og sommerjobb. De ulike tiltakene krever egne tilganger i Altinn"
            >
                {arbeidstreningsavtaler.length>0 ? TekstMedAlleTall() : TekstUtenTall()}
            </LenkepanelMedLogging>
        </div>
    );
};

export default Tiltakboks;
