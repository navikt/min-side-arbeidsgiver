import React, {useContext, useEffect} from 'react';
import {Link, useLocation} from 'react-router-dom';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import './SisteSaker.css';
import { SaksListe } from '../SaksListe';
import { useSaker } from '../useSaker';
import {loggNavigasjon} from "../../../../utils/funksjonerForAmplitudeLogging";
import amplitude from "../../../../utils/amplitude";
import {BodyShort, Heading } from "@navikt/ds-react";
import {HoyreChevron} from "../../../../GeneriskeElementer/HoyreChevron";
import { OmSaker } from '../OmSaker';
import { useSessionStateForside } from '../Saksoversikt/useOversiktSessionStorage';
import {OppgaveTilstand, SakSortering} from "../../../../api/graphql-types";

const ANTALL_FORSIDESAKER: number = 3;

const SisteSaker = () => {
    const {valgtOrganisasjon} = useContext(OrganisasjonsDetaljerContext);
    const location = useLocation()

    const {loading, data} = useSaker(ANTALL_FORSIDESAKER, {
        side: 1,
        virksomheter: valgtOrganisasjon === undefined ? [] : [valgtOrganisasjon.organisasjon],
        tekstsoek: "",
        sortering: SakSortering.Oppdatert,
        sakstyper: [],
        oppgaveTilstand: [],
    })

    useSessionStateForside()

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
                    <Heading size="small" level="2">
                        Siste saker
                    </Heading>
                    <OmSaker />
                </div>
                {data.saker.totaltAntallSaker > ANTALL_FORSIDESAKER ?
                    <BodyShort><Link className="lenke" to={{
                        pathname: 'saksoversikt',
                        search: location.search,
                    }} onClick={() => {
                        scroll(0,0);
                        loggNavigasjon("saksoversikt", "se alle saker", location.pathname)
                    }}>
                        Se alle saker
                        <HoyreChevron/>
                    </Link></BodyShort>
                    : null}
            </div>

            <SaksListe saker={data?.saker.saker}/>
        </div>
    );
};

export default SisteSaker;