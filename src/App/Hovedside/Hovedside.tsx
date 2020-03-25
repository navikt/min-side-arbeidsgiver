import React, { FunctionComponent, useContext } from 'react';
import Lenke from 'nav-frontend-lenker';
import { OrganisasjonsListeContext } from '../../OrganisasjonsListeProvider';
import { SyfoTilgangContext } from '../../SyfoTilgangProvider';
import { basename } from '../../paths';
import { Tilgang } from '../LoginBoundary';
import TjenesteBoksContainer from './TjenesteBoksContainer/TjenesteBoksContainer';
import NyttigForDegContainer from './NyttigForDegContainer/NyttigForDegContainer';
import { AltinnContainer } from './AltinnContainer/AltinnContainer';
import { ManglerTilgangContainer } from './ManglerTilgangContainer/ManglerTilgangContainer';
import { FeilmeldingContainer } from './FeilmeldingContainer/FeilmeldingContainer';
import { SkjemaveilederContainer } from './SkjemaveilederContainer/SkjemaveilederContainer';
import IkkeTilgangTilDisseTjenestene from './IkkeTilgangTilDisseTjenestene/IkkeTilgangTilDisseTjenestene';
import ikon from './infomation-circle-2.svg';
import './Hovedside.less';
import { Koronaboks } from '../Koronaboks/Koronaboks';

const Hovedside: FunctionComponent = () => {
    const { organisasjoner, visFeilmelding } = useContext(OrganisasjonsListeContext);
    const { tilgangTilSyfoState, visSyfoFeilmelding } = useContext(SyfoTilgangContext);

    const skalViseManglerTilgangBoks = !(
        organisasjoner.length > 0 || tilgangTilSyfoState === Tilgang.TILGANG
    );

    /*const loggPermitteringsinfo = (lenkebeskrivelse: string) => {
        loggTjenesteTrykketPa(lenkebeskrivelse);
    };*/

    return (
        <div className="hovedside">
            <FeilmeldingContainer
                visFeilmelding={visFeilmelding}
                visSyfoFeilmelding={visSyfoFeilmelding}
            />
            <Koronaboks/>
            {skalViseManglerTilgangBoks && <ManglerTilgangContainer />}
            {!skalViseManglerTilgangBoks && (
                <>
                    <TjenesteBoksContainer />
                    <NyttigForDegContainer />
                    <AltinnContainer />
                    <SkjemaveilederContainer />
                    <IkkeTilgangTilDisseTjenestene />
                    <div className="hovedside__informasjonstekst">
                        <img className="hovedside__ikon" src={ikon} alt="informasjonsikon" />
                        Forventet du å se flere tjenester?
                        <Lenke
                            className="hovedside__lenke"
                            href={basename + '/informasjon-om-tilgangsstyring'}
                        >
                            Les mer om hvordan du får tilgang
                        </Lenke>{' '}
                    </div>
                </>
            )}
        </div>
    );
};

export default Hovedside;
