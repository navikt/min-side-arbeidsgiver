import { useParams } from 'react-router-dom';
import { Brodsmulesti } from '../Banner';
import React, { useContext } from 'react';
import { BodyShort, Heading } from '@navikt/ds-react';
import './Artikkel.css';
import { OrganisasjonsDetaljerContext } from '../OrganisasjonDetaljerProvider';
import { LenkepanelMedLogging } from '../../GeneriskeElementer/LenkepanelMedLogging';

type ArtikkelId = keyof typeof artikler;

const artikler = {};

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
                href={`/min-side-arbeidsgiver/Artikkel/${artikkelId}`}
            >
                <Heading size="medium" level="3">
                    {tittel}
                </Heading>
                <BodyShort> {tekst}</BodyShort>
            </LenkepanelMedLogging>
        );
    }
    return null;
};

export const Artikkel = () => {
    const { id } = useParams();

        return (
            <Alert className={'app-finner-ikke-siden'} variant={'error'}>
                Finner ikke siden.{' '}
                <Link as={RouterLink} to={'/'}>
                    Gå til Min side arbeidsgiver
                </Link>
            </Alert>
        );
    }

    if (id in artikler) {
        const { tittel, komponent } = artikler[id as ArtikkelId];
        return (
            <>
                <Brodsmulesti
                    brodsmuler={[
                        {
                            url: '/Artikkel',
                            title: tittel,
                            handleInApp: true,
                        },
                    ]}
                />
                <ArtikkelBanner tittel={tittel} />
                <div className={'artikkel-container'}>{komponent}</div>
            </>
        );
    }
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
