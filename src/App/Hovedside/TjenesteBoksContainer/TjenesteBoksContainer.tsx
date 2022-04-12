import React, { FunctionComponent, useContext } from 'react';
import { OrganisasjonsDetaljerContext } from '../../OrganisasjonDetaljerProvider';
import { OrganisasjonerOgTilgangerContext, SyfoTilgang } from '../../OrganisasjonerOgTilgangerProvider';
import Arbeidsforholdboks from './Arbeidsforholdboks/Arbeidsforholdboks';
import Syfoboks from './Syfoboks/Syfoboks';
import Pamboks from './Pamboks/Pamboks';
import Innholdsboks from '../Innholdsboks/Innholdsboks';
import Tiltakboks from './Tiltakboks/Tiltakboks';
import IAwebboks from './IAwebboks/IAwebboks';
import TiltakRefusjonboks from "./TiltakRefusjonboks/TiltakRefusjonboks";
import './TjenesteBoksContainer.less';
import { AltinntjenesteId } from '../../../altinn/tjenester';

const TjenesteBoksContainer: FunctionComponent = () => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    const { tilgangTilSyfo } = useContext(OrganisasjonerOgTilgangerContext);
    const tilgang = valgtOrganisasjon?.altinntilgang;

    const harTilgang = (altinnId: AltinntjenesteId): boolean =>
        tilgang !== undefined && tilgang[altinnId];

    const tjenester: FunctionComponent[] = [];

    if (harTilgang('arbeidsforhold')) {
        tjenester.push(Arbeidsforholdboks);
    }

    if (tilgangTilSyfo === SyfoTilgang.TILGANG) {
        tjenester.push(Syfoboks);
    }

    if (harTilgang('iaweb')) {
        tjenester.push(IAwebboks);
    }

    if (harTilgang('pam')) {
        tjenester.push(Pamboks);
    }
    if (harTilgang('midlertidigLønnstilskudd') || harTilgang('varigLønnstilskudd') || harTilgang('arbeidstrening')) {
        tjenester.push(Tiltakboks);
    }

    if (false){
        tjenester.push(TiltakRefusjonboks);
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
                <Innholdsboks classname='tjenesteboks' key={indeks}>
                    <Tjeneste />
                </Innholdsboks>,
            )}
        </div>
    );
};

export default TjenesteBoksContainer;
