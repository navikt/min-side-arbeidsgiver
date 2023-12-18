import { BodyLong, Button, ButtonProps, Modal } from '@navikt/ds-react';
import React, { ReactNode, useRef } from 'react';
import './ModalMedKnapper.css';

export type ModalMedKnapperProps = {
    overskrift: string;
    knappTekst: string;
    children: ReactNode;
    bekreft: string;
    bekreftVariant?: ButtonProps['variant'];
    onSubmit: () => void;
};

export const ModalMedÅpneknapp = ({
    knappTekst,
    overskrift,
    bekreftVariant,
    children,
    bekreft,
    onSubmit,
}: ModalMedKnapperProps) => {
    const ref = useRef<HTMLDialogElement>(null);
    return (
        <div className="py-16">
            <Button variant="tertiary" onClick={() => ref.current?.showModal()}>
                {knappTekst}
            </Button>

            <Modal ref={ref} header={{ heading: overskrift, closeButton: false }}>
                <Modal.Body>
                    <BodyLong>{children}</BodyLong>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        bekreftVariant
                        type="button"
                        onClick={() => {
                            onSubmit();
                            ref.current?.close();
                        }}
                    >
                        {bekreft}
                    </Button>
                    <Button type="button" variant="secondary" onClick={() => ref.current?.close()}>
                        Avbryt
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};
