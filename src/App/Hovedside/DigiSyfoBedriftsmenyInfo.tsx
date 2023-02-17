import React, {FunctionComponent, useEffect} from 'react';

export const DigiSyfoBedriftsmenyInfo: FunctionComponent = () => {
    useEffect(() => {
        window.localStorage.removeItem('DigiSyfoBedriftsmenyInfoLukket');
    }, []);

    return null;
};
