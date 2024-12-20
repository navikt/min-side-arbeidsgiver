import React from 'react';
import Tekstboks from './Tekstboks';
import NyFaneIkon from './NyFaneIkon';
import { Office1 as UnderenhetIkon } from '@navikt/ds-icons';
import { enhetsregisteretUnderenhetLink } from '../../lenker';
import './Underenhet.css';
import { LenkeMedLogging } from '../../GeneriskeElementer/LenkeMedLogging';
import { Underenhet as UnderenhetType } from '../../api/enhetsregisteretApi';
import { BodyShort, Heading, HStack, Label } from '@navikt/ds-react';
import { KontaktinfoUnderenhet } from './Kontaktinfo';
import { formatOrgNr } from '../../utils/util';

interface Props {
    underenhet: UnderenhetType;
}

const Underenhet = ({ underenhet }: Props) => {
    const adresse = underenhet?.beliggenhetsadresse;

    return (
        <>
            <Tekstboks className="underenhet-navn">
                <Label htmlFor={"underenhet_navn_felt"}>Underenhet</Label>
                <Heading id={"underenhet_navn_felt"} size="medium" level="2" className="underenhet-info__navn">
                    <UnderenhetIkon aria-hidden="true" title="underenhet" />
                    {underenhet.navn}
                </Heading>
            </Tekstboks>

            <Tekstboks>
                <Label htmlFor={'underenhet_organisasjonsnummer_felt'}>Organisasjonsnummer</Label>
                <BodyShort id={'underenhet_organisasjonsnummer_felt'}>
                    {formatOrgNr(underenhet.organisasjonsnummer)}
                </BodyShort>
            </Tekstboks>

            <Tekstboks className="underenhet-adresse">
                <Label htmlFor={'underenhet_adresse_felt'}>Beliggenhetsadresse</Label>
                <div id={'underenhet_adresse_felt'}>
                    <BodyShort>{adresse?.adresse?.[0] ?? ''}</BodyShort>
                    <BodyShort>
                        {adresse?.postnummer ?? ''} {adresse?.poststed ?? ''}
                    </BodyShort>
                </div>
            </Tekstboks>

            <Tekstboks className="underenhet-kode">
                <Label htmlFor={'underenhet_næringskoder_felt'}>Næringskoder</Label>
                <div id="underenhet_næringskoder_felt">
                    <BodyShort>
                        {underenhet.naeringskode1
                            ? `${underenhet.naeringskode1.kode}. ${underenhet.naeringskode1.beskrivelse}`
                            : ''}
                    </BodyShort>
                    <BodyShort>
                        {underenhet.naeringskode2
                            ? `${underenhet.naeringskode2.kode}. ${underenhet.naeringskode2.beskrivelse}`
                            : ''}
                    </BodyShort>
                    <BodyShort>
                        {underenhet.naeringskode3
                            ? `${underenhet.naeringskode3.kode}. ${underenhet.naeringskode3.beskrivelse}`
                            : ''}
                    </BodyShort>
                </div>
            </Tekstboks>
            <Tekstboks>
                <LenkeMedLogging
                    href={enhetsregisteretUnderenhetLink(underenhet.organisasjonsnummer)}
                    loggLenketekst="Flere opplysninger om virksomheten hos Enhetsregisteret"
                >
                    <span>Flere opplysninger for virksomheten hos Enhetsregisteret</span>
                    <NyFaneIkon />
                </LenkeMedLogging>
            </Tekstboks>
            <HStack gap="6">
                <KontaktinfoUnderenhet />
            </HStack>
        </>
    );
};

export default Underenhet;
