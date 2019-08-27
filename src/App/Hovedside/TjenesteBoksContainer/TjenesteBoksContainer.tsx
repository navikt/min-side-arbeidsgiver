import React, { FunctionComponent, useContext, useEffect, useState } from 'react';

import { SyfoTilgangContext, TilgangState } from '../../../SyfoTilgangProvider';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import './TjenesteBoksContainer.less';

import Syfoboks from './Syfoboks/Syfoboks';
import Pamboks from './Pamboks/Pamboks';
import Innholdsboks from '../Innholdsboks/Innholdsboks';
import Arbeidstreningboks from './Arbeidstreningboks/Arbeidstreningboks';

const TjenesteBoksContainer: FunctionComponent = () => {
    const { tilgangTilSyfoState } = useContext(SyfoTilgangContext);
    const { tilgangTilPamState, tilgangArbeidsavtaler } = useContext(OrganisasjonsDetaljerContext);
    const { arbeidsavtaler } = useContext(OrganisasjonsDetaljerContext);
    const [typeAntall, settypeAntall] = useState('');

    const ferdigLastet: any = tilgangTilSyfoState && tilgangTilPamState && tilgangArbeidsavtaler;

    console.log('ferdiglastet: ', ferdigLastet);

    useEffect(() => {
        const tellAntallTilganger = (): number => {
            let antallTilganger: number = 0;
            if (tilgangTilPamState === TilgangState.TILGANG) {
                antallTilganger++;
            }
            if (tilgangTilSyfoState === TilgangState.TILGANG) {
                antallTilganger++;
            }
            if (arbeidsavtaler.length) {
                antallTilganger++;
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
    }, [tilgangTilSyfoState, tilgangTilPamState, arbeidsavtaler]);

    return (
        <>
            {ferdigLastet !== 0 && (
                <div className={'tjenesteboks-container ' + typeAntall}>
                    {tilgangTilSyfoState === TilgangState.TILGANG && (
                        <Innholdsboks className={'tjenesteboks innholdsboks'}>
                            <Syfoboks className={'syfoboks'} />
                        </Innholdsboks>
                    )}
                    {tilgangTilPamState === TilgangState.TILGANG && (
                        <div className={'tjenesteboks innholdsboks'}>
                            <Pamboks />
                        </div>
                    )}
                    {tilgangArbeidsavtaler === TilgangState.TILGANG && (
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
