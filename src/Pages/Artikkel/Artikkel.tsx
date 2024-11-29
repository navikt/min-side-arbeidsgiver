import { Link as RouterLink, useParams } from 'react-router-dom';
import { Brodsmulesti, Spinner } from '../Banner';
import React, { useContext, useEffect } from 'react';
import { Alert, BodyShort, Heading, Link } from '@navikt/ds-react';
import './Artikkel.css';
import { OrganisasjonsDetaljerContext } from '../OrganisasjonDetaljerProvider';
import { LenkepanelMedLogging } from '../../GeneriskeElementer/LenkepanelMedLogging';
import { useRawArtikkelHtml } from './useRawHtmlFromStorage';
import { OrganisasjonInfo } from '../OrganisasjonerOgTilgangerProvider';
import * as Record from '../../utils/Record';
import { loggNavigasjon } from '../../utils/funksjonerForAmplitudeLogging';
import amplitude from '../../utils/amplitude';

type Artikkel = {
    lenketittel: string;
    lenketekst: string;
    tittel: string;
    objectName: string;
    tilgangssjekk: (valgtOrganisasjon: OrganisasjonInfo) => boolean;
};

const artikler: Record<string, Artikkel> = {
    saferoad_ansetter_ved_hjelp_av_nav: {
        lenketittel: '',
        lenketekst: '',
        tittel: '– Vi liker ikke å snakke om «inkludering»',
        objectName: 'saferoad_ansetter_ved_hjelp_av_nav.html',
        tilgangssjekk: (valgtOrganisasjon: OrganisasjonInfo) => false,
    },
};

export const Artikler = () => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    if (!valgtOrganisasjon) {
        return null;
    }

    return (
        <>
            {Record.mapToArray(artikler, (artikkelId, artikkel) => ({
                ...artikkel,
                artikkelId,
            }))
                .filter(({ tilgangssjekk }) => tilgangssjekk(valgtOrganisasjon))
                .map(({ artikkelId, lenketittel, lenketekst }) => (
                    <ArtikkelLenke
                        key={artikkelId}
                        artikkelId={artikkelId}
                        tittel={lenketittel}
                        tekst={lenketekst}
                    />
                ))}
        </>
    );
};

type ArtikkelId = keyof typeof artikler;
export const ArtikkelLenke = ({
    artikkelId,
    tittel,
    tekst,
}: {
    artikkelId: ArtikkelId;
    tittel: string;
    tekst: string;
}) => {
    useEffect(() => {
        amplitude.logEvent('komponent-lastet', {
            komponent: 'artikkel-lenke',
            artikkelId,
        });
    }, []);

    return (
        <LenkepanelMedLogging
            loggLenketekst={tittel}
            href={`/min-side-arbeidsgiver/artikkel/${artikkelId}`}
        >
            <Heading size="medium" level="3">
                {tittel}
            </Heading>
            <BodyShort>{tekst}</BodyShort>
        </LenkepanelMedLogging>
    );
};

/**
 * denne funksjonen legger til loggNavigasjon på alle lenker i en artikkel
 */
const registerLinkClickListeners = (e: HTMLDivElement) => {
    e.querySelectorAll('a').forEach((a) => {
        a.addEventListener('click', (event) => {
            if (event.target === null) {
                return;
            }

            if ((event.target as HTMLAnchorElement).href !== undefined) {
                loggNavigasjon(
                    (event.target as HTMLAnchorElement).href,
                    a.innerText,
                    window.location.pathname
                );
            }
        });
    });
};

export const Artikkel = () => {
    const { id } = useParams();
    const { tittel, objectName } = artikler[id as ArtikkelId] ?? {};
    const { rawHtml: artikkelHtml, isError } = useRawArtikkelHtml({ objectName });

    if (isError) {
        return (
            <Alert className={'app-finner-ikke-siden'} variant={'error'}>
                Finner ikke siden.{' '}
                <Link as={RouterLink} to={'/'}>
                    Gå til Min side arbeidsgiver
                </Link>
            </Alert>
        );
    }

    if (artikkelHtml === undefined) {
        return <Spinner />;
    }

    return (
        <>
            <Brodsmulesti/>
            <ArtikkelBanner tittel={tittel} />
            <div
                className={'artikkel-container'}
                dangerouslySetInnerHTML={{ __html: artikkelHtml }}
                ref={(e) => {
                    e !== null && registerLinkClickListeners(e);
                }}
            ></div>
        </>
    );
};

const ArtikkelBanner = ({ tittel }: { tittel: string }) => {
    return (
        <div className="artikkel-banner">
            <Heading className="artikkel-banner-header" size="xlarge" level="1">
                {tittel}
            </Heading>
        </div>
    );
};
