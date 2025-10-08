import { Alert, BodyLong, Button, Heading, Modal, Select, VStack } from '@navikt/ds-react';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { ArrowRightIcon } from '@navikt/aksel-icons';
import {
    opplaeringspengerURL,
    opprettInntektsmeldingForeldrepenger,
    opprettInntektsmeldingSvangerskapspenger,
    opprettInntektsmeldingURL,
    pleiepengerILivetsSluttfaseURL,
    pleiepengerSyktBarnURL,
} from '../../../../lenker';
import { logAnalyticsEvent, loggNavigasjon } from '../../../../utils/analytics';
import { gittMiljo } from '../../../../utils/environment';

interface Props {
    isOpen: boolean;
    onRequestClose: () => void;
}

const inntektsmeldingYtelserDev = [
    {
        label: 'Sykepenger',
        value: 'SYKEPENGER',
        lenke: opprettInntektsmeldingURL,
    },
    {
        label: 'Foreldrepenger',
        value: 'FORELDREPENGER',
        lenke: opprettInntektsmeldingForeldrepenger,
    },
    {
        label: 'Svangerskapspenger',
        value: 'SVANGERSKAPSPENGER',
        lenke: opprettInntektsmeldingSvangerskapspenger,
    },
    {
        label: 'Pleiepenger i livets sluttfase',
        value: 'PLEIEPENGER_I_LIVETS_SLUTTFASE',
        lenke: pleiepengerILivetsSluttfaseURL,
    },
    {
        label: 'Pleiepenger sykt barn',
        value: 'PLEIEPENGER_SYKT_BARN',
        lenke: pleiepengerSyktBarnURL,
    },
    {
        label: 'Opplæringspenger',
        value: 'OPPLÆRINGSPENGER',
        lenke: opplaeringspengerURL,
    },
]

const inntektsmeldingYtelserProd = [
    {
        label: 'Sykepenger',
        value: 'SYKEPENGER',
        lenke: opprettInntektsmeldingURL,
    },
    {
        label: 'Foreldrepenger',
        value: 'FORELDREPENGER',
        lenke: opprettInntektsmeldingForeldrepenger,
    },
    {
        label: 'Svangerskapspenger',
        value: 'SVANGERSKAPSPENGER',
        lenke: opprettInntektsmeldingSvangerskapspenger,
    },
]


const inntektsmeldingYtelser = gittMiljo({
    prod: inntektsmeldingYtelserProd,
    other: inntektsmeldingYtelserDev,
})


type InntektsmeldingYtelse = (typeof inntektsmeldingYtelser)[number];

export default function OpprettManuellInntektsmeldingModal({ isOpen, onRequestClose }: Props) {
    const [valgtYtelse, setValgtYtelse] = useState<InntektsmeldingYtelse | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        logAnalyticsEvent('komponent-lastet', {
            komponent: 'OpprettManuellInntektsmeldingModal',
        });
    }, []);

    const handleOpprettManuellInntektsmelding = () => {
        if (!valgtYtelse) {
            setError('Ingen ytelse er valgt.');
            return;
        }

        loggNavigasjon(valgtYtelse.lenke, valgtYtelse.label);

        window.location.href = valgtYtelse.lenke;
    };

    const handleSelectYtelse = (e: ChangeEvent<HTMLSelectElement>) => {
        const valgtYtelse = e.target.value;
        const selected =
            inntektsmeldingYtelser.find((ytelse) => ytelse.value === valgtYtelse) ?? null;

        setValgtYtelse(selected);

        if (Boolean(error)) {
            setError(null);
        }
    };

    return (
        <Modal
            open={isOpen}
            onClose={onRequestClose}
            aria-label="Opprett manuell inntektsmelding-modal"
            header={{
                heading: 'Opprett manuell inntektsmelding',
                closeButton: true,
            }}
        >
            <Modal.Body>
                <VStack gap="4">
                    <Alert variant="info">
                        <VStack gap="2">
                            <Heading size="small">
                                Bedriften får normalt et varsel når vi trenger inntektsmelding
                            </Heading>
                            <BodyLong>
                                Varsel med oppgave blir tilgjengelig i saksoversikten når den
                                ansatte har sendt inn søknad til oss. Manuell inntektsmelding er kun
                                tilgjengelig for unntakstilfeller.
                            </BodyLong>
                        </VStack>
                    </Alert>

                    <Select
                        label="Ytelsen som inntektsmeldingen gjelder"
                        value={valgtYtelse?.value}
                        onChange={handleSelectYtelse}
                    >
                        <option value="">Velg ytelse</option>
                        {inntektsmeldingYtelser.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </Select>

                    {Boolean(error) && <Alert variant="error">{error}</Alert>}
                </VStack>

                <Modal.Footer>
                    <Button
                        type="button"
                        onClick={handleOpprettManuellInntektsmelding}
                        icon={<ArrowRightIcon />}
                        iconPosition="right"
                    >
                        Opprett inntektsmelding
                    </Button>
                    <Button type="button" variant="secondary" onClick={onRequestClose}>
                        Avbryt
                    </Button>
                </Modal.Footer>
            </Modal.Body>
        </Modal>
    );
}
