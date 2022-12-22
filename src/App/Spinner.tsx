import React from 'react';
import Brodsmulesti from './Brodsmulesti/Brodsmulesti';
import Banner from './HovedBanner/HovedBanner';
import { Loader } from '@navikt/ds-react';

export const Spinner = () =>
    <div className="app-laster-spinner">
        <Loader size="3xlarge"/>
    </div>

export const SpinnerMedBanner = () => {
    return (
        <>
            <Brodsmulesti brodsmuler={[]} />
            <Banner sidetittel="Min side – arbeidsgiver" endreOrganisasjon={() => {}} />
            <Spinner />
        </>
    );
}