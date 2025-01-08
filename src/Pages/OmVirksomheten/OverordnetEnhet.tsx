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
import { KontonummerOverordnetEnhet } from './Kontonummer';
import { useOrganisasjonerOgTilgangerContext } from '../OrganisasjonerOgTilgangerProvider';

interface Props {
    overordnetenhet: Hovedenhet;
}

const OverordnetEnhet = ({ overordnetenhet }: Props) => {
    const { organisasjoner } = useOrganisasjonerOgTilgangerContext();
    const { forretningsadresse, postadresse } = overordnetenhet;
    const enhetstype =
        overordnetenhet.organisasjonsform?.kode === 'ORGL' ? 'Organisasjonsledd' : 'Hovedenhet';
    console.log("overorndet");
    console.log(overordnetenhet);
    return (
        <div>
            <Tekstboks className="overordnetenhet-navn">
                <Label htmlFor={"overordnetenhet_navn_felt"}>{enhetstype}</Label>
                <Heading id={"overordnetenhet_navn_felt"} size="medium" level="2" className="overordnet-enhet-info__navn">
                    <JuridiskEnhetIkon aria-hidden="true" title="juridisk enhet" />
                    {overordnetenhet.navn}
                </Heading>
            </Tekstboks>

            <div className="overordnet-enhet-info__container">
                <Tekstboks className="overordnetenhet-orgnr">
                    <Label htmlFor={"overordnetenhet_organisasjonsnummer_felt"}>Organisasjonsnummer</Label>
                    <BodyShort id={"overordnetenhet_organisasjonsnummer_felt"}> {formatOrgNr(overordnetenhet.organisasjonsnummer)}</BodyShort>
                </Tekstboks>

                <Tekstboks className="overordnetenhet-orgform">
                    <Label htmlFor={"overordnetenhet_organisasjonsform_felt"}>Organisasjonsform</Label>
                    <BodyShort id={"overordnetenhet_organisasjonsform_felt"}>
                        {' '}
                        {overordnetenhet.organisasjonsform
                            ? overordnetenhet.organisasjonsform.beskrivelse
                            : ''}
                    </BodyShort>
                </Tekstboks>

                <Tekstboks className="overordnetenhet-adresse1">
                    <Label htmlFor={"overordnetenhet_forretningsadresse_felt"}>Forretningsadresse</Label>
                    <BodyShort id={"overordnetenhet_forretningsadresse_felt"}>
                        {' '}
                        {forretningsadresse ? forretningsadresse.adresse?.[0] : ''}
                    </BodyShort>
                    <BodyShort>
                        {forretningsadresse?.postnummer ?? ''} {forretningsadresse?.poststed ?? ''}
                    </BodyShort>
                </Tekstboks>

                <Tekstboks className="overordnetenhet-adresse2">
                    <Label htmlFor={"overordnetenhet_postadresse_felt"}>Postadresse</Label>
                    <BodyShort id={"overordnetenhet_postadresse_felt"}> {postadresse?.adresse?.[0] ?? ''} </BodyShort>
                    <BodyShort>
                        {postadresse?.postnummer ?? ''} {postadresse?.poststed ?? ''}
                    </BodyShort>
                </Tekstboks>
            </div>

            <Tekstboks className="overordnetenhet-kode">
                <Label htmlFor={"overordnetenhet_næringskoder_felt"}>Næringskoder</Label>
                <BodyShort id={"overordnetenhet_næringskoder_felt"}>
                    {overordnetenhet.naeringskode1
                        ? `${overordnetenhet.naeringskode1.kode}. ${overordnetenhet.naeringskode1.beskrivelse}`
                        : ''}
                </BodyShort>
            </Tekstboks>

            {(overordnetenhet.hjemmeside ?? '') !== '' && (
                <Tekstboks className="overordnetenhet-hjemmeside">
                    <Label htmlFor={"overordnetenhet_hjemmeside_felt"}>Hjemmeside</Label>
                    <BodyShort id={"overordnetenhet_hjemmeside_felt"}>{overordnetenhet.hjemmeside}</BodyShort>
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
            <HStack gap="6" align={"start"}>
                <KontaktinfoOverordnetEnhet overordnetEnhet={overordnetenhet} />
                {organisasjoner[overordnetenhet.organisasjonsnummer].altinntilgang.endreBankkontonummerForRefusjoner && (
                    <KontonummerOverordnetEnhet overordnetEnhet={overordnetenhet} />
                )}
            </HStack>
        </div>
    );
};

export default OverordnetEnhet;
