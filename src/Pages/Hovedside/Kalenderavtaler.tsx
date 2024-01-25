import './Kalenderavtaler.css';
import React, { FunctionComponent } from 'react';
import { BodyShort, Heading, Tag } from '@navikt/ds-react';
import { ChevronRightIcon } from '@navikt/aksel-icons';

type Kalenderavtale = {
    tittel: string;
    tidspunkt: string;
    status: string;
    sted?: string;
    digitalt: boolean;
};

export const Kalenderavtaler: FunctionComponent = () => {
    const avtaler: Kalenderavtale[] = [
        {
            tittel: 'Dialogmøte Mikke',
            tidspunkt: '4. februar, kl 15.15',
            sted: 'NAV Grünerløkka',
            status: 'Du ønsker å avlyse',
            digitalt: false,
        },
        {
            tittel: 'Dialogmøte Minni',
            tidspunkt: '4. februar, kl 15.15 - 16.00',
            status: 'Du har takket ja',
            digitalt: true,
        },
        {
            tittel: 'Dialogmøte Dolly',
            tidspunkt: '4. februar, kl 15.15 - 16.00',
            status: 'Du ønsker å endre tid og sted  ',
            digitalt: false,
        },
        {
            tittel: 'Dialogmøte Donald',
            tidspunkt: '4. februar, kl 15.15 - 16.00',
            status: 'Svar på invitasjonen',
            sted: 'NAV Grünerløkka',
            digitalt: true,
        },
    ];

    return (
        <>
            <Heading level="2" size="medium" className="saksoversikt__skjult-header-uu">
                Kalenderavtaler
            </Heading>
            <div className="kalenderavtaler">
                {avtaler.map((avtale, index) => (
                    <Kalenderavtale key={index} {...avtale} />
                ))}
            </div>
        </>
    );
};

const Kalenderavtale: FunctionComponent<Kalenderavtale> = ({
    tittel,
    tidspunkt,
    sted,
    status,
    digitalt,
}) => (
    <a className="kalenderavtale" href="#">
        <BodyShort className="kalenderavtaler_tittel" size="large">
            {' '}
            {tittel}
        </BodyShort>
        <span className="kalenderavtaler_linje" />
        <ChevronRightIcon
            width="2rem"
            height="2rem"
            aria-hidden={true}
            className="kalenderavtaler_chevron"
        />
        <BodyShort size="large" className="kalenderavtale_tidspunkt">
            {tidspunkt}
        </BodyShort>
        <div className="kalenderavtale_statussted">
            <Tag
                size="small"
                variant={
                    status === 'Du har takket ja'
                        ? 'success-moderate'
                        : status === 'Svar på invitasjonen'
                        ? 'warning-moderate'
                        : 'neutral-moderate'
                }
            >
                {status}
            </Tag>
        </div>
    </a>
);
