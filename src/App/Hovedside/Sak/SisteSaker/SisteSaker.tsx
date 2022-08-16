import React, {useContext, useEffect} from 'react';
import {Link, useLocation} from 'react-router-dom';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import './SisteSaker.less';
import { SaksListe } from '../SaksListe';
import { useSaker } from '../useSaker';
import {loggNavigasjon} from "../../../../utils/funksjonerForAmplitudeLogging";
import amplitude from "../../../../utils/amplitude";
import {Heading, HelpText} from "@navikt/ds-react";
import {HoyreChevron} from "../../../../GeneriskeElementer/HoyreChevron";

const ANTALL_FORSIDESAKER: number = 3;

const SisteSaker = () => {
    const {valgtOrganisasjon} = useContext(OrganisasjonsDetaljerContext);
    const { pathname } = useLocation()

    const {loading, data} = useSaker(ANTALL_FORSIDESAKER, {
        side: 1,
        virksomhetsnummer: valgtOrganisasjon?.organisasjon?.OrganizationNumber,
        tekstsoek: "",
    })

    useEffect(() => {
        if (!loading && data) {
            amplitude.logEvent('komponent-lastet', {
                komponent: 'siste-saker',
                totaltAntallSaker: data.saker.totaltAntallSaker
            })
        }
    }, [loading, data])

    if (valgtOrganisasjon === undefined) return null;

    if (loading || !data || data?.saker.saker.length == 0) return null;

    return (
        <div className='innsynisak'>
            <div className='innsynisak__header'>
                <div className='innsynisak__tittel'>
                    <Heading level="3" size="small">
                        Siste saker
                    </Heading>
                    <HelpText title="Hva vises her?">
                        <div style={{maxWidth:"25rem"}}>
                        Her vises meldinger for permitteringer, oppsigelser eller innskrenkning i arbeidstid. Vi
                        jobber med at flere saker skal vises her etterhvert.
                        </div>
                    </HelpText>
                </div>
                {data.saker.totaltAntallSaker > ANTALL_FORSIDESAKER ?
                    <Link className="lenke" to='saksoversikt' onClick={() => {
                        scroll(0,0);
                        loggNavigasjon("saksoversikt", "se alle saker", pathname)
                    }}>
                        Se alle ({data?.saker.totaltAntallSaker})
                        <HoyreChevron/>
                    </Link>
                    : null}
            </div>

            <SaksListe saker={data?.saker.saker}/>
        </div>
    );
};

export default SisteSaker;