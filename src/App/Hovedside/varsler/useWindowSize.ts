import { useEffect, useState } from 'react';

export type Size = {
    width: number;
    height: number;
    dropdown: {
        outerheight: number;
        innerheight: number;
    };
};

export const useWindowSize = () => {
    const [windowSize, setWindowSize] = useState<Size>({
        width: 0,
        height: 0,
        dropdown: { outerheight: 0, innerheight: 0 },
    });

    const finnDropdownHoyde = (
        windowwidth: number,
        windowheight: number
    ): { outerheight: number; innerheight: number } => {
        const decorator = document.querySelector('#decorator-header');
        const bedriftsmeny = document.querySelector('.bedriftsmeny');
        const varsler = document.querySelector('.varsler');

        let decoratorHeight: number;
        if (decorator) {
            decoratorHeight = decorator.getBoundingClientRect().height;
        } else {
            decoratorHeight = 30; // localhost, ingen dekoratør. Kun hvit linje på toppen
        }

        let bedriftsmenyHeight = 0;
        if (bedriftsmeny) {
            bedriftsmenyHeight = bedriftsmeny.getBoundingClientRect().height;
        }

        let varslerHeight = 0;
        if (varsler) {
            varslerHeight = varsler.getBoundingClientRect().height;
        }

        let dropdownOuterHoyde: number;
        let dropdownInnerHoyde: number;
        if (windowwidth > 0 && windowwidth < 1200) {
            dropdownOuterHoyde =
                windowheight - decoratorHeight - bedriftsmenyHeight - varslerHeight;
        } else {
            // desktop > 1200px
            dropdownOuterHoyde = windowheight - decoratorHeight - bedriftsmenyHeight + 22;
        }
        dropdownInnerHoyde = dropdownOuterHoyde - 62;
        return { outerheight: dropdownOuterHoyde, innerheight: dropdownInnerHoyde };
    };

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight,
                dropdown: finnDropdownHoyde(window.innerWidth, window.innerHeight),
            });
        }
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return windowSize;
};
