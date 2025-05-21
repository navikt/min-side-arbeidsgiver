import React, { ChangeEvent, FC, useEffect, useRef, useState } from 'react';
import './Saksoversikt.css';
import { Heading, Label, Pagination, Select } from '@navikt/ds-react';
import { Alerts } from '../Alerts';
import { OmSaker } from './OmSaker';
import { amplitudeFilterKlikk, Saksfilter } from './Saksfilter/Saksfilter';
import * as Record from '../../utils/Record';
import { Sak, SakSortering } from '../../api/graphql-types';
import { LagreFilter } from './LagreFilter';
import { FilterChips } from './FilterChips';
import { Spinner } from '../Banner';
import AdvarselBannerTestversjon from '../Hovedside/AdvarselBannerTestversjon';
import { useSaksoversiktContext } from './SaksoversiktProvider';
import { SakPanel } from './SakPanel';

export const SIDE_SIZE = 30;

export const beregnAntallSider = (totaltAntallSaker: number | undefined) => {
    if (totaltAntallSaker === undefined) {
        return 0;
    }
    return Math.ceil(totaltAntallSaker / SIDE_SIZE);
};

export const Saksoversikt = () => {
    const navRef = useRef<HTMLDivElement>(null); //Brukes til å legge skygge under paginering og filtre

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                navRef.current?.toggleAttribute('data-stuck', entry.intersectionRatio < 1);
            },
            { threshold: [1] }
        );

        if (navRef.current) {
            observer.observe(navRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <div className="saksoversikt__innhold">
            <Saksfilter />
            <div className="saksoversikt">
                <AdvarselBannerTestversjon />
                <Alerts />
                <Heading level="2" size="medium" className="saksoversikt__skjult-header-uu">
                    Mine filtervalg
                </Heading>
                <div ref={navRef} className="saksoversikt_sticky_top">
                    <LagreFilter />
                    <FilterChips />
                    <div className="saksoversikt__saksliste-header">
                        <VelgSortering />
                        <Sidevelger skjulForMobil={true} />
                    </div>
                </div>
                <Heading level="2" size="medium" className="saksoversikt__skjult-header-uu">
                    Saker
                </Heading>
                <SaksListeBody />
                <Sidevelger skjulForMobil={true} />
                <HvaVisesHer />
            </div>
        </div>
    );
};

const HvaVisesHer = () => {
    const hjelpetekstButton = useRef<HTMLButtonElement>(null);
    return (
        <div className="saksoversikt__hjelpetekst">
            <OmSaker id="hjelptekst" ref={hjelpetekstButton} />
            <button
                className={'saksoversikt__knapp'}
                onClick={(e) => {
                    e.stopPropagation();
                    e.preventDefault();
                    hjelpetekstButton.current?.focus();
                    hjelpetekstButton.current?.click();
                }}
            >
                {' '}
                Hva vises her?
            </button>
        </div>
    );
};

const VelgSortering: FC = () => {
    const {
        saksoversiktState: { filter, totaltAntallSaker },
        transitions: { setSortering },
    } = useSaksoversiktContext();

    const sider = beregnAntallSider(totaltAntallSaker);

    if (sider === undefined || sider === 0) {
        return null;
    }
    const handleOnChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const sortering = e.target.value as SakSortering;
        setSortering(sortering);
        amplitudeFilterKlikk('sortering', sortering, null);
    };

    return (
        <Select
            autoComplete="off"
            value={filter.sortering}
            className="saksoversikt__sortering"
            label={`${totaltAntallSaker} saker sortert på`}
            onChange={handleOnChange}
        >
            {sorteringsrekkefølge.map((key) => (
                <option key={key} value={key}>
                    {sorteringsnavn[key]}
                </option>
            ))}
        </Select>
    );
};

const useCurrentDate = (pollInterval: number) => {
    const [currentDate, setCurrentDate] = useState(() => new Date());
    useEffect(() => {
        /* We are unsure if the `mounted`-check is really necessary. */
        let mounted = true;
        const timer = setInterval(() => {
            if (mounted) {
                setCurrentDate(new Date());
            }
        }, pollInterval);
        return () => {
            mounted = false;
            clearInterval(timer);
        };
    }, [pollInterval]);
    return currentDate;
};

const sorteringsnavn: Record<SakSortering, string> = {
    NYESTE: 'Nyeste først',
    ELDSTE: 'Eldste først',
};

const sorteringsrekkefølge: SakSortering[] = [SakSortering.NyesteFørst, SakSortering.EldsteFørst];

type SidevelgerProp = {
    skjulForMobil: boolean;
};

const Sidevelger: FC<SidevelgerProp> = ({ skjulForMobil = false }) => {
    const [width, setWidth] = useState(window.innerWidth);

    const {
        saksoversiktState: { totaltAntallSaker, filter },
        transitions: { setSide },
    } = useSaksoversiktContext();

    useEffect(() => {
        const setSize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', setSize);
        return () => window.removeEventListener('resize', setSize);
    }, [setWidth]);

    const antallSider = beregnAntallSider(totaltAntallSaker);

    if (antallSider < 2) {
        return null;
    }

    return (
        <Pagination
            count={beregnAntallSider(totaltAntallSaker)}
            page={filter.side}
            className={`saksoversikt__paginering ${
                skjulForMobil ? 'saksoversikt__skjul-for-mobil' : ''
            }`}
            siblingCount={width < 920 ? 0 : 1}
            boundaryCount={width < 800 ? 0 : 1}
            onPageChange={setSide}
        />
    );
};

const SaksListeBody: FC = () => {
    const { saksoversiktState } = useSaksoversiktContext();

    if (saksoversiktState.state === 'error') {
        return (
            <Label aria-live="polite" aria-atomic="true">
                Feil ved lasting av saker.
            </Label>
        );
    }

    if (saksoversiktState.state === 'loading') {
        return (
            <SakslisteLaster
                startTid={saksoversiktState.startTid}
                forrigeSaker={saksoversiktState.forrigeSaker ?? undefined}
            />
        );
    }

    const { totaltAntallSaker, saker, filter } = saksoversiktState;

    if (totaltAntallSaker === 0) {
        return (
            <Label aria-live="polite" aria-atomic="true">
                Ingen treff.
            </Label>
        );
    }
    const paginerteSaker = saker.slice((filter.side - 1) * SIDE_SIZE, filter.side * SIDE_SIZE);
    return <SaksListe saker={paginerteSaker} />;
};

type LasterProps = {
    forrigeSaker?: Array<Sak>;
    startTid: Date;
};

const SakslisteLaster: FC<LasterProps> = ({ forrigeSaker, startTid }) => {
    const nåtid = useCurrentDate(50);
    const lasteTid = nåtid.getTime() - startTid.getTime();

    if (lasteTid < 200 && forrigeSaker !== undefined) {
        return <SaksListe saker={forrigeSaker} />;
    } else if (lasteTid < 3000 && forrigeSaker !== undefined) {
        return <SaksListe saker={forrigeSaker} placeholder={true} />;
    } else {
        return <Spinner />;
    }
};

type Props = {
    saker: Array<Sak>;
    placeholder?: boolean;
};

const SaksListe = ({ saker, placeholder }: Props) => {
    return (
        <ul className="saks-liste">
            {saker.map((sak, _) => (
                <li key={sak.id}>
                    <SakPanel sak={sak} placeholder={placeholder} />
                </li>
            ))}
        </ul>
    );
};
