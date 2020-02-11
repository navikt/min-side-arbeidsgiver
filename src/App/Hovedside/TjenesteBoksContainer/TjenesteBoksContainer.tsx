import React, {FunctionComponent, useContext, useEffect, useState} from 'react';

import {SyfoTilgangContext} from '../../../SyfoTilgangProvider';
import {OrganisasjonsDetaljerContext} from '../../../OrganisasjonDetaljerProvider';
import './TjenesteBoksContainer.less';
import Syfoboks from './Syfoboks/Syfoboks';
import Pamboks from './Pamboks/Pamboks';
import Innholdsboks from '../Innholdsboks/Innholdsboks';
import Arbeidstreningboks from './Arbeidstreningboks/Arbeidstreningboks';
import IAwebboks from './IAwebboks/IAwebboks';
import {OrganisasjonsListeContext} from '../../../OrganisasjonsListeProvider';
import LasterBoks from '../AltinnContainer/LasterBoks/LasterBoks';
import {Tilgang} from '../../LoginBoundary';
import {loggTilgangsKombinasjonAvTjenestebokser} from "../../../utils/funksjonerForAmplitudeLogging";

const TjenesteBoksContainer: FunctionComponent = () => {
    const { tilgangTilSyfoState } = useContext(SyfoTilgangContext);
    const {tilgangsArray,
        valgtOrganisasjon,
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
        let tjenester: number = tilgangsArray.filter(tilgang => Tilgang.TILGANG).length;
        if (arbeidsavtaler.length === 0) {
            tjenester--;
        }
        setAntallTjenester(tjenester);
    },
        [
        valgtOrganisasjon,
        arbeidsavtaler,
            tilgangsArray,
            organisasjonerMedIAWEB
    ]);

    useEffect(() => {
        console.log(tilgangsArray);
        if (
            !tilgangsArray.includes(Tilgang.LASTER) ||
            ((!tilgangsArray.includes(Tilgang.LASTER)) && orgListeFerdigLastet !== Tilgang.LASTER &&
                orgMedIAFerdigLastet !== Tilgang.LASTER))
        {
            if (antallTjenester % 2 === 0) {
                settypeAntall('antall-partall');
            }
            if (antallTjenester % 2 !== 0 && antallTjenester !== 1) {
                settypeAntall('antall-oddetall');
            }
            if (antallTjenester === 1) {
                settypeAntall('antall-en');
            }
            loggTilgangsKombinasjonAvTjenestebokser(tilgangsArray);
            setTimeout(function() {
                setFerdigLastet('ferdig');
            }, 300);
        }
    }, [
        antallTjenester,
        orgListeFerdigLastet,
        orgMedIAFerdigLastet,
        tilgangsArray
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
                        {tilgangsArray[1] === Tilgang.TILGANG && (
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
