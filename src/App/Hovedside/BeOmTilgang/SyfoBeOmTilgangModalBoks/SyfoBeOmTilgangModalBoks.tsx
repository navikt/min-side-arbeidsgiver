import React from 'react';
import { infoOmNærmesteLederURL } from '../../../../lenker';
import informasjonsikon from './informasjonsikon.svg';
import NyFaneIkon from '../TjenesteInfo/NyFaneIkon';
import './SyfoBeOmTilgangModalBoks.css';
import { LenkeMedLogging } from '../../../../GeneriskeElementer/LenkeMedLogging';
import {BodyLong, Heading, Modal} from "@navikt/ds-react";

interface Props {
    isOpen: boolean;
    onRequestClose: () => void;
}

const SyfoBeOmTilgangModalBoks = ({ isOpen, onRequestClose }: Props) => {
    return (
        <Modal
            open={isOpen}
            onClose={onRequestClose}
            closeButton={true}
            aria-label="digitale sykmeldinger-modal"
            className="syfo-modal"
        >
            <div className="syfo-modal__innhold">
                <div className="syfo-modal__overskrift-og-info">
                    <img src={informasjonsikon} alt="" className="infoikon" />
                    <Heading size="small" level="2" className="syfo-modal__tittel">
                        Tilgang til dine sykmeldte
                    </Heading>
                </div>

                <div className="syfo-modal__personvern-info">
                    <BodyLong className="syfo-modal__tekst">
                        For å bruke denne tjenesten må du være registrert som nærmeste leder for én
                        eller flere ansatte.
                    </BodyLong>

                    <LenkeMedLogging
                        loggLenketekst="Be om tilgang - Les om hvordan nærmeste leder registreres"
                        className="syfo-modal__lenke"
                        href={infoOmNærmesteLederURL}
                        target="_blank"
                    >
                        <span>Les om hvordan nærmeste leder registreres</span>
                        <NyFaneIkon />
                    </LenkeMedLogging>
                </div>
            </div>
        </Modal>
    );
};

export default SyfoBeOmTilgangModalBoks;
