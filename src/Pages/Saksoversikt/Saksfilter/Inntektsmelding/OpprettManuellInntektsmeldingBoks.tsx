import React, { useEffect, useState } from 'react';
import { Alert, BodyShort, Button, Heading, VStack } from '@navikt/ds-react';
import { PlusIcon } from '@navikt/aksel-icons';
import OpprettManuellInntektsmeldingModal from './OpprettManuellInntektsmeldingModal';

type Props = {
    openOnMount?: boolean;
};

export default function OpprettManuellInntektsmeldingBoks({ openOnMount }: Props) {
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);

    useEffect(() => {
        if (openOnMount === true) {
            setModalIsOpen(true);
        }
    }, [openOnMount]);
    return (
        <>
            <Alert variant="info">
                <VStack gap="2">
                    <Heading size="xsmall">Opprett manuell inntektsmelding</Heading>
                    <VStack gap="5">
                        <BodyShort size="small">
                            Bruk kun hvis dere ikke har mottatt oppgave om å sende inntektsmelding
                            for en ansatt.
                        </BodyShort>
                        <Button
                            variant="secondary"
                            icon={<PlusIcon aria-hidden="true" />}
                            size="small"
                            onClick={() => setModalIsOpen(true)}
                        >
                            Opprett inntektsmelding
                        </Button>
                    </VStack>
                </VStack>
            </Alert>
            <OpprettManuellInntektsmeldingModal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
            />
        </>
    );
}
