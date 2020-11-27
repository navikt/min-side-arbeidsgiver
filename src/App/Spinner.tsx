import React from 'react';
import NavFrontendSpinner from 'nav-frontend-spinner';
import Brodsmulesti from './Brodsmulesti/Brodsmulesti';
import Banner from './HovedBanner/HovedBanner';
import LoggInnBanner from './LoggInn/LoggInnBanner/LoggInnBanner';

export enum Bannertype {
    LOGGINN = 'Logginn',
    ORDINÆR = 'Ordinær'
}

interface Props {
    bannertype?: Bannertype;
}

const Spinner = (props: Props) => {
    return (
        <div className="bakgrunnsside">
            <Brodsmulesti brodsmuler={[]} />
            { props.bannertype === Bannertype.LOGGINN
                ? <LoggInnBanner />
                : <Banner sidetittel="Min side – arbeidsgiver"/>
            }
            <div className="app__laster-spinner">
                <NavFrontendSpinner type="XL"/>
            </div>
        </div>
    );
};

export default Spinner;