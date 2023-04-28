import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { Link, To, useLocation } from 'react-router-dom';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import './SisteSaker.css';
import { useSaker } from '../useSaker';
import { loggNavigasjon } from '../../../../utils/funksjonerForAmplitudeLogging';
import amplitude from '../../../../utils/amplitude';
import { BodyShort, Button, Heading } from '@navikt/ds-react';
import { useSessionStateForside } from '../Saksoversikt/useOversiktSessionStorage';
import { OppgaveTilstand, SakSortering } from '../../../../api/graphql-types';
import { Collapse, Expand } from '@navikt/ds-icons';
import { BellDotFillIcon, PaperplaneIcon } from '@navikt/aksel-icons';
import { OrganisasjonerOgTilgangerContext } from '../../../OrganisasjonerOgTilgangerProvider';
import { sorted } from '../../../../utils/util';

const ANTALL_FORSIDESAKER: number = 3;

interface SakerLenkeProps {
    ikon: ReactNode;
    overskrift: string;
    undertekst: string;
    to: To;
    ekspander: boolean;
    setEkspander: (ekspander: boolean) => void;
}

const SakerLenke = ({ ikon, overskrift, undertekst, to, ekspander, setEkspander}: SakerLenkeProps) => {
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
            tabIndex={-1}
            id={lenkeId}
            className={'saker-lenke__ikon' + (hover ? ' saker-lenke__ikon__hover' : '')}
            to={to}
            onClick={() => {
                scroll(0, 0);
                loggNavigasjon('saksoversikt', 'se alle saker', location.pathname);
            }}
        >
            {ikon}
        </Link>

        <Link className={'saker-lenke_headerlenke' + (hover ? ' saker-lenke_headerlenke__hover' : '')}
              to={to}
              onClick={() => {
                  scroll(0, 0);
                  loggNavigasjon('saksoversikt', 'se alle saker', location.pathname);
              }}
        >
            <Heading id={ikonId} size={'small'}>
                {overskrift}
            </Heading>
        </Link>
        <BodyShort
            className={'saker-lenke__undertekst ' + (ekspander ? ' saker_lenke__undertekst_ekspandert' : " ")}
        >{undertekst}</BodyShort>
        <Button
            tabIndex ={-1}
            className="saker-lenke__ekspander-knapp"
            size="xsmall"
            variant="tertiary"
            style={{color: "black"}}
            onClick={() => setEkspander(!ekspander)
        }
        >
            {ekspander ? <Collapse aria-hidden/> : <Expand aria-hidden/>}
        </Button>

    </div>;
};

const SisteSaker = () => {
    const { valgtOrganisasjon, antallSakerForAlleBedrifter } = useContext(OrganisasjonsDetaljerContext);
    const {organisasjoner} = useContext(OrganisasjonerOgTilgangerContext);
    const [ekspander, setEkspander] = useState(false);
    const location = useLocation();

    const { loading, data } = useSaker(ANTALL_FORSIDESAKER, {
        side: 1,
        virksomheter: 'ALLEBEDRIFTER',
        tekstsoek: '',
        sortering: SakSortering.Frist,
        sakstyper: [],
        oppgaveTilstand: [],
    });

    const sakerMedOppgaverRespons = useSaker(ANTALL_FORSIDESAKER, {
        side: 1,
        virksomheter: 'ALLEBEDRIFTER',
        tekstsoek: '',
        sortering: SakSortering.Frist,
        sakstyper: [],
        oppgaveTilstand: [OppgaveTilstand.Ny],
    });

    const sakerMedOppgaver = sakerMedOppgaverRespons.data?.saker

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

    const antallVirksomheter = Object.values(organisasjoner).filter(org => ["BEDR", "AAFY"].includes(org.organisasjon.OrganizationForm)).length;

    return (
        <div className='siste_saker'>
            <Heading size='small' level='2'> Saker {antallVirksomheter > 1 ? "for dine virksomheter" : "" } </Heading>
            <div className='siste_saker_valg_container'>
                <SakerLenke
                    to = {{
                        pathname: 'saksoversikt',
                        search: location.search,
                    }}
                    ikon={<PaperplaneIcon aria-hidden/>}
                    overskrift={`Antall saker (${antallSakerForAlleBedrifter})`}
                    undertekst={sorted(data.saker.sakstyper, sakstype => sakstype.navn).map((sakstype) => `${sakstype.navn} ${sakstype.antall}`).join(', ')}
                    ekspander={ekspander}
                    setEkspander={setEkspander}
                />
                <SakerLenke
                    to = {{
                        pathname: 'saksoversikt',
                        search: location.search + "&oppgaveTilstand=NY"
                    }}
                    ikon={<BellDotFillIcon aria-hidden/>}
                    overskrift={'Med oppgaver ' + (((sakerMedOppgaver?.totaltAntallSaker ?? 0) > 0) ? `(${sakerMedOppgaver?.totaltAntallSaker})` : '')}
                    undertekst={sorted(sakerMedOppgaver?.sakstyper ?? [], sakstype => sakstype.navn).map(
                        (sakstype) => `${sakstype.navn} ${sakstype.antall}`).join(', ')
                    }
                    ekspander={ekspander}
                    setEkspander={setEkspander}
                />
            </div>
        </div>
    );
};

export default SisteSaker;