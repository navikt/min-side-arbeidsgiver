import React, { useState } from 'react';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import Modal from 'nav-frontend-modal';
import './ModalLenke.less';
import Lenke from 'nav-frontend-lenker';

import informasjonsikon from './informasjonsikon.svg';

import nyfane from '../nyfane.svg';

import { LenkeTilInfoOmNarmesteLeder } from '../../../../../lenker';

const ModalLenke = () => {
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const openModal = () => setModalIsOpen(true);
    const closeModal = () => setModalIsOpen(false);

    return (
        <div>
            <button
                onClick={() => openModal()}
                className={'tjeneste-info__lenke tjeneste-info__lenke-syfo'}
            >
                Be om tilgang <img src={nyfane} alt={' '} />{' '}
            </button>
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => closeModal()}
                closeButton={true}
                contentLabel="Last ned Excelfil modal"
                className="eksport-modal"
            >
                <div className="eksport-modal__innhold">
                    <div className="eksport-modal__varsel">
                        <img src={informasjonsikon} alt="" className="varselikon" />
                        <Undertittel className="eksport-modal__overskrift">
                            Tilgang til dine sykmeldte
                        </Undertittel>
                    </div>

                    <div className="eksport-modal__personvern-info">
                        <Normaltekst className="tekst">
                            For å bruke denne tjennesten må du være registrert som nærmeste leder
                            for én eller flere ansatte. Tilgangstyringen skiller seg fra våre andre
                            tjenester ved at den ikke baserer seg på hvilken virksomhet du har valgt
                            i menyen, men kun baserer seg på om du er nærmeste leder eller ikke.
                        </Normaltekst>

                        <Lenke
                            className={'eksport-modal__lenke'}
                            href={LenkeTilInfoOmNarmesteLeder}
                            target="_blank"
                        >
                            Les om hvordan nærmeste leder registreres <img src={nyfane} alt={' '} />{' '}
                        </Lenke>
                    </div>

                    <div className="eksport-modal__knapper"></div>
                </div>
            </Modal>
        </div>
    );
};

export default ModalLenke;
