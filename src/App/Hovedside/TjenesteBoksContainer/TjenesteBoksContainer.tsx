import React, { FunctionComponent, useContext } from 'react';
import { OrganisasjonsDetaljerContext } from '../../OrganisasjonDetaljerProvider';
import { OrganisasjonerOgTilgangerContext } from '../../OrganisasjonerOgTilgangerProvider';
import { Tilgang } from '../../LoginBoundary';
import Arbeidsforholdboks from './Arbeidsforholdboks/Arbeidsforholdboks';
import Syfoboks from './Syfoboks/Syfoboks';
import Pamboks from './Pamboks/Pamboks';
import Innholdsboks from '../Innholdsboks/Innholdsboks';
import Tiltakboks from './Tiltakboks/Tiltakboks';
import IAwebboks from './IAwebboks/IAwebboks';
import './TjenesteBoksContainer.less';
import { AltinnId } from '../../../altinn/tjenester';

const TjenesteBoksContainer: FunctionComponent = () => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    const { tilgangTilSyfo } = useContext(OrganisasjonerOgTilgangerContext);
    const tilgang = valgtOrganisasjon?.altinnSkjematilgang;

    const harTilgang = (altinnId: AltinnId): boolean =>
        tilgang !== undefined && tilgang[altinnId].tilgang === 'ja';

    const tjenester: FunctionComponent[] = [];

    if (harTilgang('arbeidsforhold')) {
        tjenester.push(Arbeidsforholdboks)
    }

    if (tilgangTilSyfo === Tilgang.TILGANG) {
        tjenester.push(Syfoboks);
    }

    if (harTilgang('iaweb')) {
        tjenester.push(IAwebboks)
    }
    if (harTilgang('pam')) {
        tjenester.push(Pamboks)
    }
    if (harTilgang('midlertidigLønnstilskudd') || harTilgang('varigLønnstilskudd') || harTilgang('arbeidstrening')) {
        tjenester.push(Tiltakboks);
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
