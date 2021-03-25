import React from 'react';
import { Normaltekst, Undertittel } from 'nav-frontend-typografi';
import Modal from 'nav-frontend-modal';
import Lenke from 'nav-frontend-lenker';
import { infoOmNærmesteLederURL } from '../../../../lenker';
import informasjonsikon from './informasjonsikon.svg';
import NyFaneIkon from '../TjenesteInfo/NyFaneIkon';
import './SyfoBeOmTilgangModalBoks.less';
import { loggTjenesteTrykketPa } from '../../../../utils/funksjonerForAmplitudeLogging';

interface Props {
    isOpen: boolean;
    onRequestClose: () => void;
}

const SyfoBeOmTilgangModalBoks = ({ isOpen, onRequestClose }: Props) => {
    return (
        // <button
        //     className="be-om-tilgang__tjenesteinfo__lenke-syfo"
        // >
        // </button>
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
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
                        For å bruke denne tjennesten må du være registrert som nærmeste leder for én
                        eller flere ansatte. Tilgangsstyringen skiller seg fra våre andre tjenester
                        ved at den ikke baserer seg på hvilken virksomhet du har valgt i menyen, men
                        kun baserer seg på om du er nærmeste leder eller ikke.
                    </Normaltekst>

                    <Lenke
                        onClick={() =>
                            loggTjenesteTrykketPa(
                                'Be om tilgang- Dine sykmeldte',
                                infoOmNærmesteLederURL,
                                'Les om hvordan nærmeste leder registreres'
                            )
                        }
                        className="syfo-modal__lenke"
                        href={infoOmNærmesteLederURL}
                        target="_blank"
                    >
                        <span>Les om hvordan nærmeste leder registreres</span>
                        <NyFaneIkon />
                    </Lenke>
                </div>
            </div>
        </Modal>
    );
};

export default SyfoBeOmTilgangModalBoks;
