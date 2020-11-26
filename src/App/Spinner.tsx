import React from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import Brodsmulesti from './Brodsmulesti/Brodsmulesti';
import Banner from './HovedBanner/HovedBanner';

const Spinner = () => {
    return (
        <div className="bakgrunnsside">
            <Brodsmulesti brodsmuler={[]} />
            <Banner sidetittel="Min side – arbeidsgiver" />
            <div className="app__laster-spinner">
                <NavFrontendSpinner  type="XL"/>
            </div>
        </div>
    );
};

export default Spinner;