import React, { MouseEventHandler, useEffect, useState } from 'react';
import { Heading, Link, Panel } from '@navikt/ds-react';
import { HeadingMedClipBoardLink } from './helpers/HeadingMedClipBoardLink';
import './PanelerMedInnholdsfortegnelse.css';

export type PanelerMedInnholdsfortegnelseProps = {
    toc: {
        id: string,
        title: string,
        content: JSX.Element,
    }[]
}

/** Problemer som vi burde se på, før dette kan ses på som en "shipable" komponent.
 *
 * - Levels på headings? Styrt av kaller?
 * - useLocation, useHistory, useNavigate?
 * - bruke useRef i stede for document.querySelector ? Nei, for dogmatisk?
 * - css, ikke less
 * - publisere som både cjs, ems. ikke minified, ikke "transpiled" til es5.
 */
export const PanelerMedInnholdsfortegnelse = ({toc} : PanelerMedInnholdsfortegnelseProps) => {
    const [activeAnchor, setActiveAnchor] = useState<string | undefined>(undefined);

    useEffect(() => {
        const scrollListener = () => {
            const distances: [string, number][] = toc.map(elem => {
                const id = `#${elem.id}`
                const rect = document.querySelector(id)?.getBoundingClientRect();
                const distance = Math.abs(rect?.top ?? 10000000);
                return [id, distance];
            });
            distances.sort(([_a, distanceA], [_b, distanceB]) => distanceA - distanceB)
            const nearest = distances[0][0];
            if (nearest !== undefined) {
                setActiveAnchor(nearest);
            }
        };
        /**
         * obs: lytter til wheel og touchmove i stedet for scroll
         * Dette slik at det fungerer på touch og mouse uten å kollidere med
         * Element.scrollIntoView som også trigger en scroll
         */
        const events = ['wheel', 'touchmove'];
        events.forEach(e => window.addEventListener(e, scrollListener));
        return () => events.forEach(e => window.removeEventListener(e, scrollListener));
    }, []);

    useEffect(() => {
        const hash = document.location.hash;
        if (hash.length > 0) {
            setActiveAnchor(hash);
        }
    }, []);

    const setActiveAnchorOnClick = (anchor: string): MouseEventHandler<HTMLAnchorElement> => {
        return (e) => {
            setActiveAnchor(anchor);
            history.pushState(null, '', anchor);
            e.preventDefault();
            e.currentTarget.blur();
        }
    }

    useEffect(() => {
        if (activeAnchor !== undefined) {
            document.querySelector(activeAnchor)?.scrollIntoView({
                behavior: "smooth",
                block: "start",
                inline: "nearest"
            });
        }
    }, [activeAnchor]);

    return (
        <div className='paneler-med-innholdsfortegnelse__container'>
            <Panel as="nav" className='paneler-med-innholdsfortegnelse__sidepanel'>
                <Heading size="small" level='2' className='paneler-med-innholdsfortegnelse-menyhead' spacing>
                    Innhold
                </Heading>
                <ul>
                    {
                        toc.map(({id, title}) => {
                                const anchor = `#${id}`
                                return <li key={anchor}>
                                    <Link
                                        href={anchor}
                                        className={activeAnchor === anchor ? "active" : ""}
                                        onClick={setActiveAnchorOnClick(anchor)}
                                    >{title}
                                    </Link>
                                </li>
                            }
                        )
                    }
                </ul>
            </Panel>

            <div className='paneler-med-innholdsfortegnelse__innhold'>
                { toc.map(({title, id, content}) =>
                    <Panel className='paneler-med-innholdsfortegnelse__tekst' key={id}>
                        <HeadingMedClipBoardLink level='2' id={id} title={title} />
                        {content}
                    </Panel>
                )}
            </div>
        </div>
    )
}

