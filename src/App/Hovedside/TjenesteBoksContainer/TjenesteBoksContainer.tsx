import React, { FunctionComponent, useContext, useEffect, useState } from 'react';

import { SyfoTilgangContext } from '../../../SyfoTilgangProvider';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import './TjenesteBoksContainer.less';
import Syfoboks from './Syfoboks/Syfoboks';
import Pamboks from './Pamboks/Pamboks';
import Innholdsboks from '../Innholdsboks/Innholdsboks';
import Arbeidstreningboks from './Arbeidstreningboks/Arbeidstreningboks';
import IAwebboks from './IAwebboks/IAwebboks';
import { OrganisasjonsListeContext } from '../../../OrganisasjonsListeProvider';
import LasterBoks from '../AltinnContainer/LasterBoks/LasterBoks';
import { Tilgang } from '../../LoginBoundary';
import {loggTilgangsKombinasjonAvTjenestebokser} from "../../../utils/funksjonerForAmplitudeLogging";

const TjenesteBoksContainer: FunctionComponent = () => {
    const { tilgangTilSyfoState } = useContext(SyfoTilgangContext);
    const {
        tilgangTilPamState,
        valgtOrganisasjon,
        tilgangTilArbeidsavtaler,
        arbeidsavtaler,
    } = useContext(OrganisasjonsDetaljerContext);
    const {
        organisasjonerMedIAWEB,
        orgListeFerdigLastet,
        orgMedIAFerdigLastet,
    } = useContext(OrganisasjonsListeContext);
    const [typeAntall, settypeAntall] = useState('');
    const [antallTjenester, setAntallTjenester] = useState(0);
    const [ferdigLastet, setFerdigLastet] = useState('laster');
    const [visIA, setVisIA] = useState(false);

    useEffect(() => {
        let orgNrIAweb: string[] = organisasjonerMedIAWEB.map(org => org.OrganizationNumber);
        if (orgNrIAweb.includes(valgtOrganisasjon.OrganizationNumber)) {
            setVisIA(true);
        } else {
            setVisIA(false);
        }
        let tjenester: number = 0;
        if (tilgangTilSyfoState === Tilgang.TILGANG) {
            tjenester++;
        }
        if (tilgangTilPamState === Tilgang.TILGANG) {
            tjenester++;
        }
        if (visIA === true) {
            tjenester++;
        }
        if (arbeidsavtaler.length > 0) {
            tjenester++;
        }
        setAntallTjenester(tjenester);

        if (
            (tilgangTilPamState !== Tilgang.LASTER &&
                tilgangTilSyfoState !== Tilgang.LASTER &&
                tilgangTilArbeidsavtaler !== Tilgang.LASTER &&
                orgMedIAFerdigLastet !== Tilgang.LASTER) ||
            (orgListeFerdigLastet !== Tilgang.LASTER &&
                tilgangTilSyfoState !== Tilgang.LASTER &&
                orgMedIAFerdigLastet !== Tilgang.LASTER)
        ) {
            if (antallTjenester % 2 === 0) {
                settypeAntall('antall-partall');
            }
            if (antallTjenester % 2 !== 0 && antallTjenester !== 1) {
                settypeAntall('antall-oddetall');
            }
            if (antallTjenester === 1) {
                settypeAntall('antall-en');
            }
            const tilgangsArray: Tilgang[] = [0,0,0,0];
            tilgangsArray[0] = tilgangTilSyfoState;
            tilgangsArray[1] = tilgangTilPamState;
            tilgangsArray[2] = orgMedIAFerdigLastet;
            tilgangsArray[3] = tilgangTilArbeidsavtaler;
            loggTilgangsKombinasjonAvTjenestebokser(tilgangsArray);
            setTimeout(function() {
                setFerdigLastet('ferdig');
            }, 300);
        }
    }, [
        tilgangTilSyfoState,
        tilgangTilPamState,
        tilgangTilArbeidsavtaler,
        valgtOrganisasjon,
        organisasjonerMedIAWEB,
        ferdigLastet,
        visIA,
        antallTjenester,
        typeAntall,
        arbeidsavtaler,
        orgListeFerdigLastet,
        orgMedIAFerdigLastet,
    ]);

    return (
        <>
            {' '}
            <div className={'tjenesteboks-container ' + typeAntall}>
                {ferdigLastet === 'laster' && <LasterBoks />}
                {ferdigLastet === 'ferdig' && (
                    <>
                        {tilgangTilSyfoState === Tilgang.TILGANG && (
                            <Innholdsboks className={'tjenesteboks innholdsboks'}>
                                <Syfoboks className={'syfoboks'} />
                            </Innholdsboks>
                        )}
                        {visIA && (
                            <div className={'tjenesteboks innholdsboks'}>
                                <IAwebboks />
                            </div>
                        )}
                        {tilgangTilPamState === Tilgang.TILGANG && (
                            <div className={'tjenesteboks innholdsboks'}>
                                <Pamboks />
                            </div>
                        )}
                        {arbeidsavtaler.length > 0 && (
                            <div className={'tjenesteboks innholdsboks'}>
                                <Arbeidstreningboks />
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
};

export default TjenesteBoksContainer;
