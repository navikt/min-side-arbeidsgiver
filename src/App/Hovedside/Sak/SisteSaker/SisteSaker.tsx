import React, { ReactNode, useContext, useEffect, useState } from 'react';
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
import { PaperplaneIcon, BellDotFillIcon } from '@navikt/aksel-icons';

const ANTALL_FORSIDESAKER: number = 3;

interface SakerLenkeProps {
    ikon: ReactNode;
    overskrift: string;
    undertekst: string;
}

const SakerLenke = ({ ikon, overskrift, undertekst }: SakerLenkeProps) => {
    const [hover, setHover] = useState(false);
    const ikonId = "ikon-id" + overskrift.toLowerCase().replace(' ', '-');
    const lenkeId = "lenke-id" + overskrift.toLowerCase().replace(' ', '-');

    addEventListener('mouseover', (e) => {
        const target = e.target as HTMLElement;
        if (target.id === ikonId) {
            setHover(true);
        }
        else if (target.id === lenkeId) {
            setHover(true);
        }
        else {
            setHover(false);
        }
    })
    return <div className='saker-lenke'>
        <Link
            id={lenkeId}
            className={'saker-lenke__ikon' + (hover ? ' saker-lenke__ikon__hover' : '')}
            to={{
                pathname: 'saksoversikt',
                search: location.search,
            }}
            onClick={() => {
                scroll(0, 0);
                loggNavigasjon('saksoversikt', 'se alle saker', location.pathname);
            }}
        >
            {ikon}
        </Link>

        <Link className={'saker-lenke_headerlenke' + (hover ? ' saker-lenke_headerlenke__hover' : '')}
              to={{
                  pathname: 'saksoversikt',
                  search: location.search,
              }}
              onClick={() => {
                  scroll(0, 0);
                  loggNavigasjon('saksoversikt', 'se alle saker', location.pathname);
              }}
        >
            <Heading id={ikonId} size={'small'}>
                {overskrift}
            </Heading>
        </Link>
        <BodyShort className='saker-lenke__undertekst'>{undertekst}</BodyShort>

    </div>;
};

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
    console.log(data.saker.sakstyper);
    // @ts-ignore
    return (
        <>
            <div className='siste_saker'>
                <Heading size='small' level='2'> Saker for dine virksomheter </Heading>
                <div className='siste_saker_valg_container'>
                    <SakerLenke
                        ikon={<PaperplaneIcon title={`Antall saker (${antallSakerForAlleBedrifter})`} />}
                        overskrift={`Antall saker (${antallSakerForAlleBedrifter})`}
                        undertekst='Inntektsmelding, Permittering, Nedbemanning ...'
                    />
                    <SakerLenke
                        ikon={<BellDotFillIcon title='Med oppgaver' />}
                        overskrift='Med oppgaver'
                        undertekst='Inntektsmelding 53 st, Lønnstilskudd 3 st ...' />
                </div>
            </div>
        </>
    );
};

export default SisteSaker;