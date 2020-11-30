import React from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import Brodsmulesti from './Brodsmulesti/Brodsmulesti';
import Banner from './HovedBanner/HovedBanner';

const Spinner = () => {
    return (
        <>
            <Brodsmulesti brodsmuler={[]} />
            <Banner sidetittel="Min side – arbeidsgiver"/>
            <div className="app-laster-spinner">
                <NavFrontendSpinner type="XL"/>
            </div>
        </>
    );
};

export default Spinner;