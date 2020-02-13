import React, { FunctionComponent, useContext } from 'react';
import syfoikon from './syfoikon.svg';
import Lenkepanel from 'nav-frontend-lenkepanel';
import './Syfoboks.less';
import TjenesteBoksBanner from '../TjenesteBoksBanner/TjenesteBoksBanner';
import { syfoLink } from '../../../../lenker';
import { SyfoTilgangContext } from '../../../../SyfoTilgangProvider';
import { SyfoOppgave } from '../../../../Objekter/syfoOppgaver';

interface Props {
    varseltekst?: string;
    className?: string;
}

const tellTypeOppgaver = (oppgaveArray: SyfoOppgave[], oppgaveType: string): number => {
    return oppgaveArray.filter(oppgave => {
        return oppgave.oppgavetype === oppgaveType;
    }).length;
};

const LagSykepengesoknadVarselTekst = (antall: number): string => {
    if (antall === 1) {
        return antall + ' sykpengesøknad som er ulest eller ikke sendt inn';
    }
    if (antall > 1) {
        return antall + ' sykpengesøknader som er uleste eller ikke sendt inn';
    }
    return '';
};

const LagSykemeldingsVarselTekst = (antall: number): string => {
    if (antall === 1) {
        return antall + ' ulest sykmelding';
    }
    if (antall > 1) {
        return antall + ' uleste sykmeldinger';
    }
    return '';
};

const Syfoboks: FunctionComponent<Props> = props => {
    const { syfoOppgaverState } = useContext(SyfoTilgangContext);
    const { syfoAnsatteState, visSyfoOppgaveFeilmelding } = useContext(SyfoTilgangContext);

    const loggAtKlikketPaSyfo = () => {
        //loggNavigasjonTilTjeneste('Syfo');
    };

    const tooltipText: FunctionComponent<Props> = () => {
        const antallSykemeldingsvarsler = tellTypeOppgaver(syfoOppgaverState, 'Sykemelding');
        const antallSoknadsVarsler = tellTypeOppgaver(syfoOppgaverState, 'Sykepengesøknad');
        if (visSyfoOppgaveFeilmelding) {
            return (
                <>
                    <div>
                        Kan ikke hente oppgaver fra Dine sykemeldte. Vi jobber med å løse problemet.
                    </div>
                    <div>
                        Dersom du vet du har oppgaver som må utføres, kan du fortsatt gå inn på Dine
                        sykemeldte
                    </div>
                </>
            );
        }
        return (
            <div>
                <div>{LagSykemeldingsVarselTekst(antallSykemeldingsvarsler)}</div>
                <div>{LagSykepengesoknadVarselTekst(antallSoknadsVarsler)}</div>
            </div>
        );
    };

    return (
        <div className={'syfoboks ' + props.className} onClick={loggAtKlikketPaSyfo}>
            <TjenesteBoksBanner
                tittel={'Sykmeldte'}
                imgsource={syfoikon}
                altTekst={''}
                antallVarsler={syfoOppgaverState.length}
                toolTipext={tooltipText}
                VisOppgaveFeilmelding={visSyfoOppgaveFeilmelding}
            />
            <Lenkepanel
                className={'syfoboks__sykemeldte'}
                href={syfoLink()}
                tittelProps={'normaltekst'}
                linkCreator={(props: any) => <a {...props}>{props.children}</a>}
            >
                {syfoAnsatteState} sykmeldte som du har ansvar for
            </Lenkepanel>
        </div>
    );
};

export default Syfoboks;
