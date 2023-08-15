import { Button, ButtonProps, Heading, Modal } from '@navikt/ds-react';
import React, { ReactNode } from 'react';
import './ModalMedKnapper.css'

export type ModalMedKnapperProps = {
    overskrift: string,
    children: ReactNode,
    bekreft: string,
    bekreftVariant?: ButtonProps['variant'],
    open: boolean;
    setOpen: (open: (open: boolean) => boolean) => void;
    onSubmit: () => void;

}

export const ModalMedKnapper = ({
                                    open,
                                    setOpen,
                                    overskrift,
                                    children,
                                    bekreft,
                                    bekreftVariant,
                                    onSubmit,
                                }: ModalMedKnapperProps) => {
    return <Modal
        open={open}
        aria-label={overskrift}
        onClose={() => setOpen((x) => !x)}
    >
        <Modal.Content>
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit();
                }}
                className='ModalMedKnapper-Innhold'
            >
                <div>
                    <Heading spacing level='2' size='medium' id='modal-heading'>
                        {overskrift}
                    </Heading>
                    {children}
                </div>

                <div className='ModalMedKnapper-Knapper'>
                    <Button
                        variant='tertiary'
                        type='button'
                        onClick={() => {
                            setOpen(() => false);
                        }}
                    >
                        Avbryt
                    </Button>
                    <Button variant={bekreftVariant} type='submit'>
                        {bekreft}
                    </Button>
                </div>
            </form>
        </Modal.Content>
    </Modal>;
};