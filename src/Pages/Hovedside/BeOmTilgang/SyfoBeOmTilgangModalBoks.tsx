import React from 'react';
import NyFaneIkon from './NyFaneIkon';
import { Lenke } from '../../../GeneriskeElementer/Lenke';
import { BodyLong, BodyShort, Modal } from '@navikt/ds-react';
import { InformationSquareIcon } from '@navikt/aksel-icons';

interface Props {
    isOpen: boolean;
    onRequestClose: () => void;
}

const SyfoBeOmTilgangModalBoks = ({ isOpen, onRequestClose }: Props) => {
    return (
        <Modal
            open={isOpen}
            onClose={onRequestClose}
            aria-label="digitale sykmeldinger-modal"
            className="syfo-modal"
            header={{
                heading: 'Tilgang til dine sykmeldte',
                closeButton: true,
                icon: <InformationSquareIcon aria-hidden />,
            }}
        >
            <Modal.Body>
                <BodyLong>
                    For å bruke denne tjenesten må du være registrert som nærmeste leder for én
                    eller flere ansatte.
                </BodyLong>

                <Lenke
                    href={'https://www.nav.no/arbeidsgiver/tilganger#sykmelding'}
                    target="_blank"
                >
                    <BodyShort>Les om hvordan nærmeste leder registreres</BodyShort>
                    <NyFaneIkon />
                </Lenke>
            </Modal.Body>
        </Modal>
    );
};

export default SyfoBeOmTilgangModalBoks;
