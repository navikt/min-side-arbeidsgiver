import { Alert, BodyLong, Button, Heading, Modal, Select, VStack } from '@navikt/ds-react';
import React, { ChangeEvent, useState } from 'react';
import { ArrowRightIcon } from '@navikt/aksel-icons';
import { gittMiljo } from '../../../../utils/environment';

type Tilgang =
    | 'inntektsmeldingSykepenger'
    | 'inntektsmeldingSykdomIFamilien'
    | 'inntektsmeldingForeldrepenger';

interface Props {
    isOpen: boolean;
    onRequestClose: () => void;
    tilganger: Record<Tilgang, boolean>;
}

const omsorgspengerYtelse = [
    {
        label: 'Omsorgspenger',
        value: 'OMSORGSPENGER',
        lenke: gittMiljo({
            prod: 'https://arbeidsgiver.nav.no/k9-im-dialog/opprett?ytelseType=OMSORGSPENGER',
            other: 'https://arbeidsgiver.intern.dev.nav.no/k9-im-dialog/opprett?ytelseType=OMSORGSPENGER',
        }),
        tilgang: 'inntektsmeldingSykdomIFamilien' as Tilgang,
    },
];

const inntektsmeldingYtelser: { label: string; value: string; lenke: string; tilgang: Tilgang }[] =
    [
        {
            label: 'Sykepenger',
            value: 'SYKEPENGER',
            lenke: gittMiljo({
                prod: 'https://arbeidsgiver.nav.no/im-dialog/initiering',
                other: 'https://arbeidsgiver.intern.dev.nav.no/im-dialog/initiering',
            }),
            tilgang: 'inntektsmeldingSykepenger',
        },
        {
            label: 'Foreldrepenger',
            value: 'FORELDREPENGER',
            lenke: gittMiljo({
                prod: 'https://arbeidsgiver.nav.no/fp-im-dialog/agi?ytelseType=FORELDREPENGER',
                other: 'https://arbeidsgiver.intern.dev.nav.no/fp-im-dialog/agi?ytelseType=FORELDREPENGER',
            }),
            tilgang: 'inntektsmeldingForeldrepenger',
        },
        {
            label: 'Svangerskapspenger',
            value: 'SVANGERSKAPSPENGER',
            lenke: gittMiljo({
                prod: 'https://arbeidsgiver.nav.no/fp-im-dialog/agi?ytelseType=SVANGERSKAPSPENGER',
                other: 'https://arbeidsgiver.intern.dev.nav.no/fp-im-dialog/agi?ytelseType=SVANGERSKAPSPENGER',
            }),
            tilgang: 'inntektsmeldingForeldrepenger',
        },
        {
            label: 'Pleiepenger i livets sluttfase',
            value: 'PLEIEPENGER_I_LIVETS_SLUTTFASE',
            lenke: gittMiljo({
                prod: 'https://arbeidsgiver.nav.no/k9-im-dialog/opprett?ytelseType=PLEIEPENGER_I_LIVETS_SLUTTFASE',
                other: 'https://arbeidsgiver.intern.dev.nav.no/k9-im-dialog/opprett?ytelseType=PLEIEPENGER_I_LIVETS_SLUTTFASE',
            }),
            tilgang: 'inntektsmeldingSykdomIFamilien',
        },
        {
            label: 'Pleiepenger sykt barn',
            value: 'PLEIEPENGER_SYKT_BARN',
            lenke: gittMiljo({
                prod: 'https://arbeidsgiver.nav.no/k9-im-dialog/opprett?ytelseType=PLEIEPENGER_SYKT_BARN',
                other: 'https://arbeidsgiver.intern.dev.nav.no/k9-im-dialog/opprett?ytelseType=PLEIEPENGER_SYKT_BARN',
            }),
            tilgang: 'inntektsmeldingSykdomIFamilien',
        },
        {
            label: 'Opplæringspenger',
            value: 'OPPLÆRINGSPENGER',
            lenke: gittMiljo({
                prod: 'https://arbeidsgiver.nav.no/k9-im-dialog/opprett?ytelseType=OPPL%C3%86RINGSPENGER',
                other: 'https://arbeidsgiver.intern.dev.nav.no/k9-im-dialog/opprett?ytelseType=OPPL%C3%86RINGSPENGER',
            }),
            tilgang: 'inntektsmeldingSykdomIFamilien',
        },
        ...omsorgspengerYtelse,
    ];

type InntektsmeldingYtelse = (typeof inntektsmeldingYtelser)[number];

export default function OpprettManuellInntektsmeldingModal({
    isOpen,
    onRequestClose,
    tilganger,
}: Props) {
    const [valgtYtelse, setValgtYtelse] = useState<InntektsmeldingYtelse | null>(null);
    const [error, setError] = useState<string | null>(null);

    const inntektsmeldingYtelserMedTilgang = inntektsmeldingYtelser.filter(
        (ytelse) => tilganger[ytelse.tilgang]
    );

    const handleOpprettManuellInntektsmelding = () => {
        if (!valgtYtelse) {
            setError('Ingen ytelse er valgt.');
            return;
        }

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
                        {inntektsmeldingYtelserMedTilgang.map((option) => (
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
