import React, { useContext, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import './SisteSaker.css';
import { SaksListe } from '../SaksListe';
import { useSaker } from '../useSaker';
import { loggNavigasjon } from '../../../../utils/funksjonerForAmplitudeLogging';
import amplitude from '../../../../utils/amplitude';
import { BodyShort, Heading } from '@navikt/ds-react';
import { OmSaker } from '../OmSaker';
import { useSessionStateForside } from '../Saksoversikt/useOversiktSessionStorage';
import { SakSortering } from '../../../../api/graphql-types';
import { FileFolder } from '@navikt/ds-icons';

const ANTALL_FORSIDESAKER: number = 3;

const SisteSaker = () => {
    const { valgtOrganisasjon, antallSakerForAlleBedrifter } = useContext(OrganisasjonsDetaljerContext);
    const location = useLocation();

    const { loading, data } = useSaker(ANTALL_FORSIDESAKER, {
        side: 1,
        virksomheter: valgtOrganisasjon === undefined ? [] : [valgtOrganisasjon.organisasjon],
        tekstsoek: '',
        sortering: SakSortering.Frist,
        sakstyper: [],
        oppgaveTilstand: [],
    });

    useSessionStateForside();

    useEffect(() => {
        if (!loading && data) {
            amplitude.logEvent('komponent-lastet', {
                komponent: 'siste-saker',
                totaltAntallSaker: data.saker.totaltAntallSaker,
            });
        }
    }, [loading, data]);

    if (valgtOrganisasjon === undefined) return null;

    if (loading || !data) return null;

    if ((antallSakerForAlleBedrifter ?? 0) === 0) return null;

    if (data.saker?.saker?.length === 0) {
        return <Link className='innsynisak-lenke' to={{
            pathname: 'saksoversikt',
            search: location.search,
        }} onClick={() => {
            scroll(0, 0);
            loggNavigasjon('saksoversikt', 'se alle saker', location.pathname);
        }}>
            <div className='innsynisak__se-alle-saker'>
                <FileFolder />
                <BodyShort> Se saker på tvers av alle
                    virksomheter {antallSakerForAlleBedrifter !== undefined ? `(${antallSakerForAlleBedrifter})` : ''}</BodyShort>
            </div>
        </Link>;
    }

    return (
        <div className='innsynisak'>
            <div className='innsynisak__header'>
                <div className='innsynisak__tittel'>
                    <Heading size='small' level='2'>
                        Siste saker
                    </Heading>
                    <OmSaker />
                </div>
                <Link className='innsynisak-lenke' to={{
                    pathname: 'saksoversikt',
                    search: location.search,
                }} onClick={() => {
                    scroll(0, 0);
                    loggNavigasjon('saksoversikt', 'se alle saker', location.pathname);
                }}>
                    <div className='innsynisak__se-alle-saker'>
                        <FileFolder />
                        <BodyShort> Se alle
                            saker {antallSakerForAlleBedrifter !== undefined ? `(${antallSakerForAlleBedrifter})` : null}</BodyShort>
                    </div>
                </Link>
            </div>

            <SaksListe saker={data?.saker.saker} />
        </div>
    );
};

export default SisteSaker;