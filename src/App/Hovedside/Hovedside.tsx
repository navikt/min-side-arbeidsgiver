import React, { FunctionComponent, useContext } from 'react';

import './Hovedside.less';
import TjenesteBoksContainer from './TjenesteBoksContainer/TjenesteBoksContainer';
import NyttigForDegContainer from './NyttigForDegContainer/NyttigForDegContainer';
import AltinnContainer from './AltinnContainer/AltinnContainer';
import ManglerTilgangBoks from './ManglerTilgangBoks/ManglerTilgangBoks';

import { OrganisasjonsDetaljerContext, TilgangAltinn, TilgangPam } from "../../OrganisasjonDetaljerProvider";
import { OrganisasjonsListeContext } from '../../OrganisasjonsListeProvider';
import { basename } from '../../paths';
import Lenke from 'nav-frontend-lenker';
import ikon from './infomation-circle-2.svg';
import { SkjemaveilederContainer } from './SkjemaveilederContainer/SkjemaveilederContainer';
import { TilgangSyfo } from "../../SyfoTilgangProvider";

const Hovedside: FunctionComponent = () => {
    const { harNoenTilganger,tilgangTilAltinnForTreSkjemaState,tilgangTilPamState,tilgangTilSyfoState } = useContext(OrganisasjonsDetaljerContext);
    const { organisasjoner } = useContext(OrganisasjonsListeContext);
    const skalViseManglerTilgangBoks = !(organisasjoner.length > 0 || harNoenTilganger);

    if(tilgangTilAltinnForTreSkjemaState===TilgangAltinn.LASTER || tilgangTilPamState === TilgangPam.LASTER || tilgangTilSyfoState === TilgangSyfo.LASTER ){
      return null;
    }

    return (
        <div className="hovedside">
            {skalViseManglerTilgangBoks && (
                <div className="hovedside__mangler-tilgang-container">
                    <ManglerTilgangBoks />
                </div>
            )}
            <TjenesteBoksContainer />
            <NyttigForDegContainer />
            <AltinnContainer />
            <SkjemaveilederContainer />
            {!skalViseManglerTilgangBoks && (
                <div className={'hovedside__informasjonstekst'}>
                    <img className={'hovedside__ikon'} src={ikon} alt="informasjonsikon" />
                    Forventet du å se flere tjenester?
                    <Lenke
                        className={'hovedside__lenke'}
                        href={basename + '/informasjon-om-tilgangsstyring'}
                    >
                        Les mer om hvordan du får tilgang
                    </Lenke>{' '}
                </div>
            )}
        </div>
    );
};

export default Hovedside;
