import React, { FunctionComponent, useContext } from 'react';
import { OrganisasjonsDetaljerContext } from '../../OrganisasjonDetaljerProvider';
import { OrganisasjonerOgTilgangerContext } from '../../OrganisasjonerOgTilgangerProvider';
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
    } = useContext(OrganisasjonsDetaljerContext);
    const {
        tilgangTilSyfo,
    } = useContext(OrganisasjonerOgTilgangerContext);

    const tilgang = valgtOrganisasjon?.altinnSkjematilgang

    const tjenester: FunctionComponent[] = []

    if (tilgang?.arbeidsforhold) {
        tjenester.push(Arbeidsforholdboks)
    }
    if (tilgangTilSyfo === Tilgang.TILGANG) {
        tjenester.push(Syfoboks);
    }
    if (tilgang?.iaweb) {
        tjenester.push(IAwebboks)
    }
    if (tilgang?.pam) {
        tjenester.push(Pamboks)
    }
    if (tilgang?.midlertidigLønnstilskudd && midlertidigLonnstilskuddAvtaler.length > 0) {
        tjenester.push(MidlertidigLonnstilskuddboks);
    }
    if (tilgang?.varigLønnstilskudd && varigLonnstilskuddAvtaler.length > 0) {
        tjenester.push(VarigLonnstilskuddboks)
    }
    if (tilgang?.arbeidstrening && arbeidstreningsavtaler.length > 0) {
        tjenester.push(Arbeidstreningboks)
    }

    let antallClassname;
    if (tjenester.length === 1) {
        antallClassname = 'antall-en';
    } else if (tjenester.length % 2 === 0) {
        antallClassname = 'antall-partall';
    } else {
        antallClassname = 'antall-oddetall';
    }

    return (
        <div className={'tjenesteboks-container ' + antallClassname}>
            {tjenester.map((Tjeneste, indeks) =>
                <Innholdsboks classname="tjenesteboks" key={indeks}>
                    <Tjeneste/>
                </Innholdsboks>
            )}
        </div>
    );
};

export default TjenesteBoksContainer;
