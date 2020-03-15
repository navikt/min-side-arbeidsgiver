import React, { FunctionComponent, useContext } from 'react';

import './Hovedside.less';
import TjenesteBoksContainer from './TjenesteBoksContainer/TjenesteBoksContainer';
import NyttigForDegContainer from './NyttigForDegContainer/NyttigForDegContainer';
import { AltinnContainer } from './AltinnContainer/AltinnContainer';

import { OrganisasjonsListeContext } from '../../OrganisasjonsListeProvider';
import { basename } from '../../paths';
import Lenke from 'nav-frontend-lenker';
import ikon from './infomation-circle-2.svg';
import { SkjemaveilederContainer } from './SkjemaveilederContainer/SkjemaveilederContainer';
import { SyfoTilgangContext } from '../../SyfoTilgangProvider';
import { Tilgang } from '../LoginBoundary';
import { ManglerTilgangContainer } from './ManglerTilgangContainer/ManglerTilgangContainer';
import { FeilmeldingContainer } from './FeilmeldingContainer/FeilmeldingContainer';
import IkkeTilgangTilDisseTjenestene from './IkkeTilgangTilDisseTjenestene/IkkeTilgangTilDisseTjenestene';
import AlertStripe from "nav-frontend-alertstriper";
import {loggTjenesteTrykketPa} from "../../utils/funksjonerForAmplitudeLogging";

const Hovedside: FunctionComponent = () => {
    const { organisasjoner, visFeilmelding } = useContext(OrganisasjonsListeContext);
    const { tilgangTilSyfoState, visSyfoFeilmelding } = useContext(SyfoTilgangContext);
    const skalViseManglerTilgangBoks = !(
        organisasjoner.length > 0 || tilgangTilSyfoState === Tilgang.TILGANG
    );
    const loggPermitteringsinfo = (lenkebeskrivelse:string) => {
        loggTjenesteTrykketPa(lenkebeskrivelse);
    };

    loggTjenesteTrykketPa

    return (
        <div className="hovedside">
            <FeilmeldingContainer
                visFeilmelding={visFeilmelding}
                visSyfoFeilmelding={visSyfoFeilmelding}
            />
            <div className={"hovedside__corona-info-container" }>
                <AlertStripe type={'info'}>
                    <b>Permitteringer som følge av koronaviruset</b>
                    <p>Les mer om hva som gjelder ved &nbsp;
                        <a onClick={() => loggPermitteringsinfo('info om permitering')} href={"https://www.nav.no/no/bedrift/innhold-til-bedrift-forside/nyheter/permitteringer-som-folge-av-koronaviruset"}>permitteringer som følge av koronaviruset </a>
                        og finn <a onClick={() => loggPermitteringsinfo('skjemaer for permitteringer, oppsigelser og konkurs')} href={"https://www.nav.no/soknader/nb/bedrift/permitteringer-oppsigelser-og-konkurs"}> skjemaer for permitteringer, oppsigelser og konkurs. </a></p>
                </AlertStripe>
            </div>

            {skalViseManglerTilgangBoks && <ManglerTilgangContainer />}
            {!skalViseManglerTilgangBoks && (
                <>
                    <TjenesteBoksContainer />
                    <NyttigForDegContainer />
                    <AltinnContainer />
                    <SkjemaveilederContainer />
                    <IkkeTilgangTilDisseTjenestene />
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
                </>
            )}
        </div>
    );
};

export default Hovedside;
