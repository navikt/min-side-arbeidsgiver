import { Link as RouterLink, useParams } from 'react-router-dom';
import { Brodsmulesti } from '../Banner';
import React, { useContext } from 'react';
import { Alert, BodyShort, Heading, Link } from '@navikt/ds-react';
import './Artikkel.css';
import { OrganisasjonsDetaljerContext } from '../OrganisasjonDetaljerProvider';
import { LenkepanelMedLogging } from '../../GeneriskeElementer/LenkepanelMedLogging';
import { useRawArtikkelHtml } from './useRawHtmlFromStorage';
import { gittMiljo } from '../../utils/environment';

type ArtikkelId = keyof typeof artikler;

type Artikkel = {
    tittel: string;
    lenkeTekst: string;
    objectName: string;
};
const artikler = {
    kurs_reddet_kommunen_fra_bemanningskrise: {
        tittel: 'Sliter dere med bemanning innen helsesektoren?',
        lenkeTekst:
            'Les om hvordan Larvik kommune manglet pleieassistenter, men utviklet en god idé sammen med NAV.',
        objectName: 'kurs_reddet_kommunen_fra_bemanningskrise.html',
    },
};
export const Artikler: Record<ArtikkelId, Artikkel> = artikler;

export const ArtikkelLenke = ({
    artikkelId,
    tittel,
    tekst,
}: {
    artikkelId: ArtikkelId;
    tittel: string;
    tekst: string;
}) => {
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    if (valgtOrganisasjon?.organisasjonstypeForØversteLedd === 'KOMM') {
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
    }
    return null;
};

export const Artikkel = () => {
    const { id } = useParams();
    const { tittel, objectName } = artikler[id as ArtikkelId] ?? {};
    const artikkelHtml = useRawArtikkelHtml({ objectName });

    if (artikkelHtml === undefined) {
        return (
            <Alert className={'app-finner-ikke-siden'} variant={'error'}>
                Finner ikke siden.{' '}
                <Link as={RouterLink} to={'/'}>
                    Gå til Min side arbeidsgiver
                </Link>
            </Alert>
        );
    }

    return (
        <>
            <Brodsmulesti
                brodsmuler={[
                    {
                        url: `/artikkel/${id}`,
                        title: tittel,
                        handleInApp: true,
                    },
                ]}
            />
            <ArtikkelBanner tittel={tittel} />
            <div
                className={'artikkel-container'}
                dangerouslySetInnerHTML={{ __html: artikkelHtml }}
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
