import { equalFilter, Filter, State } from './useOversiktStateTransitions';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Chips, Dropdown, ErrorSummary, TextField } from '@navikt/ds-react';
import { StarIcon } from '@navikt/aksel-icons';
import { ModalMedKnapper } from '../../../../GeneriskeElementer/ModalMedKnapper';

export type LagretFilter = {
    navn: string,
    filter: Filter
}

type LagreFilterProps = {
    state: State,
    lagredeFilter: LagretFilter[],
    setLagredeFilter: (LagredeFilter: LagretFilter[]) => void,
    valgtFilter: LagretFilter | null,
    setValgtFilter: (LagretFilter: LagretFilter | null) => void,
}


export const LagreFilter = ({
                                state,
                                lagredeFilter,
                                setLagredeFilter,
                                valgtFilter,
                                setValgtFilter,
                            }: LagreFilterProps) => {
    const [openEndre, setOpenEndre] = useState(false);
    const [openSlett, setOpenSlett] = useState(false);
    const [openLagre, setOpenLagre] = useState(false);
    const [feilmeldingStatus, setFeilmeldingStatus] = useState<'noInput' | 'duplicate' | 'ok'>('ok');

    const feilmeldingRef = React.useRef<HTMLDivElement>(null);
    const handleFocus = () => feilmeldingRef.current?.focus();

    const lagreNavnInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setFeilmeldingStatus('ok');
    }, [openLagre]);

    return <>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {valgtFilter ? <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <Chips.Removable
                        className='Saksoversikt-Filter-pill'
                        variant='neutral'
                        onClick={() => {
                            setValgtFilter(null);
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
                            <Dropdown.Menu.List.Item key={lagretFilter.navn} onClick={() => {
                                setValgtFilter(lagretFilter);

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
                    const nyopprettetFilter = { navn: filternavn, filter: state.filter };
                    setLagredeFilter([nyopprettetFilter, ...lagredeFilter]);
                    setValgtFilter(nyopprettetFilter);
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
        <ModalMedKnapper
            overskrift={`Slett «${valgtFilter?.navn}»`}
            bekreft={'Slett'}
            open={openSlett}
            bekreftVariant='danger'
            setOpen={setOpenSlett}
            onSubmit={() => {
                setLagredeFilter(lagredeFilter.filter(filter => filter != valgtFilter));
                setValgtFilter(null);
                setOpenSlett(false);
            }}
        >
            Er du sikker på at du vil slette «{valgtFilter?.navn}»?
        </ModalMedKnapper>
        <ModalMedKnapper
            overskrift={`Endre «${valgtFilter?.navn}»`}
            bekreft={'Lagre'}
            open={openEndre}
            setOpen={setOpenEndre}
            onSubmit={() => {
                const nyttFilter = {
                    navn: valgtFilter?.navn ?? '',
                    filter: state.filter,
                };
                setLagredeFilter([nyttFilter, ...lagredeFilter.filter(filter => filter.navn != valgtFilter?.navn)]);
                setValgtFilter(nyttFilter);
                setOpenEndre(false);
            }}
        >
            Er du sikker på at du vil lagre endringene i «{valgtFilter?.navn}»?
        </ModalMedKnapper>
    </>;
};