import React, {useContext, useEffect} from 'react';
import {Link, useLocation} from 'react-router-dom';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import './SisteSaker.less';
import { Undertittel } from 'nav-frontend-typografi';
import { HoyreChevron } from 'nav-frontend-chevron';
import { SaksListe } from '../SaksListe';
import { useSaker } from '../useSaker';
import {loggNavigasjon} from "../../../../utils/funksjonerForAmplitudeLogging";
import amplitude from "../../../../utils/amplitude";
import {HelpText} from "@navikt/ds-react";


const SisteSaker = () => {
    const {valgtOrganisasjon} = useContext(OrganisasjonsDetaljerContext);
    const { pathname } = useLocation()

    const {loading, data} = useSaker(3, {
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
                    <Undertittel>
                        Siste saker
                    </Undertittel>
                    <HelpText title="Hva vises her?">
                        Her vises meldinger for permitteringer, oppsigelser <br/>eller innskrenkning i arbeidstid. Vi jobber med at <br/>flere saker skal vises her etterhvert.
                    </HelpText>
                </div>
                <Link className="lenke" to='saksoversikt' onClick={() => {
                    loggNavigasjon("saksoversikt", "se alle saker", pathname)
                }}>
                    Se alle ({data?.saker.totaltAntallSaker})
                    <HoyreChevron />
                </Link>
            </div>

            <SaksListe saker={data?.saker.saker}/>
        </div>
    );
};

export default SisteSaker;