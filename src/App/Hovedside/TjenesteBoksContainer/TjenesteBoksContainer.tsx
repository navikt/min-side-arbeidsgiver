import React, { FunctionComponent, useContext, useEffect, useState } from 'react';

import { SyfoTilgangContext, Tilgang } from '../../../SyfoTilgangProvider';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import './TjenesteBoksContainer.less';

import Syfoboks from './Syfoboks/Syfoboks';
import Pamboks from './Pamboks/Pamboks';
import Innholdsboks from '../Innholdsboks/Innholdsboks';
import Arbeidstreningboks from './Arbeidstreningboks/Arbeidstreningboks';
import IAwebboks from './IAwebboks/IAwebboks';
import { OrganisasjonsListeContext } from '../../../OrganisasjonsListeProvider';
import LasterBoks from '../AltinnContainer/LasterBoks/LasterBoks';

const TjenesteBoksContainer: FunctionComponent = () => {
    const { tilgangTilSyfoState } = useContext(SyfoTilgangContext);
    const { tilgangTilPamState, valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    const { arbeidsavtaler } = useContext(OrganisasjonsDetaljerContext);
    const { organisasjonerMedIAWEB } = useContext(OrganisasjonsListeContext);
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
            if (arbeidsavtaler.length) {
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
            arbeidsavtaler[0].status !== 'tom avtale'
        ) {
            setFerdigLastet(true);
        }
    }, [
        tilgangTilSyfoState,
        tilgangTilPamState,
        arbeidsavtaler,
        valgtOrganisasjon,
        organisasjonerMedIAWEB,
        ferdigLastet,
    ]);

    return (
        <>
            {!ferdigLastet && <LasterBoks />}{' '}
            {ferdigLastet && (
                <div className={'tjenesteboks-container ' + typeAntall}>
                    {tilgangTilSyfoState !== Tilgang.LASTER &&
                        tilgangTilSyfoState === Tilgang.TILGANG && (
                            <Innholdsboks className={'tjenesteboks innholdsboks'}>
                                <Syfoboks className={'syfoboks'} />
                            </Innholdsboks>
                        )}
                    {visIA && (
                        <div className={'tjenesteboks innholdsboks'}>
                            <IAwebboks />
                        </div>
                    )}
                    {tilgangTilPamState !== Tilgang.LASTER &&
                        tilgangTilPamState === Tilgang.TILGANG && (
                            <div className={'tjenesteboks innholdsboks'}>
                                <Pamboks />
                            </div>
                        )}
                    {arbeidsavtaler.length > 0 && (
                        <div className={'tjenesteboks innholdsboks'}>
                            <Arbeidstreningboks />
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default TjenesteBoksContainer;
