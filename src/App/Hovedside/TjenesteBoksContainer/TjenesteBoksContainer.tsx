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
    let visArbeidstrening = false
    let visMidlertidigLonnstilskudd = false
    let visVarigLonnstilskudd = false

    tilgangTilSyfo && (antallTjenester += 1);

    const tilganger = valgtOrganisasjon?.altinnSkjematilgang
    if (valgtOrganisasjon && tilganger) {
        tilganger.Arbeidsforhold && (antallTjenester += 1);
        valgtOrganisasjon.iawebtilgang && (antallTjenester += 1);

        tilgangTilPam === Tilgang.TILGANG && (antallTjenester += 1);

        if (tilganger.Arbeidstrening && arbeidstreningsavtaler.length > 0) {
            visArbeidstrening = true;
            antallTjenester += 1;
        }

        if (tilganger['Midlertidig lønnstilskudd'] && midlertidigLonnstilskuddAvtaler.length > 0) {
            visMidlertidigLonnstilskudd = true;
            antallTjenester += 1;
        }
        if (tilganger['Varig lønnstilskudd'] && varigLonnstilskuddAvtaler.length > 0) {
            visVarigLonnstilskudd = true;
            antallTjenester += 1;
        }
    }

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
                    {tilganger?.Arbeidsforhold && (
                        <Innholdsboks classname="tjenesteboks">
                            <Arbeidsforholdboks />
                        </Innholdsboks>
                    )}
                    {tilgangTilSyfo && (
                        <Innholdsboks classname="tjenesteboks">
                            <Syfoboks />
                        </Innholdsboks>
                    )}
                    {valgtOrganisasjon?.iawebtilgang && (
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
