import React, { useEffect, useRef, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
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
import { useLoggKlikk } from '../../utils/analytics';
import './LagreFilter.css';
import { Set } from 'immutable';
import {
    equalFilter,
    SaksoversiktFilterState,
    SaksoversiktLagretFilter,
    useSaksoversiktContext,
} from './SaksoversiktProvider';

export const useLagredeFilter = (): {
    lagredeFilter: SaksoversiktLagretFilter[];
    lagreLagretFilter: (
        filterId: string,
        navn: string,
        filter: SaksoversiktFilterState
    ) => Promise<SaksoversiktLagretFilter | null>;
    slettLagretFilter: (filterId: string) => void;
    loadLagredeFilter: () => void;
    status: 'initializing' | 'loading' | 'completed' | 'failed';
} => {
    const endpoint = `${__BASE_PATH__}/api/lagredeFilter`;
    const [lagredeFilter, setLagredeFilter] = useState<SaksoversiktLagretFilter[]>([]);
    const [status, setStatus] = useState<'initializing' | 'loading' | 'completed' | 'failed'>(
        'initializing'
    );

    useEffect(() => {
        loadLagredeFilter();
    }, []);

    const loadLagredeFilter = () => {
        setStatus('loading');
        hentLagredeFilter()
            .then((data) => {
                setLagredeFilter(data);
                setStatus('completed');
            })
            .catch((error) => {
                console.error('Error fetching lagrede filter:', error);
                setStatus('failed');
            });
    };

    async function hentLagredeFilter(): Promise<SaksoversiktLagretFilter[]> {
        const response = await fetch(endpoint, {
            method: 'GET',
        });
        if (!response.ok) {
            throw new Error(`Failed to fetch lagrede filter: ${response.statusText}`);
        }
        return response.json().then((res) =>
            res.map((filter: SaksoversiktLagretFilter) => ({
                ...filter,
                virksomheter: Set(filter.virksomheter), // pass på at virksomheter håndteres som et immutabel Set
            }))
        );
    }

    async function lagreLagretFilter(
        filterId: string,
        navn: string,
        filter: SaksoversiktFilterState
    ): Promise<SaksoversiktLagretFilter | null> {
        const response = await fetch(endpoint, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ...filter, filterId: filterId, navn: navn }),
        });
        if (!response.ok) {
            throw new Error(`Failed to create new filter: ${response.statusText}`);
        }
        return response.json();
    }

    async function slettLagretFilter(filterId: string): Promise<SaksoversiktLagretFilter | null> {
        const response = await fetch(`${endpoint}/${filterId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error(`Failed to delete filter: ${response.statusText}`);
        }
        setLagredeFilter((prevFilters) => prevFilters.filter((f) => f.filterId !== filterId));
        return response.json();
    }

    return {
        lagredeFilter,
        loadLagredeFilter,
        lagreLagretFilter,
        slettLagretFilter,
        status,
    };
};
export const LagreFilter = () => {
    const {
        saksoversiktState: { valgtLagretFilterId, filter },
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
        loadLagredeFilter,
        lagreLagretFilter,
        slettLagretFilter,
    } = useLagredeFilter();

    useEffect(() => {
        setFeilmeldingStatus('ok');
    }, [openLagre]);

    if (lagreStatus === 'initializing') {
        return null;
    }

    const valgtLagretFilter = lagredeFilter.find(
        (lagretFilter) => lagretFilter.filterId === valgtLagretFilterId
    );
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
                    {valgtLagretFilter ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <Chips.Removable
                                className="lagre-filter-chip"
                                variant="neutral"
                                onClick={() => {
                                    setValgtFilterId(undefined);
                                    logKlikk('fjerne-valgt-filter');
                                }}
                            >
                                {valgtLagretFilter.navn}
                            </Chips.Removable>
                            {!equalFilter(valgtLagretFilter, filter) ? (
                                <ModalMedÅpneknapp
                                    knappTekst={'Lagre endringer'}
                                    overskrift={`Endre «${valgtLagretFilter.navn}»`}
                                    bekreft={'Lagre'}
                                    onSubmit={() => {
                                        lagreLagretFilter(
                                            valgtLagretFilter.filterId,
                                            valgtLagretFilter.navn,
                                            filter
                                        );
                                        logKlikk('endre-valgt-filter');
                                    }}
                                >
                                    Er du sikker på at du vil lagre endringene i «
                                    {valgtLagretFilter.navn}
                                    »?
                                </ModalMedÅpneknapp>
                            ) : null}
                            <ModalMedÅpneknapp
                                knappTekst={'Slett'}
                                overskrift={`Slett «${valgtLagretFilter.navn}»`}
                                bekreft={'Slett'}
                                bekreftVariant="danger"
                                onSubmit={() => {
                                    slettLagretFilter(valgtLagretFilter.filterId);
                                    setValgtFilterId(undefined);
                                    logKlikk('slett-valgt-filter');
                                }}
                            >
                                Er du sikker på at du vil slette «{valgtLagretFilter.navn}»?
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
                                            key={lagretFilter.filterId}
                                            onClick={() => {
                                                setValgtFilterId(lagretFilter.filterId);
                                                setFilter({ ...lagretFilter });
                                                loadLagredeFilter();
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
                                        const filterId = uuidv4();
                                        lagreLagretFilter(filterId, filternavn, filter).then(
                                            (nyttFilter) => {
                                                setValgtFilterId(nyttFilter?.filterId);
                                                setOpenLagre(false);
                                                if (filternavn !== '') {
                                                    lagreNavnInputRef.current!.value = '';
                                                }
                                                logKlikk('lagre-som-nytt-valgt-filter');
                                            }
                                        );
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
