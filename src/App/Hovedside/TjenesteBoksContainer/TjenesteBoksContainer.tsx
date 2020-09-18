import React, { FunctionComponent, useContext, useEffect, useState } from 'react';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import { OrganisasjonsListeContext } from '../../../OrganisasjonsListeProvider';
import { Tilgang } from '../../LoginBoundary';
import { loggSidevisningOgTilgangsKombinasjonAvTjenestebokser } from '../../../utils/funksjonerForAmplitudeLogging';
import Arbeidsforholdboks from './Arbeidsforholdboks/Arbeidsforholdboks';
import Syfoboks from './Syfoboks/Syfoboks';
import Pamboks from './Pamboks/Pamboks';
import Innholdsboks from '../Innholdsboks/Innholdsboks';
import Arbeidstreningboks from './ArbeidstreningLonnstilskuddBoks/Arbeidstreningboks/Arbeidstreningboks';
import IAwebboks from './IAwebboks/IAwebboks';
import LasterBoks from '../AltinnContainer/LasterBoks/LasterBoks';
import MidlertidigLonnstilskuddboks from './ArbeidstreningLonnstilskuddBoks/MidlertidigLonnstilskuddboks/MidlertidigLonnstilskuddboks';
import VarigLonnstilskuddboks from './ArbeidstreningLonnstilskuddBoks/VarigLonnstilskuddboks/VarigLonnstilskuddboks';
import './TjenesteBoksContainer.less';

const TjenesteBoksContainer: FunctionComponent = () => {
    const {
        tilganger,
        valgtOrganisasjon,
        arbeidstreningsavtaler,
        midlertidigLonnstilskuddAvtaler,
        varigLonnstilskuddAvtaler,
    } = useContext(OrganisasjonsDetaljerContext);
    const {
        organisasjonslisteFerdigLastet,
        organisasjonerMedIAFerdigLastet,
        organisasjoner,
    } = useContext(OrganisasjonsListeContext);

    const [typeAntall, settypeAntall] = useState('');
    const [ferdigLastet, setFerdigLastet] = useState(false);

    const [visIA, setVisIA] = useState(false);
    const [visArbeidstrening, setVisArbeidstrening] = useState(false);
    const [visSyfo, setVisSyfo] = useState(false);
    const [visPAM, setVisPam] = useState(false);
    const [visArbeidsforhold, setVisArbeidsforhold] = useState(false);
    const [visMidlertidigLonnstilskudd, setVisMidlertidigLonnstilskudd] = useState(false);
    const [visVarigLonnstilskudd, setVisVarigLonnstilskudd] = useState(false);

    useEffect(() => {
        setFerdigLastet(false);

        if (!Object.values(tilganger).includes(Tilgang.LASTER)) {
            setVisSyfo(tilganger.tilgangTilSyfo === Tilgang.TILGANG);
            setVisPam(tilganger.tilgangTilPam === Tilgang.TILGANG);
            setVisIA(tilganger.tilgangTilIAWeb === Tilgang.TILGANG);
            setVisArbeidstrening(
                tilganger.tilgangTilArbeidstreningsavtaler === Tilgang.TILGANG && arbeidstreningsavtaler.length > 0
            );
            setVisArbeidsforhold(tilganger.tilgangTilArbeidsforhold === Tilgang.TILGANG);
            setVisMidlertidigLonnstilskudd(
                tilganger.tilgangTilMidlertidigLonnstilskudd === Tilgang.TILGANG && midlertidigLonnstilskuddAvtaler.length > 0
            );
            setVisVarigLonnstilskudd(
                tilganger.tilgangTilVarigLonnstilskudd === Tilgang.TILGANG && varigLonnstilskuddAvtaler.length > 0
            );
        }
    }, [
        valgtOrganisasjon,
        tilganger,
        arbeidstreningsavtaler,
        midlertidigLonnstilskuddAvtaler,
        varigLonnstilskuddAvtaler,
    ]);

    useEffect(() => {
        const antallTjenester = Object.values(tilganger).filter(tilgang => tilgang === Tilgang.TILGANG).length;

        if (!Object.values(tilganger).includes(Tilgang.LASTER)) {
            if (antallTjenester % 2 === 0) {
                settypeAntall('antall-partall');
            }
            if (antallTjenester % 2 !== 0 && antallTjenester !== 1) {
                settypeAntall('antall-oddetall');
            }
            if (antallTjenester === 1) {
                settypeAntall('antall-en');
            }
            loggSidevisningOgTilgangsKombinasjonAvTjenestebokser(tilganger);
            setFerdigLastet(true);
        }
    }, [
        organisasjonslisteFerdigLastet,
        organisasjonerMedIAFerdigLastet,
        tilganger,
        organisasjoner,
    ]);

    return (
        <div className={'tjenesteboks-container ' + typeAntall}>
            {!ferdigLastet && <LasterBoks />}

            {ferdigLastet && (
                <>
                    {visArbeidsforhold && (
                        <Innholdsboks classname="tjenesteboks">
                            <Arbeidsforholdboks />
                        </Innholdsboks>
                    )}
                    {visSyfo && (
                        <Innholdsboks classname="tjenesteboks">
                            <Syfoboks />
                        </Innholdsboks>
                    )}
                    {visIA && (
                        <Innholdsboks classname="tjenesteboks">
                            <IAwebboks />
                        </Innholdsboks>
                    )}
                    {visPAM && (
                        <Innholdsboks classname="tjenesteboks">
                            <Pamboks />
                        </Innholdsboks>
                    )}
                    {visMidlertidigLonnstilskudd && (
                        <Innholdsboks classname="tjenesteboks">
                            <MidlertidigLonnstilskuddboks />
                        </Innholdsboks>
                    )}
                    {visVarigLonnstilskudd && (
                        <Innholdsboks classname="tjenesteboks">
                            <VarigLonnstilskuddboks />
                        </Innholdsboks>
                    )}
                    {visArbeidstrening && (
                        <Innholdsboks classname="tjenesteboks">
                            <Arbeidstreningboks />
                        </Innholdsboks>
                    )}
                </>
            )}
        </div>
    );
};

export default TjenesteBoksContainer;
