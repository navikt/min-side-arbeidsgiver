import React from 'react';
import Tekstboks from '../Tekstboks/Tekstboks';
import NyFaneIkon from '../ikoner/NyFaneIkon';
import { enhetsregisteretOverordnetenhetLink } from '../../../lenker';
import { Office2 as JuridiskEnhetIkon } from '@navikt/ds-icons';
import './OverordnetEnhet.css';
import { LenkeMedLogging } from '../../../GeneriskeElementer/LenkeMedLogging';
import { Enhet } from '../../../api/enhetsregisteretApi';
import { BodyShort, Heading } from '@navikt/ds-react';
import { KontaktinfoHovedenhet, KontaktinfoType } from '../Kontaktinfo';

interface Props {
    overordnetenhet: Enhet;
    kontaktinfo: KontaktinfoType | null;
}

const OverordnetEnhet = ({ overordnetenhet, kontaktinfo }: Props) => {
    const { forretningsadresse, postadresse } = overordnetenhet;
    return (
        <div className="overordnet-enhet-info">
            <Tekstboks className="overordnetenhet-navn">
                <BodyShort>Overordnet enhet</BodyShort>
                <Heading size="medium" level="2" className="overordnet-enhet-info__navn">
                    <JuridiskEnhetIkon aria-hidden="true" title="juridisk enhet" />
                    {overordnetenhet.navn}
                </Heading>
            </Tekstboks>

            <div className="overordnet-enhet-info__container">
                <Tekstboks className="overordnetenhet-orgnr">
                    <BodyShort>Organisasjonsnummer</BodyShort>
                    <BodyShort> {overordnetenhet.organisasjonsnummer}</BodyShort>
                </Tekstboks>

                <Tekstboks className="overordnetenhet-orgform">
                    <BodyShort>Organisasjonsform</BodyShort>
                    <BodyShort>
                        {' '}
                        {overordnetenhet.organisasjonsform
                            ? overordnetenhet.organisasjonsform.beskrivelse
                            : ''}
                    </BodyShort>
                </Tekstboks>

                <Tekstboks className="overordnetenhet-adresse1">
                    <BodyShort>Forretningsadresse</BodyShort>
                    <BodyShort>
                        {' '}
                        {forretningsadresse ? forretningsadresse.adresse?.[0] : ''}
                    </BodyShort>
                    <BodyShort>
                        {forretningsadresse?.postnummer ?? ''} {forretningsadresse?.poststed ?? ''}
                    </BodyShort>
                </Tekstboks>

                <Tekstboks className="overordnetenhet-adresse2">
                    <BodyShort>Postadresse</BodyShort>
                    <BodyShort> {postadresse?.adresse?.[0] ?? ''} </BodyShort>
                    <BodyShort>
                        {postadresse?.postnummer ?? ''} {postadresse?.poststed ?? ''}
                    </BodyShort>
                </Tekstboks>
            </div>

            <Tekstboks className="overordnetenhet-kode">
                <BodyShort>Næringskoder</BodyShort>
                <BodyShort>
                    {overordnetenhet.naeringskode1
                        ? `${overordnetenhet.naeringskode1.kode}. ${overordnetenhet.naeringskode1.beskrivelse}`
                        : ''}
                </BodyShort>
            </Tekstboks>

            {(overordnetenhet.hjemmeside ?? '') !== '' && (
                <Tekstboks className="overordnetenhet-hjemmeside">
                    <BodyShort>Hjemmeside</BodyShort>
                    <BodyShort>{overordnetenhet.hjemmeside}</BodyShort>
                </Tekstboks>
            )}

            <LenkeMedLogging
                href={enhetsregisteretOverordnetenhetLink(overordnetenhet.organisasjonsnummer)}
                loggLenketekst="Flere opplysinger for overordnet enhet hos Enhetsregisteret"
                target="_blank"
            >
                <span>Flere opplysninger for overordnet enhet hos Enhetsregisteret</span>
                <NyFaneIkon />
            </LenkeMedLogging>
            <KontaktinfoHovedenhet kontaktinfo={kontaktinfo} />
        </div>
    );
};

export default OverordnetEnhet;
