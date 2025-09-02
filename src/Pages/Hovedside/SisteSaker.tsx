import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './SisteSaker.css';
import { useSaker } from '../Saksoversikt/useSaker';
import { Heading, Tag } from '@navikt/ds-react';
import { SakSortering } from '../../api/graphql-types';
import { InternalLenkepanelMedLogging } from '../../GeneriskeElementer/LenkepanelMedLogging';
import { useOrganisasjonsDetaljerContext } from '../OrganisasjonsDetaljerContext';
import { useOrganisasjonerOgTilgangerContext } from '../OrganisasjonerOgTilgangerContext';
import { logAnalyticsEvent } from '../../utils/analytics';

const Saksikon = () => (
    <svg
        className="saker-lenke__ikon"
        width="56"
        height="56"
        viewBox="0 0 56 56"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-hidden="true"
    >
        <rect width="56" height="56" rx="4" fill="#C1CB33" fillOpacity="0.5" />
        <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M21.3172 20.3204C21.043 20.1924 20.7188 20.2418 20.4951 20.4455C20.2714 20.6492 20.192 20.9673 20.2937 21.2523L22.7036 28L20.2937 34.7478C20.192 35.0327 20.2714 35.3509 20.4951 35.5546C20.7188 35.7583 21.043 35.8076 21.3172 35.6797L36.3172 28.6797C36.5812 28.5564 36.75 28.2914 36.75 28C36.75 27.7086 36.5812 27.4436 36.3172 27.3204L21.3172 20.3204ZM24.0286 27.25L22.3104 22.4392L34.2265 28L22.3104 33.5609L24.0286 28.75H27.5C27.9142 28.75 28.25 28.4142 28.25 28C28.25 27.5858 27.9142 27.25 27.5 27.25H24.0286Z"
            fill="#262626"
        />
    </svg>
);

const SisteSaker = () => {
    const { valgtOrganisasjon, antallSakerForAlleBedrifter } = useOrganisasjonsDetaljerContext();
    const { organisasjonsInfo } = useOrganisasjonerOgTilgangerContext();
    const location = useLocation();

    const { loading, data } = useSaker(0, {
        side: 1,
        virksomheter: new Set(),
        tekstsoek: '',
        sortering: SakSortering.NyesteFørst,
        sakstyper: [],
        oppgaveFilter: [],
    });

    useEffect(() => {
        if (!loading && data) {
            logAnalyticsEvent('komponent-lastet', {
                komponent: 'siste-saker',
                totaltAntallSaker: data.saker.totaltAntallSaker,
            });
        }
    }, [loading, data]);

    if (loading || !data) return null;

    if ((antallSakerForAlleBedrifter ?? 0) === 0) return null;

    const antallVirksomheter = Object.values(organisasjonsInfo).filter((org) =>
        ['BEDR', 'AAFY'].includes(org.organisasjon.organisasjonsform)
    ).length;

    const sakstyper = Array(
        ...new Set<string>(
            data.saker.sakstyper.map(({ navn }) =>
                navn === 'Inntektsmelding' ? 'Inntektsmelding sykepenger' : navn
            )
        )
    ).sort();

    return (
        <InternalLenkepanelMedLogging
            to={{
                pathname: 'saksoversikt',
                search: location.search,
            }}
            onClick={() => {
                scroll(0, 0);
            }}
            loggLenketekst={`Saker for dine virksomheter`}
        >
            <div className="siste_saker">
                <Saksikon />
                <Heading level="2" size="small">
                    {`Saker ${
                        antallVirksomheter > 1 ? 'for dine virksomheter' : ''
                    } (${antallSakerForAlleBedrifter})`}
                </Heading>
                <div className="saker-lenke__undertekst">
                    {sakstyper.map((sakstype) => (
                        <Tag key={sakstype} size="small" variant="neutral">
                            {sakstype}
                        </Tag>
                    ))}
                </div>
            </div>
        </InternalLenkepanelMedLogging>
    );
};

export default SisteSaker;
