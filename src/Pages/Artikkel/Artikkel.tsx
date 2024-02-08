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
    const { hovedenhetOrganisasjonsform } = useContext(OrganisasjonsDetaljerContext);
    if (hovedenhetOrganisasjonsform !== 'KOMM') {
        return null;
    }
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
};

export const Artikkel = () => {
    const { id } = useParams();

    if (id === undefined || id === null || !(id in artikler)) return null;

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
