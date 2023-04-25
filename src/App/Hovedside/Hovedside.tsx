import React, {FunctionComponent, useContext, useEffect} from 'react';
import {OrganisasjonerOgTilgangerContext} from '../OrganisasjonerOgTilgangerProvider';
import Brodsmulesti from '../Brodsmulesti/Brodsmulesti';
import AdvarselBannerTestversjon from './AdvarselBannerTestVersjon/AdvarselBannerTestversjon';
import {VarselHvisNedetid} from '../LoggInn/VarselOmNedetid/VarselHvisNedetid';
import {Alerts} from '../Alerts/Alerts';
import TjenesteBoksContainer from './TjenesteBoksContainer/TjenesteBoksContainer';
import NyttigForDegContainer from './NyttigForDegContainer/NyttigForDegContainer';
import {SkjemaveilederContainer} from './SkjemaveilederContainer/SkjemaveilederContainer';
import BeOmTilgang from './BeOmTilgang/BeOmTilgang';
import BrevFraAltinnContainer from './AltinnMeldingsboks/BrevFraAltinnContainer';
import './Hovedside.css';
import {GiOssTilbakemelding} from './GiOssTilbakemeldingComponent/GiOssTilbakemelding';
import SisteSaker from "./Sak/SisteSaker/SisteSaker";
import {UndersokelseInntektsmelding} from './UndersokelseInntektsmelding/UndersokelseInntektsmelding';
import {KontaktFelt} from "./KontaktFelt/KontaktFelt"
import {useOversiktsfilterClearing} from './Sak/Saksoversikt/useOversiktSessionStorage';
import {DigiSyfoBedriftsmenyInfo} from "./DigiSyfoBedriftsmenyInfo";
import {useNavigate} from "react-router-dom";
import {AktueltRubrikk} from "./Aktuelt/AktueltRubrikk";
import { LenkeMedLogging } from '../../GeneriskeElementer/LenkeMedLogging';
import { infoOmTilgangsstyringURL } from '../../lenker';
import { ForebyggeFraværInfoBoks } from './ForebyggeFraværInfoBoks';


const Hovedside: FunctionComponent = () => {
    const {organisasjoner, visFeilmelding, tilgangTilSyfo, visSyfoFeilmelding, harTilganger} = useContext(
        OrganisasjonerOgTilgangerContext,
    );
    const navigate = useNavigate()
    useEffect(() => {

        const skalViseManglerTilgangBoks =
            !harTilganger &&
            !visFeilmelding &&
            !visSyfoFeilmelding;

        if (skalViseManglerTilgangBoks) {
            navigate({pathname: 'mangler-tilgang'}, {replace: true})
        }
    }, [organisasjoner, tilgangTilSyfo, visFeilmelding, visSyfoFeilmelding, harTilganger]);

    useOversiktsfilterClearing()

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    return (
        <div>
            <Brodsmulesti brodsmuler={[]}/>
            <div className='hovedside-container'>
                <AdvarselBannerTestversjon/>
                <VarselHvisNedetid/>
                <UndersokelseInntektsmelding/>
                <Alerts/>
                <DigiSyfoBedriftsmenyInfo/>
                <ForebyggeFraværInfoBoks/>
                <AktueltRubrikk/>
                <SisteSaker/>
                <TjenesteBoksContainer/>
                <GiOssTilbakemelding/>
                <SkjemaveilederContainer/>
                <BrevFraAltinnContainer/>
                <NyttigForDegContainer/>
                <BeOmTilgang/>
                <div> {/*Legger inn en ekstra div for at linken ikke skal strekkes ut av flex*/}
                    <LenkeMedLogging href={infoOmTilgangsstyringURL}
                                    loggLenketekst='Lær om tilganger og varsler i Altinn'>
                        Lær om tilganger og varsler i Altinn
                    </LenkeMedLogging>
                </div>
            </div>
            <KontaktFelt/>
        </div>
    );
};

export default Hovedside;
