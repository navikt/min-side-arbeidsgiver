import React from 'react';
import Tekstboks from '../Tekstboks/Tekstboks';
import NyFaneIkon from '../ikoner/NyFaneIkon';
import { Office1 as UnderenhetIkon } from '@navikt/ds-icons';
import { enhetsregisteretUnderenhetLink } from '../../../lenker';
import './Underenhet.css';
import { LenkeMedLogging } from '../../../GeneriskeElementer/LenkeMedLogging';
import { Enhet } from '../../../api/enhetsregisteretApi';
import { BodyShort, Heading } from '@navikt/ds-react';
import { KontaktinfoType, KontaktinfoUnderenhet } from '../Kontaktinfo';

interface Props {
    underenhet: Enhet;
    kontaktinfo: KontaktinfoType | null;
}

const Underenhet = ({ underenhet, kontaktinfo }: Props) => {
    const adresse = underenhet?.beliggenhetsadresse;
    return (
        <>
            <div className="underenhet-info">
                <Tekstboks className="underenhet-navn">
                    <BodyShort>Virksomhet</BodyShort>
                    <Heading size="medium" level="2" className="underenhet-info__navn">
                        <UnderenhetIkon aria-hidden="true" title="underenhet" />
                        {underenhet.navn}
                    </Heading>
                </Tekstboks>
                <Tekstboks className="underenhet-orgnr">
                    <BodyShort>Virksomhetsnummer</BodyShort>
                    <BodyShort>{underenhet.organisasjonsnummer}</BodyShort>
                </Tekstboks>

                <Tekstboks className="underenhet-adresse">
                    <BodyShort>Beliggenhetsadresse</BodyShort>
                    <BodyShort>{adresse?.adresse?.[0] ?? ''}</BodyShort>
                    <BodyShort>
                        {adresse?.postnummer ?? ''} {adresse?.poststed ?? ''}
                    </BodyShort>
                </Tekstboks>

                <Tekstboks className="underenhet-kode">
                    <BodyShort>Næringskoder</BodyShort>
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
                </Tekstboks>
                <LenkeMedLogging
                    href={enhetsregisteretUnderenhetLink(underenhet.organisasjonsnummer)}
                    loggLenketekst="Flere opplysninger om virksomheten hos Enhetsregisteret"
                    target="_blank"
                >
                    <span>Flere opplysninger for virksomheten hos Enhetsregisteret</span>
                    <NyFaneIkon />
                </LenkeMedLogging>
            </div>
            <KontaktinfoUnderenhet kontaktinfo={kontaktinfo} />
        </>
    );
};

export default Underenhet;
