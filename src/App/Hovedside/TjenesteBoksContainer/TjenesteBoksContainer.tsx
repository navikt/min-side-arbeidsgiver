import React, { FunctionComponent, useContext, useEffect } from 'react';
import { OrganisasjonsDetaljerContext } from '../../OrganisasjonDetaljerProvider';
import { OrganisasjonsListeContext } from '../../OrganisasjonsListeProvider';
import { loggSidevisningOgTilgangsKombinasjonAvTjenestebokser } from '../../../utils/funksjonerForAmplitudeLogging';
import Arbeidsforholdboks from './Arbeidsforholdboks/Arbeidsforholdboks';
import Syfoboks from './Syfoboks/Syfoboks';
import Pamboks from './Pamboks/Pamboks';
import Innholdsboks from '../Innholdsboks/Innholdsboks';
import Arbeidstreningboks from './ArbeidstreningLonnstilskuddBoks/Arbeidstreningboks/Arbeidstreningboks';
import IAwebboks from './IAwebboks/IAwebboks';
import MidlertidigLonnstilskuddboks
    from './ArbeidstreningLonnstilskuddBoks/MidlertidigLonnstilskuddboks/MidlertidigLonnstilskuddboks';
import VarigLonnstilskuddboks from './ArbeidstreningLonnstilskuddBoks/VarigLonnstilskuddboks/VarigLonnstilskuddboks';
import './TjenesteBoksContainer.less';
import { Tilgang } from '../../LoginBoundary';

const TjenesteBoksContainer: FunctionComponent = () => {
    const {
        valgtOrganisasjon,
        arbeidstreningsavtaler,
        midlertidigLonnstilskuddAvtaler,
        varigLonnstilskuddAvtaler,
        tilgangTilPam,
    } = useContext(OrganisasjonsDetaljerContext);
    const {
        tilgangTilSyfo,
    } = useContext(OrganisasjonsListeContext);


    let antallTjenester = 0

    tilgangTilSyfo === Tilgang.TILGANG && (antallTjenester += 1);

    const tilgang = valgtOrganisasjon?.altinnSkjematilgang
    tilgang?.arbeidsforhold && (antallTjenester += 1);
    tilgang?.iaweb && (antallTjenester += 1);

    tilgangTilPam === Tilgang.TILGANG && (antallTjenester += 1);

    const visArbeidstrening = tilgang?.arbeidstrening && arbeidstreningsavtaler.length > 0;
    visArbeidstrening && (antallTjenester += 1);

    const visMidlertidigLonnstilskudd = tilgang?.midlertidigLønnstilskudd && midlertidigLonnstilskuddAvtaler.length > 0;
    visMidlertidigLonnstilskudd && (antallTjenester += 1);

    const visVarigLonnstilskudd = tilgang?.varigLønnstilskudd && varigLonnstilskuddAvtaler.length > 0;
    visVarigLonnstilskudd && (antallTjenester += 1);

    let antallClassname;
    if (antallTjenester === 1) {
        antallClassname = 'antall-en';
    } else if (antallTjenester % 2 === 0) {
        antallClassname = 'antall-partall';
    } else {
        antallClassname = 'antall-oddetall';
    }

    useEffect( () => {
            loggSidevisningOgTilgangsKombinasjonAvTjenestebokser(
                valgtOrganisasjon,
                {
                    tilgangTilSyfo,
                    tilgangTilPam
                }
            );
        }, [valgtOrganisasjon, tilgangTilSyfo, tilgangTilPam]
    );

    return (
        <div className={'tjenesteboks-container ' + antallClassname}>
            {(
                <>
                    {tilgang?.arbeidsforhold && (
                        <Innholdsboks classname="tjenesteboks">
                            <Arbeidsforholdboks />
                        </Innholdsboks>
                    )}
                    {tilgangTilSyfo && (
                        <Innholdsboks classname="tjenesteboks">
                            <Syfoboks />
                        </Innholdsboks>
                    )}
                    {tilgang?.iaweb && (
                        <Innholdsboks classname="tjenesteboks">
                            <IAwebboks />
                        </Innholdsboks>
                    )}
                    {tilgangTilPam === Tilgang.TILGANG && (
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
