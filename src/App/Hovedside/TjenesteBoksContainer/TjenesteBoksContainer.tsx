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
import ManglerTilgangBoks from '../ManglerTilgangBoks/ManglerTilgangBoks';
import { Tilgang } from '../../LoginBoundary';

const TjenesteBoksContainer: FunctionComponent = () => {
    const { tilgangTilSyfoState } = useContext(SyfoTilgangContext);
    const { tilgangTilPamState, valgtOrganisasjon, tilgangTilArbeidsavtaler } = useContext(
        OrganisasjonsDetaljerContext
    );
    const { arbeidsavtaler } = useContext(OrganisasjonsDetaljerContext);
    const { organisasjonerMedIAWEB } = useContext(OrganisasjonsListeContext);
    const { harNoenTilganger } = useContext(OrganisasjonsDetaljerContext);
    const { organisasjoner } = useContext(OrganisasjonsListeContext);
    const skalViseManglerTilgangBoks = !(organisasjoner.length > 0 || harNoenTilganger);
    const [typeAntall, settypeAntall] = useState('');
    const [visIA, setVisIA] = useState(false);
    const [ferdigLastet, setFerdigLastet] = useState(false);

    useEffect(() => {
        setFerdigLastet(false);
        const tellAntallTilganger = (): number => {
            let antallTilganger: number = 0;
            if (tilgangTilPamState === Tilgang.TILGANG) {
                antallTilganger++;
            }
            if (tilgangTilSyfoState === Tilgang.TILGANG) {
                antallTilganger++;
            }
            if (arbeidsavtaler.length && arbeidsavtaler[0].status !== 'tom avtale') {
                antallTilganger++;
            }
            let orgNrIAweb: string[] = organisasjonerMedIAWEB.map(org => org.OrganizationNumber);
            if (orgNrIAweb.includes(valgtOrganisasjon.OrganizationNumber)) {
                setVisIA(true);
                antallTilganger++;
            } else {
                setVisIA(false);
            }
            return antallTilganger;
        };

        let antallTjenesteTilganger = tellAntallTilganger();
        if (antallTjenesteTilganger % 2 === 0) {
            settypeAntall('antall-partall');
        } else if (antallTjenesteTilganger === 1) {
            settypeAntall('antall-en');
        } else {
            settypeAntall('antall-oddetall');
        }

        if (
            tilgangTilPamState !== Tilgang.LASTER &&
            tilgangTilSyfoState !== Tilgang.LASTER &&
            tilgangTilArbeidsavtaler !== Tilgang.LASTER
        ) {
            setFerdigLastet(true);
        }
    }, [
        tilgangTilSyfoState,
        tilgangTilPamState,
        tilgangTilArbeidsavtaler,
        arbeidsavtaler,
        valgtOrganisasjon,
        organisasjonerMedIAWEB,
        ferdigLastet,
    ]);

    return (
        <>
            {' '}
            <div className={'tjenesteboks-container ' + typeAntall}>
                {!ferdigLastet && <LasterBoks />}
                {ferdigLastet && (
                    <>
                        {skalViseManglerTilgangBoks && <ManglerTilgangBoks />}

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
                        {arbeidsavtaler.length > 0 && arbeidsavtaler[0].status !== 'tom avtale' && (
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
