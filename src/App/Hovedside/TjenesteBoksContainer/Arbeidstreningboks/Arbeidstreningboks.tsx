import React, { FunctionComponent, useContext } from 'react';
import arbeidstreningikon from './koffert-tiltak.svg';
import Lenkepanel from 'nav-frontend-lenkepanel';
import './Arbeidstreningboks.less';

import TjenesteBoksBanner from '../TjenesteBoksBanner/TjenesteBoksBanner';
import { arbeidsAvtaleLink } from '../../../../lenker';
import { OrganisasjonsDetaljerContext } from '../../../../OrganisasjonDetaljerProvider';
import {loggTjenesteTrykketPa} from "../../../../utils/funksjonerForAmplitudeLogging";

interface Props {
    varseltekst?: string;
    className?: string;
}

const Arbeidstreningboks: FunctionComponent<Props> = props => {
    const { arbeidsavtaler } = useContext(OrganisasjonsDetaljerContext);

    const hentAntallArbeidsavtalerMedEnStatus = (status: string) =>
        arbeidsavtaler.filter(arbeidsavtale => arbeidsavtale.status === status).length;

    const antallKlareStillingsannonser = hentAntallArbeidsavtalerMedEnStatus('Klar for oppstart');
    const antallTilGodkjenning = hentAntallArbeidsavtalerMedEnStatus('Mangler godkjenning');
    const antallPabegynt = hentAntallArbeidsavtalerMedEnStatus('Påbegynt');

    const lagTekstBasertPaAntall = (antall: number, typeTekst: string): string => {
        if (antall === 0) {
            return '';
        } else if (antall === 1) {
            return '1 avtale ' + typeTekst;
        } else {
            return antall + ' avtaler ' + typeTekst;
        }
    };

    const loggAtKlikketPaArbeidstrening = () => {
        loggTjenesteTrykketPa('Arbeidstrening');
    };

    return (
        <div
            onClick={loggAtKlikketPaArbeidstrening}
            className={'arbeidstreningboks ' + props.className}
        >
            <TjenesteBoksBanner
                tittel={'Arbeidstrening'}
                imgsource={arbeidstreningikon}
                altTekst={''}
            />

            <Lenkepanel
                className={'arbeidstreningboks__info'}
                href={arbeidsAvtaleLink()}
                tittelProps={'normaltekst'}
                linkCreator={(props: any) => <a {...props}>{props.children}</a>}
            >
                {lagTekstBasertPaAntall(antallPabegynt, 'er påbegynt')}
                <br />
                {lagTekstBasertPaAntall(antallTilGodkjenning, 'mangler godkjenning')}
                <br />
                {lagTekstBasertPaAntall(antallKlareStillingsannonser, 'er godkjent')}
                <br />
            </Lenkepanel>
        </div>
    );
};

export default Arbeidstreningboks;
