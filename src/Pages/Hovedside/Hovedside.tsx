import React, { FunctionComponent, useEffect } from 'react';
import AdvarselBannerTestversjon from './AdvarselBannerTestversjon';
import { Alerts } from '../Alerts';
import Tjenestebokser from './Tjenestebokser/Tjenestebokser';
import NyttigForDegContainer from './NyttigForDegContainer/NyttigForDegContainer';
import { SøknaderOgSkjemaer } from './SøknaderOgSkjemaer';
import BeOmTilgang from './BeOmTilgang/BeOmTilgang';
import './Hovedside.css';
import { TrengerDuHjelp } from './TrengerDuHjelp';
import { AktueltRubrikk } from './AktueltRubrikk';
import { Lenke } from '../../GeneriskeElementer/Lenke';
import { infoOmTilgangsstyringURL } from '../../lenker';
import { ManglerKofuviAlert } from './ManglerKofuviAlert';
import { InfoBokser } from './InfoBokser';
import { Kalenderavtaler } from './Kalenderavtaler';
import { ManglerKontonummerAlert } from './ManglerKontonummerAlert';
import NotifikasjonPanel from './NotifikasjonPanel/NotifikasjonPanel';
import { setBreadcrumbs } from '@navikt/nav-dekoratoren-moduler';

const Hovedside: FunctionComponent = () => {
    useEffect(() => {
        setBreadcrumbs([]); // Fjerner breadcrumbs på hovedsiden
    }, []);

    return (
        <div>
            <div className="hovedside-container">
                <AdvarselBannerTestversjon />
                <Alerts />
                <ManglerKofuviAlert />
                <ManglerKontonummerAlert />
                <InfoBokser />
                <AktueltRubrikk />
                <NotifikasjonPanel />
                <Kalenderavtaler />
                <Tjenestebokser />
                <SøknaderOgSkjemaer />
                <NyttigForDegContainer />
                <BeOmTilgang />
                <div>
                    {' '}
                    {/*Legger inn en ekstra div for at linken ikke skal strekkes ut av flex*/}
                    <Lenke
                        href={infoOmTilgangsstyringURL}
                    >
                        Lær mer om tilganger og varsler i Altinn
                    </Lenke>
                </div>
            </div>
            <TrengerDuHjelp />
        </div>
    );
};

export default Hovedside;
