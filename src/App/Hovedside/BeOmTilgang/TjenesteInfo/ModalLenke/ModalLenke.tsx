import React, { useState } from 'react';
import { Element, Normaltekst, Undertittel } from 'nav-frontend-typografi';
import Modal from 'nav-frontend-modal';
import Lenke from 'nav-frontend-lenker';
import { LenkeTilInfoOmNarmesteLeder } from '../../../../../lenker';
import informasjonsikon from './informasjonsikon.svg';
import NyFaneIkon from '../NyFaneIkon';
import './ModalLenke.less';
import {loggTjenesteTrykketPa} from "../../../../../utils/funksjonerForAmplitudeLogging";

interface Props {
    overskrift: string;
}

const ModalLenke = ({overskrift}: Props) => {
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    return (
        <div>
            <button
                onClick={() => {
                    openModal();
                }}
                className="be-om-tilgang__tjenesteinfo__lenke-syfo"
            >
                <Element>
                    <span>{overskrift + ' - be om tilgang' }</span><NyFaneIkon />
                </Element>
            </button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => closeModal()}
                closeButton={true}
                contentLabel="digitale sykmeldinger-modal"
                className="syfo-modal"
            >
                <div className="syfo-modal__innhold">
                    <div className="syfo-modal__overskrift-og-info">
                        <img src={informasjonsikon} alt="" className="infoikon" />
                        <Undertittel className="syfo-modal__tittel">
                            Tilgang til dine sykmeldte
                        </Undertittel>
                    </div>

                    <div className="syfo-modal__personvern-info">
                        <Normaltekst className="syfo-modal__tekst">
                            For å bruke denne tjennesten må du være registrert som nærmeste leder
                            for én eller flere ansatte. Tilgangsstyringen skiller seg fra våre andre
                            tjenester ved at den ikke baserer seg på hvilken virksomhet du har valgt
                            i menyen, men kun baserer seg på om du er nærmeste leder eller ikke.
                        </Normaltekst>

                        <Lenke
                            onClick={() => loggTjenesteTrykketPa("Be om tilgang- "+overskrift,LenkeTilInfoOmNarmesteLeder,"Les om hvordan nærmeste leder registreres" )}
                            className="syfo-modal__lenke"
                            href={LenkeTilInfoOmNarmesteLeder}
                            target="_blank"
                        >
                            <span>Les om hvordan nærmeste leder registreres</span><NyFaneIkon/>
                        </Lenke>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default ModalLenke;
