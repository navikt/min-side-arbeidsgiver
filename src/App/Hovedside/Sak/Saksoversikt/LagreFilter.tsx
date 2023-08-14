import {equalFilter, Filter, State} from './useOversiktStateTransitions';
import React, {useEffect, useRef, useState} from 'react';
import {Alert, Button, Chips, Dropdown, ErrorSummary, TextField} from '@navikt/ds-react';
import {StarIcon} from '@navikt/aksel-icons';
import {ModalMedKnapper} from '../../../../GeneriskeElementer/ModalMedKnapper';
import {useRemoteStorage} from '../../../hooks/useRemoteStorage';
import {Set} from 'immutable';
import {v4 as uuidv4} from 'uuid';

export type LagretFilter = {
    uuid: string,
    navn: string,
    filter: Filter
}

function mapStatus(status: "initializing" | "loading" | "error" | "loaded" | "updated" | "deleted" | "conflict") {
    let mapped: 'initializing' | 'loading' | 'completed' | 'failed' = 'initializing';
    if (['loading', 'conflict'].includes(status)) {
        mapped = 'loading';
    }
    if (['loaded', 'updated', 'deleted'].includes(status)) {
        mapped = 'completed';
    }
    if ('error' === status) {
        mapped = 'failed';
    }
    return mapped;
}
const useLagredeFilter = () : {
    lagredeFilter: LagretFilter[];
    lagreNyttLagretFilter: (navn: string, filter: Filter) => LagretFilter;
    slettLagretFilter: (uuid: string) => void;
    oppdaterLagretFilter: (uuid: string, filter: Filter) => void;
    status: 'initializing' | 'loading' | 'completed' | 'failed';
} => {
    const {
        storedValue,
        setValue,
        status,
        storageItemConflict,
    } = useRemoteStorage<LagretFilter[]>(
        'lagrede-filter',
        [],
        value => value.map((filter: any) => ({
            ...filter,
            filter: {
                ...filter.filter,
                virksomheter: Set(filter.filter.virksomheter),
            },
        })),
    );
    const [action, setAction] = useState<{
        action: 'lagre' | 'slett' | 'oppdater',
        lagretFilter: LagretFilter,
    } | undefined>();

    // handle conflict
    useEffect(() => {
        if (storageItemConflict && action !== undefined) {
            const existingFilter = storageItemConflict.currentStorageItem.data.find((filter) => filter.uuid === action.lagretFilter.uuid);
            if (existingFilter !== undefined) {
                setValue(
                    storageItemConflict.currentStorageItem.data.map((filter) => filter.uuid === action.lagretFilter.uuid ? action.lagretFilter : filter),
                    storageItemConflict.currentStorageItem.version
                );
            } else {
                setValue(
                    [...storageItemConflict.currentStorageItem.data, action.lagretFilter],
                    storageItemConflict.currentStorageItem.version
                );
            }
        }
    }, [storageItemConflict, action]);

    // update store value / API call
    useEffect(() => {
        if (action) {
            const lagredeFilter = storedValue ?? [];
            if (action.action === 'lagre') {
                setValue([...lagredeFilter, action.lagretFilter!]);
            }
            if (action.action === 'slett') {
                setValue(lagredeFilter.filter((lagretFilter: any) => lagretFilter.uuid !== action.lagretFilter.uuid));
            }
            if (action.action === 'oppdater') {
                setValue(lagredeFilter.map((lagretFilter: any) => lagretFilter.uuid === action.lagretFilter.uuid ? action.lagretFilter : lagretFilter));
            }
        }
    }, [action]);

    useEffect(() => {
        setAction(undefined);
    }, [storedValue]);

    const lagredeFilter = storedValue ?? [];
    const lagreNyttLagretFilter = (navn: string, filter: Filter) => {
        const uuid = uuidv4();
        const nyttLagretFilter = {
            uuid,
            navn,
            filter: {
                ...filter,
                valgtFilterId: uuid, // TODO: id burde ikke være en del av filteret
            }
        };
        setAction({ action: 'lagre', lagretFilter: nyttLagretFilter });
        return nyttLagretFilter;
    };

    const slettLagretFilter = (uuid: string) => {
        const lagretFilter = lagredeFilter.find((f) => f.uuid === uuid);
        if (lagretFilter) {
            setAction({ action: 'slett', lagretFilter });
        }
    };

    const oppdaterLagretFilter = (uuid: string, filter: Filter) => {
        const lagretFilter = lagredeFilter.find((f) => f.uuid === uuid);
        if (lagretFilter) {
            setAction({action: 'oppdater', lagretFilter: {...lagretFilter, filter}});
        }
    };

    return {
        status: mapStatus(status),
        lagredeFilter,
        lagreNyttLagretFilter,
        slettLagretFilter,
        oppdaterLagretFilter,
    }
}

type LagreFilterProps = {
    state: State,
    byttFilter: (filter: Filter) => void
    setValgtFilterId: (id: string | undefined) => void
}

export const LagreFilter = ({ state, byttFilter, setValgtFilterId }: LagreFilterProps) => {

    const [openEndre, setOpenEndre] = useState(false);
    const [openSlett, setOpenSlett] = useState(false);
    const [openLagre, setOpenLagre] = useState(false);
    const [feilmeldingStatus, setFeilmeldingStatus] = useState<'noInput' | 'duplicate' | 'ok'>('ok');
    const feilmeldingRef = React.useRef<HTMLDivElement>(null);
    const handleFocus = () => feilmeldingRef.current?.focus();

    const lagreNavnInputRef = useRef<HTMLInputElement>(null);
    const {
        status: lagreStatus,
        lagredeFilter,
        lagreNyttLagretFilter,
        slettLagretFilter,
        oppdaterLagretFilter
    } = useLagredeFilter(); // TODO: hadde vært fint å refreshe fra store når valgtFilterId endres

    useEffect(() => {
        setFeilmeldingStatus('ok');
    }, [openLagre]);

    if (lagreStatus === 'initializing') {
        return null;
    }

    const valgtFilter = lagredeFilter.find(lagretFilter => lagretFilter.uuid === state.valgtFilterId);
    return <>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {valgtFilter ? <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Chips.Removable
                        className='Saksoversikt-Filter-pill'
                        variant='neutral'
                        onClick={() => {
                            setValgtFilterId(undefined)
                        }}
                    >{valgtFilter.navn}</Chips.Removable>
                    {!equalFilter(valgtFilter.filter, state.filter) ? <Button
                        variant='tertiary'
                        onClick={() => setOpenEndre(true)}
                    >
                        Lagre endringer
                    </Button> : null}
                    <Button
                        variant='tertiary'
                        onClick={() => {
                            setOpenSlett(true);
                        }}
                    >
                        Slett
                    </Button>
                </div>
                : null
            }
        </div>
        <Dropdown>
            <Button variant='secondary' as={Dropdown.Toggle} icon={<StarIcon />}>
                Lagrede filter
            </Button>
            <Dropdown.Menu>
                {lagredeFilter.length > 0 ? <><Dropdown.Menu.List>
                    {
                        lagredeFilter.map(lagretFilter =>
                            <Dropdown.Menu.List.Item
                                key={lagretFilter.uuid}
                                onClick={() => {
                                    setValgtFilterId(lagretFilter.uuid);
                                    byttFilter({ ...lagretFilter.filter });
                                }}>
                                {lagretFilter.navn}
                            </Dropdown.Menu.List.Item>,
                        )
                    }
                </Dropdown.Menu.List>
                    <Dropdown.Menu.Divider /></> : null}
                <Dropdown.Menu.List>
                    <Dropdown.Menu.List.Item
                        onClick={() => {
                            setOpenLagre(true);
                        }}>
                        Lagre som nytt filter
                    </Dropdown.Menu.List.Item>
                </Dropdown.Menu.List>
            </Dropdown.Menu>
        </Dropdown>
        <ModalMedKnapper
            overskrift={'Lagre som nytt filter'}
            bekreft={'Lagre'}
            open={openLagre}
            setOpen={setOpenLagre}
            onSubmit={() => {
                const filternavn = lagreNavnInputRef.current?.value?.trim() ?? '';
                if (filternavn !== '' && lagredeFilter.filter(filter => filter.navn === filternavn).length === 0) {
                    const nyopprettetfilter = lagreNyttLagretFilter(filternavn, state.filter);
                    byttFilter({ ...state.filter })
                    setValgtFilterId(nyopprettetfilter.uuid);
                    setOpenLagre(false);
                } else {
                    if (filternavn === '') {
                        setFeilmeldingStatus('noInput');
                    } else {
                        setFeilmeldingStatus('duplicate');
                    }
                    handleFocus();
                }
            }}
        >
            {
                feilmeldingStatus === 'noInput' ?
                    <ErrorSummary ref={feilmeldingRef} heading='Filter må ha et navn'>
                        <ErrorSummary.Item href='#inputfeltFilternavn'>Fyll inn et navn i
                            tekstfeltet</ErrorSummary.Item>
                    </ErrorSummary> :
                    feilmeldingStatus === 'duplicate' ?
                        <ErrorSummary ref={feilmeldingRef} heading='Filter må ha et unikt navn'>
                            <ErrorSummary.Item href='#inputfeltFilternavn'>Det finnes allerede et lagret filter med
                                dette navnet.</ErrorSummary.Item>
                        </ErrorSummary>
                        : null
            }
            <TextField
                id='inputfeltFilternavn'
                label='Navn'
                description='Navnet vises i din liste over lagrede filter'
                ref={lagreNavnInputRef}
            />
        </ModalMedKnapper>
        {
            valgtFilter === undefined ? null :
                <>
                    <ModalMedKnapper
                        overskrift={`Slett «${valgtFilter.navn}»`}
                        bekreft={'Slett'}
                        open={openSlett}
                        bekreftVariant='danger'
                        setOpen={setOpenSlett}
                        onSubmit={() => {
                            slettLagretFilter(valgtFilter.uuid)
                            setValgtFilterId(undefined);
                            setOpenSlett(false);
                        }}
                    >
                        Er du sikker på at du vil slette «{valgtFilter.navn}»?
                    </ModalMedKnapper>
                    <ModalMedKnapper
                        overskrift={`Endre «${valgtFilter.navn}»`}
                        bekreft={'Lagre'}
                        open={openEndre}
                        setOpen={setOpenEndre}
                        onSubmit={() => {
                            oppdaterLagretFilter(valgtFilter.uuid, state.filter);
                            setOpenEndre(false);
                        }}
                    >
                        Er du sikker på at du vil lagre endringene i «{valgtFilter.navn}»?
                    </ModalMedKnapper>
                </>
        }
        {lagreStatus === 'failed'
            ? <Alert variant='error' size='small'>
                Noe gikk galt og vi kunne dessverre ikke lagre filtret. Prøv igjen senere.
            </Alert>
            : null
        }
    </>
};