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
                            className={'syfo-modal__lenke'}
                            href={LenkeTilInfoOmNarmesteLeder}
                            target="_blank"
                        >
                            Les om hvordan nærmeste leder registreres <img src={nyfane} alt={' '} />{' '}
                        </Lenke>
                    </div>

                </div>
            </Modal>
        </div>
    );
};

export default ModalLenke;
