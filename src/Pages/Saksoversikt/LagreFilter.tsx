import React, { useEffect, useRef, useState } from 'react';
import {
    Alert,
    Button,
    Chips,
    Dropdown,
    ErrorSummary,
    Heading,
    Modal,
    TextField,
} from '@navikt/ds-react';
import { StarIcon } from '@navikt/aksel-icons';
import { ModalMedÅpneknapp } from '../../GeneriskeElementer/ModalMedKnapper';
import { useRemoteStorage } from '../../hooks/useRemoteStorage';
import { Set } from 'immutable';
import { v4 as uuidv4 } from 'uuid';
import { useLoggKlikk } from '../../utils/analytics';
import './LagreFilter.css';
import { equalFilter, Filter, useSaksoversiktContext } from './SaksoversiktProvider';
import { OppgaveFilterType, OppgaveTilstand, SakSortering } from '../../api/graphql-types';

export type LagretFilter = {
    uuid: string;
    navn: string;
    filter: Filter;
};

const statusMapping = {
    initializing: 'initializing',

    loading: 'loading',
    conflict: 'loading',

    loaded: 'completed',
    updated: 'completed',
    deleted: 'completed',

    error: 'failed',
} as const;

function fiksSortering(filter: any): SakSortering {
    if (filter in SakSortering) {
        return filter;
    }
    return SakSortering.NyesteFørst;
}

export const mapOppgaveTilstandTilFilterType = (tilstand: string): OppgaveFilterType | null => {
    console.log(tilstand)
    switch (tilstand) {
        case OppgaveTilstand.Ny:
            return OppgaveFilterType.Values.TILSTAND_NY;
        case OppgaveTilstand.Utfoert:
            return OppgaveFilterType.Values.TILSTAND_UTFOERT;
        case OppgaveTilstand.Utgaatt:
            return OppgaveFilterType.Values.TILSTAND_UTGAATT;
        default:
            return null
    }
}

function fiksOppgaveFilter(filter: any) : string[] {
    if (filter.oppgaveFilter !== undefined) {
        return filter.oppgaveFilter;
    }

    return filter.oppgaveTilstand.map((ot: string) => mapOppgaveTilstandTilFilterType(ot)) ?? [];
}

export const useLagredeFilter = (): {
    lagredeFilter: LagretFilter[];
    lagreNyttLagretFilter: (navn: string, filter: Filter) => LagretFilter;
    slettLagretFilter: (uuid: string) => void;
    oppdaterLagretFilter: (uuid: string, filter: Filter) => void;
    reloadLagredeFilter: () => void;
    status: 'initializing' | 'loading' | 'completed' | 'failed';
} => {
    const { storedValue, setValue, reload, status, storageItemConflict } = useRemoteStorage<
        LagretFilter[]
    >('lagrede-filter', [], (value) =>
        value.map((filter: any) => ({
            ...filter,
            filter: {
                ...filter.filter,
                virksomheter: Set(filter.filter.virksomheter),
                sortering: fiksSortering(filter.filter.sortering),
                oppgaveFilter: fiksOppgaveFilter(filter.filter),
            },
        }))
    );
    const [action, setAction] = useState<
        | {
              type: 'lagre' | 'slett' | 'oppdater';
              lagretFilter: LagretFilter;
          }
        | undefined
    >();

    const lagredeFilter = storedValue ?? [];

    // handle conflict
    useEffect(() => {
        if (storageItemConflict && action !== undefined) {
            if (action.type === 'slett') {
                setValue(
                    storageItemConflict.currentStorageItem.data.filter(
                        (filter: any) => filter.uuid !== action.lagretFilter.uuid
                    ),
                    storageItemConflict.currentStorageItem.version
                );
            } else if (action.type === 'lagre') {
                setValue(
                    [...storageItemConflict.currentStorageItem.data, action.lagretFilter],
                    storageItemConflict.currentStorageItem.version
                );
            } else if (action.type === 'oppdater') {
                const existingFilter = storageItemConflict.currentStorageItem.data.find(
                    (filter) => filter.uuid === action.lagretFilter.uuid
                );
                if (existingFilter !== undefined) {
                    setValue(
                        storageItemConflict.currentStorageItem.data.map((filter) =>
                            filter.uuid === action.lagretFilter.uuid ? action.lagretFilter : filter
                        ),
                        storageItemConflict.currentStorageItem.version
                    );
                } else {
                    setValue(
                        [...storageItemConflict.currentStorageItem.data, action.lagretFilter],
                        storageItemConflict.currentStorageItem.version
                    );
                }
            }
        }
    }, [storageItemConflict, action]);

    // update store value / API call
    useEffect(() => {
        if (action) {
            if (action.type === 'lagre') {
                setValue([...lagredeFilter, action.lagretFilter!]);
            }
            if (action.type === 'slett') {
                setValue(
                    lagredeFilter.filter(
                        (lagretFilter: any) => lagretFilter.uuid !== action.lagretFilter.uuid
                    )
                );
            }
            if (action.type === 'oppdater') {
                setValue(
                    lagredeFilter.map((lagretFilter: any) =>
                        lagretFilter.uuid === action.lagretFilter.uuid
                            ? action.lagretFilter
                            : lagretFilter
                    )
                );
            }
        }
    }, [action]);

    useEffect(() => {
        setAction(undefined);
    }, [storedValue]);

    const lagreNyttLagretFilter = (navn: string, filter: Filter) => {
        const uuid = uuidv4();
        const nyttLagretFilter = { uuid, navn, filter };
        setAction({ type: 'lagre', lagretFilter: nyttLagretFilter });
        return nyttLagretFilter;
    };

    const slettLagretFilter = (uuid: string) => {
        const lagretFilter = lagredeFilter.find((f) => f.uuid === uuid);
        if (lagretFilter) {
            setAction({ type: 'slett', lagretFilter });
        }
    };

    const oppdaterLagretFilter = (uuid: string, filter: Filter) => {
        const lagretFilter = lagredeFilter.find((f) => f.uuid === uuid);
        if (lagretFilter) {
            setAction({ type: 'oppdater', lagretFilter: { ...lagretFilter, filter } });
        }
    };

    return {
        status: statusMapping[status],
        lagredeFilter: lagredeFilter.sort((a, b) => a.navn.localeCompare(b.navn)),
        lagreNyttLagretFilter,
        slettLagretFilter,
        oppdaterLagretFilter,
        reloadLagredeFilter: reload,
    };
};

export const LagreFilter = () => {
    const {
        saksoversiktState: { valgtFilterId, filter },
        transitions: { setFilter, setValgtFilterId },
    } = useSaksoversiktContext();

    const [openLagre, setOpenLagre] = useState(false);
    const [feilmeldingStatus, setFeilmeldingStatus] = useState<'noInput' | 'duplicate' | 'ok'>(
        'ok'
    );
    const feilmeldingRef = React.useRef<HTMLDivElement>(null);
    const handleFocus = () => feilmeldingRef.current?.focus();
    const logKlikk = useLoggKlikk();

    const lagreNavnInputRef = useRef<HTMLInputElement>(null);
    const lagreNavnInputFocus = () => lagreNavnInputRef.current?.focus();

    useEffect(() => {
        if (lagreNavnInputRef !== null && openLagre) {
            lagreNavnInputFocus();
        }
    }, [openLagre]);

    const {
        status: lagreStatus,
        lagredeFilter,
        reloadLagredeFilter,
        lagreNyttLagretFilter,
        slettLagretFilter,
        oppdaterLagretFilter,
    } = useLagredeFilter();

    useEffect(() => {
        setFeilmeldingStatus('ok');
    }, [openLagre]);

    if (lagreStatus === 'initializing') {
        return null;
    }

    const valgtFilter = lagredeFilter.find((lagretFilter) => lagretFilter.uuid === valgtFilterId);
    return (
        <>
            {lagreStatus === 'failed' ? (
                <Alert variant="error" size="small">
                    Noe gikk galt og vi kunne dessverre ikke lagre filtret. Prøv igjen senere.
                </Alert>
            ) : null}
            <div className="lagre-filter__header">
                <Heading level="3" size="medium" className="saksoversikt__skjult-header-uu">
                    Velg eller lagre filtervalg
                </Heading>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {valgtFilter ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <Chips.Removable
                                className="lagre-filter-chip"
                                variant="neutral"
                                onClick={() => {
                                    setValgtFilterId(undefined);
                                    logKlikk('fjerne-valgt-filter');
                                }}
                            >
                                {valgtFilter.navn}
                            </Chips.Removable>
                            {!equalFilter(valgtFilter.filter, filter) ? (
                                <ModalMedÅpneknapp
                                    knappTekst={'Lagre endringer'}
                                    overskrift={`Endre «${valgtFilter.navn}»`}
                                    bekreft={'Lagre'}
                                    onSubmit={() => {
                                        oppdaterLagretFilter(valgtFilter.uuid, filter);
                                        logKlikk('endre-valgt-filter');
                                    }}
                                >
                                    Er du sikker på at du vil lagre endringene i «{valgtFilter.navn}
                                    »?
                                </ModalMedÅpneknapp>
                            ) : null}
                            <ModalMedÅpneknapp
                                knappTekst={'Slett'}
                                overskrift={`Slett «${valgtFilter.navn}»`}
                                bekreft={'Slett'}
                                bekreftVariant="danger"
                                onSubmit={() => {
                                    slettLagretFilter(valgtFilter.uuid);
                                    setValgtFilterId(undefined);
                                    logKlikk('slett-valgt-filter');
                                }}
                            >
                                Er du sikker på at du vil slette «{valgtFilter.navn}»?
                            </ModalMedÅpneknapp>
                        </div>
                    ) : null}
                </div>
                <Dropdown>
                    <Button
                        variant="secondary"
                        as={Dropdown.Toggle}
                        icon={<StarIcon aria-hidden="true" />}
                    >
                        Lagrede filter
                    </Button>
                    <Dropdown.Menu>
                        {lagredeFilter.length > 0 ? (
                            <>
                                <Dropdown.Menu.List>
                                    {lagredeFilter.map((lagretFilter) => (
                                        <Dropdown.Menu.List.Item
                                            key={lagretFilter.uuid}
                                            onClick={() => {
                                                setValgtFilterId(lagretFilter.uuid);
                                                setFilter({ ...lagretFilter.filter });
                                                reloadLagredeFilter();
                                                logKlikk('bytt-valgt-filter');
                                            }}
                                        >
                                            {lagretFilter.navn}
                                        </Dropdown.Menu.List.Item>
                                    ))}
                                </Dropdown.Menu.List>
                                <Dropdown.Menu.Divider />
                            </>
                        ) : null}
                        <Dropdown.Menu.List>
                            <Dropdown.Menu.List.Item
                                onClick={() => {
                                    setOpenLagre(true);
                                    logKlikk('åpne-lagre-som-nytt-filter');
                                }}
                            >
                                Lagre som nytt filter
                            </Dropdown.Menu.List.Item>
                        </Dropdown.Menu.List>
                    </Dropdown.Menu>
                </Dropdown>
                <Modal
                    open={openLagre}
                    onBeforeInput={() => lagreNavnInputFocus()}
                    onClose={() => {}} // Modal lukkes av submit i formen
                    header={{ heading: 'Lagre som nytt filter', closeButton: false }}
                >
                    <Modal.Body>
                        <form
                            id="LagreNyttFilter"
                            onSubmit={(event) => {
                                {
                                    event.preventDefault();
                                    const filternavn =
                                        lagreNavnInputRef.current?.value?.trim() ?? '';
                                    if (filternavn === '') {
                                        setFeilmeldingStatus('noInput');
                                        handleFocus();
                                    } else if (
                                        lagredeFilter.some((filter) => filter.navn === filternavn)
                                    ) {
                                        setFeilmeldingStatus('duplicate');
                                        handleFocus();
                                    } else {
                                        const nyopprettetfilter = lagreNyttLagretFilter(
                                            filternavn,
                                            filter
                                        );
                                        setValgtFilterId(nyopprettetfilter.uuid);
                                        setOpenLagre(false);
                                        if (filternavn !== '') {
                                            lagreNavnInputRef.current!.value = '';
                                        }
                                        logKlikk('lagre-som-nytt-valgt-filter');
                                    }
                                }
                            }}
                        >
                            {feilmeldingStatus === 'noInput' ? (
                                <ErrorSummary ref={feilmeldingRef} heading="Filter må ha et navn">
                                    <ErrorSummary.Item href="#inputfeltFilternavn">
                                        Fyll inn et navn i tekstfeltet
                                    </ErrorSummary.Item>
                                </ErrorSummary>
                            ) : feilmeldingStatus === 'duplicate' ? (
                                <ErrorSummary
                                    ref={feilmeldingRef}
                                    heading="Filter må ha et unikt navn"
                                >
                                    <ErrorSummary.Item href="#inputfeltFilternavn">
                                        Det finnes allerede et lagret filter med dette navnet.
                                    </ErrorSummary.Item>
                                </ErrorSummary>
                            ) : null}
                            <TextField
                                id="inputfeltFilternavn"
                                label="Navn"
                                description="Navnet vises i din liste over lagrede filter"
                                ref={lagreNavnInputRef}
                            />
                        </form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="primary" form="LagreNyttFilter">
                            Lagre
                        </Button>
                        <Button variant="secondary" onClick={() => setOpenLagre(false)}>
                            Avbryt
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
};
