import React from 'react';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import { OrganisasjonFraEnhetsregisteret, } from '../../../Objekter/Organisasjoner/OrganisasjonFraEnhetsregisteret';
import Tekstboks from '../Tekstboks/Tekstboks';
import NyFaneIkon from '../ikoner/NyFaneIkon';
import { enhetsregisteretOverordnetenhetLink } from '../../../lenker';
import JuridiskEnhetIkon from '../ikoner/JuridiskEnhetIkon';
import './OverordnetEnhet.less';
import { LenkeMedLogging } from '../../../GeneriskeElementer/LenkeMedLogging';

interface Props {
    overordnetenhet: OrganisasjonFraEnhetsregisteret;
}

const OverordnetEnhet = ({overordnetenhet}: Props) => {
    return (
        <div className="overordnet-enhet-info">
            <Tekstboks className="overordnetenhet-navn">
                <Normaltekst>Overordnet enhet</Normaltekst>
                <Systemtittel className="overordnet-enhet-info__navn"><JuridiskEnhetIkon />{overordnetenhet.navn}</Systemtittel>
            </Tekstboks>

            <div className="overordnet-enhet-info__container">
                <Tekstboks className="overordnetenhet-orgnr">
                    <Normaltekst>Organisasjonsnummer</Normaltekst>
                    <Normaltekst> {overordnetenhet.organisasjonsnummer}</Normaltekst>
                </Tekstboks>

                <Tekstboks className="overordnetenhet-orgform">
                    <Normaltekst>Organisasjonsform</Normaltekst>
                    <Normaltekst> {overordnetenhet.organisasjonsform ? overordnetenhet.organisasjonsform.beskrivelse : ''}</Normaltekst>
                </Tekstboks>

                <Tekstboks className="overordnetenhet-adresse1">
                    <Normaltekst>Forretningsadresse</Normaltekst>
                    <Normaltekst> { overordnetenhet.forretningsadresse ? overordnetenhet.forretningsadresse.adresse[0] : ''}</Normaltekst>
                    <Normaltekst>
                        {overordnetenhet.forretningsadresse ? `${overordnetenhet.forretningsadresse.postnummer} ${overordnetenhet.forretningsadresse.poststed}` : ''}
                    </Normaltekst>
                </Tekstboks>

                <Tekstboks className="overordnetenhet-adresse2">
                    <Normaltekst>Postadresse</Normaltekst>
                    <Normaltekst> { overordnetenhet.postadresse ? overordnetenhet.postadresse.adresse[0] : ''}</Normaltekst>
                    <Normaltekst>
                        {overordnetenhet.postadresse ? `${overordnetenhet.postadresse.postnummer} ${overordnetenhet.postadresse.poststed}` : ''}
                    </Normaltekst>
                </Tekstboks>
            </div>

            <Tekstboks className="overordnetenhet-kode">
                <Normaltekst>
                    Næringskoder
                </Normaltekst>
                <Normaltekst>
                    {overordnetenhet.naeringskode1 ? `${overordnetenhet.naeringskode1.kode}. ${overordnetenhet.naeringskode1.beskrivelse}` : ''}
                </Normaltekst>
            </Tekstboks>

            {(overordnetenhet.hjemmeside ?? '') !== '' &&
                <Tekstboks className="overordnetenhet-hjemmeside">
                    <Normaltekst>
                        Hjemmeside
                    </Normaltekst>
                    <Normaltekst>
                        {overordnetenhet.hjemmeside}
                    </Normaltekst>
                </Tekstboks>
            }

            <LenkeMedLogging
                href={enhetsregisteretOverordnetenhetLink(overordnetenhet.organisasjonsnummer)}
                loggTjeneste="informasjon om virksomhet"
                loggTekst="Flere opplysinger for overordnet enhet hos Enhetsregisteret"
                target="_blank"
            >
                <span>Flere opplysninger for overordnet enhet hos Enhetsregisteret</span>
                <NyFaneIkon />
            </LenkeMedLogging>
        </div>
    );
};

export default OverordnetEnhet;
