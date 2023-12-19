import React from 'react';
import { infoOmNærmesteLederURL } from '../../../lenker';
import NyFaneIkon from './NyFaneIkon';
import { LenkeMedLogging } from '../../../GeneriskeElementer/LenkeMedLogging';
import { BodyLong, BodyShort, Heading, Modal } from '@navikt/ds-react';
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

                <LenkeMedLogging
                    loggLenketekst="Be om tilgang - Les om hvordan nærmeste leder registreres"
                    href={infoOmNærmesteLederURL}
                    target="_blank"
                >
                    <BodyShort>Les om hvordan nærmeste leder registreres</BodyShort>
                    <NyFaneIkon />
                </LenkeMedLogging>
            </Modal.Body>
        </Modal>
    );
};

export default SyfoBeOmTilgangModalBoks;
