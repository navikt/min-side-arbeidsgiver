import React, { FunctionComponent, useContext } from 'react';
import AlertStripe from 'nav-frontend-alertstriper';
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
import { loggTjenesteTrykketPa } from '../../utils/funksjonerForAmplitudeLogging';
import ikon from './infomation-circle-2.svg';
import './Hovedside.less';

const Hovedside: FunctionComponent = () => {
    const { organisasjoner, visFeilmelding } = useContext(OrganisasjonsListeContext);
    const { tilgangTilSyfoState, visSyfoFeilmelding } = useContext(SyfoTilgangContext);

    const skalViseManglerTilgangBoks = !(
        organisasjoner.length > 0 || tilgangTilSyfoState === Tilgang.TILGANG
    );

    const loggPermitteringsinfo = (lenkebeskrivelse: string) => {
        loggTjenesteTrykketPa(lenkebeskrivelse);
    };

    return (
        <div className="hovedside">
            <FeilmeldingContainer
                visFeilmelding={visFeilmelding}
                visSyfoFeilmelding={visSyfoFeilmelding}
            />
            <div className="hovedside__corona-info-container">
                <AlertStripe type="info">
                    <b>Permitteringer som følge av koronaviruset</b>
                    <p>
                        {'Les mer om hva som gjelder ved '}
                        <Lenke
                            href={
                                'https://www.nav.no/no/bedrift/innhold-til-bedrift-forside/nyheter/permitteringer-som-folge-av-koronaviruset'
                            }
                            onClick={() => loggPermitteringsinfo('info om permitering')}
                        >
                            permitteringer som følge av koronaviruset
                        </Lenke>
                        {', send skjema '}
                        <Lenke
                            href={
                                'https://www.nav.no/soknader/nb/bedrift/permitteringer-oppsigelser-og-konkurs/masseoppsigelser'
                            }
                            onClick={() =>
                                loggPermitteringsinfo(
                                    'skjemaer for permitteringer, oppsigelser og konkurs'
                                )
                            }
                        >
                            Arbeidsgivers meldeplikt til NAV ved masseoppsigelser, permitteringer uten lønn og innskrenking i arbeidstiden
                        </Lenke>
                        , eller {' '}
                        <Lenke
                            href="https://www.nav.no/person/kontakt-oss/chat/arbeidsgiver"
                            onClick={() =>
                                loggPermitteringsinfo(
                                    'chat med NAV om permittering.'
                                )
                            }
                        >
                            chat med NAV om permittering
                        </Lenke>
                    </p>
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
