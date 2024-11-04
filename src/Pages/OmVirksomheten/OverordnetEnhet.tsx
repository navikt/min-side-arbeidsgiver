import React from 'react';
import Tekstboks from './Tekstboks';
import NyFaneIkon from './NyFaneIkon';
import { enhetsregisteretOverordnetenhetLink } from '../../lenker';
import { Office2 as JuridiskEnhetIkon } from '@navikt/ds-icons';
import './OverordnetEnhet.css';
import { LenkeMedLogging } from '../../GeneriskeElementer/LenkeMedLogging';
import { BodyShort, Heading, HStack, Label } from '@navikt/ds-react';
import { KontaktinfoOverordnetEnhet } from './Kontaktinfo';
import { Hovedenhet } from '../../api/enhetsregisteretApi';
import { formatOrgNr } from '../../utils/util';

interface Props {
    overordnetenhet: Hovedenhet;
}

const OverordnetEnhet = ({ overordnetenhet }: Props) => {
    const { forretningsadresse, postadresse } = overordnetenhet;
    const enhetstype =
        overordnetenhet.organisasjonsform?.kode === 'ORGL' ? 'Organisasjonsledd' : 'Hovedenhet';
    return (
        <div>
            <Tekstboks className="overordnetenhet-navn">
                <Label>{enhetstype}</Label>
                <Heading size="medium" level="2" className="overordnet-enhet-info__navn">
                    <JuridiskEnhetIkon aria-hidden="true" title="juridisk enhet" />
                    {overordnetenhet.navn}
                </Heading>
            </Tekstboks>

            <div className="overordnet-enhet-info__container">
                <Tekstboks className="overordnetenhet-orgnr">
                    <Label>Organisasjonsnummer</Label>
                    <BodyShort> {formatOrgNr(overordnetenhet.organisasjonsnummer)}</BodyShort>
                </Tekstboks>

                <Tekstboks className="overordnetenhet-orgform">
                    <Label>Organisasjonsform</Label>
                    <BodyShort>
                        {' '}
                        {overordnetenhet.organisasjonsform
                            ? overordnetenhet.organisasjonsform.beskrivelse
                            : ''}
                    </BodyShort>
                </Tekstboks>

                <Tekstboks className="overordnetenhet-adresse1">
                    <Label>Forretningsadresse</Label>
                    <BodyShort>
                        {' '}
                        {forretningsadresse ? forretningsadresse.adresse?.[0] : ''}
                    </BodyShort>
                    <BodyShort>
                        {forretningsadresse?.postnummer ?? ''} {forretningsadresse?.poststed ?? ''}
                    </BodyShort>
                </Tekstboks>

                <Tekstboks className="overordnetenhet-adresse2">
                    <Label>Postadresse</Label>
                    <BodyShort> {postadresse?.adresse?.[0] ?? ''} </BodyShort>
                    <BodyShort>
                        {postadresse?.postnummer ?? ''} {postadresse?.poststed ?? ''}
                    </BodyShort>
                </Tekstboks>
            </div>

            <Tekstboks className="overordnetenhet-kode">
                <Label>Næringskoder</Label>
                <BodyShort>
                    {overordnetenhet.naeringskode1
                        ? `${overordnetenhet.naeringskode1.kode}. ${overordnetenhet.naeringskode1.beskrivelse}`
                        : ''}
                </BodyShort>
            </Tekstboks>

            {(overordnetenhet.hjemmeside ?? '') !== '' && (
                <Tekstboks className="overordnetenhet-hjemmeside">
                    <Label>Hjemmeside</Label>
                    <BodyShort>{overordnetenhet.hjemmeside}</BodyShort>
                </Tekstboks>
            )}
            <Tekstboks>
                <LenkeMedLogging
                    href={enhetsregisteretOverordnetenhetLink(overordnetenhet.organisasjonsnummer)}
                    loggLenketekst="Flere opplysinger for overordnet enhet hos Enhetsregisteret"
                >
                    <span>Flere opplysninger for overordnet enhet hos Enhetsregisteret</span>
                    <NyFaneIkon />
                </LenkeMedLogging>
            </Tekstboks>
            <HStack gap="6">
                <KontaktinfoOverordnetEnhet overordnetEnhet={overordnetenhet} />
            </HStack>
        </div>
    );
};

export default OverordnetEnhet;
