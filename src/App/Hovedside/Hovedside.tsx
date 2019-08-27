import React, { FunctionComponent, useContext } from 'react';

import './Hovedside.less';
import TjenesteBoksContainer from './TjenesteBoksContainer/TjenesteBoksContainer';
import NyttigForDegContainer from './NyttigForDegContainer/NyttigForDegContainer';
import AltinnContainer from './AltinnContainer/AltinnContainer';
import ManglerTilgangBoks from './ManglerTilgangBoks/ManglerTilgangBoks';

import { OrganisasjonsDetaljerContext } from '../../OrganisasjonDetaljerProvider';
import { OrganisasjonsListeContext } from '../../OrganisasjonsListeProvider';
import { basename } from '../../paths';
import Lenke from 'nav-frontend-lenker';
import ikon from './infomation-circle-2.svg';
import { SkjemaveilederContainer } from './SkjemaveilederContainer/SkjemaveilederContainer';
import { TilgangState } from '../../SyfoTilgangProvider';

const Hovedside: FunctionComponent = () => {
    const { harNoenTilganger, tilgangTilPamState } = useContext(OrganisasjonsDetaljerContext);
    const { organisasjoner } = useContext(OrganisasjonsListeContext);
    const skalViseManglerTilgangBoks = !(organisasjoner.length > 0 || harNoenTilganger);

    console.log('rendrer hovedside:', tilgangTilPamState);
    if (tilgangTilPamState === TilgangState.LASTER) {
        return null;
    }
    return (
        <div className="forside">
            {skalViseManglerTilgangBoks && <ManglerTilgangBoks />}
            <TjenesteBoksContainer />
            <NyttigForDegContainer />
            <AltinnContainer />
            <SkjemaveilederContainer />
            {!skalViseManglerTilgangBoks && (
                <div className={'forside__informasjonstekst'}>
                    <img className={'forside__ikon'} src={ikon} alt="informasjonsikon" />
                    Forventet du å se flere tjenester?
                    <Lenke
                        className={'forside__lenke'}
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
