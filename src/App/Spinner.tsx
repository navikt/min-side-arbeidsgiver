import React from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import Brodsmulesti from './Brodsmulesti/Brodsmulesti';
import Banner from './HovedBanner/HovedBanner';

export const Spinner = () =>
    <div className="app-laster-spinner">
        <NavFrontendSpinner type="XL"/>
    </div>

export const SpinnerMedBanner = () => {
    return (
        <>
            <Brodsmulesti brodsmuler={[]} />
            {/*<Banner sidetittel="Min side – arbeidsgiver"/>*/}
            <Spinner />
        </>
    );
}