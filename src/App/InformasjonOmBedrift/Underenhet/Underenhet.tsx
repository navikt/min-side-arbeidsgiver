import React from 'react';
import { Normaltekst, Systemtittel } from 'nav-frontend-typografi';
import Tekstboks from '../Tekstboks/Tekstboks';
import NyFaneIkon from '../ikoner/NyFaneIkon';
import UnderenhetIkon from '../ikoner/UnderenhetIkon';
import { enhetsregisteretUnderenhetLink } from '../../../lenker';
import './Underenhet.less';
import { LenkeMedLogging } from '../../../GeneriskeElementer/LenkeMedLogging';
import { Enhet } from '../../../api/enhetsregisteretApi';

interface Props {
    underenhet: Enhet;
}

const Underenhet = ({ underenhet }: Props) => {
    const adresse = underenhet?.beliggenhetsadresse
    return (
        <>
            <div className="underenhet-info">
                <Tekstboks className="underenhet-navn">
                    <Normaltekst>Virksomhet</Normaltekst>
                    <Systemtittel className="underenhet-info__navn">
                        <UnderenhetIkon />
                        {underenhet.navn}
                    </Systemtittel>
                </Tekstboks>
                <Tekstboks className="underenhet-orgnr">
                    <Normaltekst>Virksomhetsnummer</Normaltekst>
                    <Normaltekst>
                        {underenhet.organisasjonsnummer}
                    </Normaltekst>
                </Tekstboks>

                <Tekstboks  className="underenhet-adresse">
                    <Normaltekst>Beliggenhetsadresse</Normaltekst>
                    <Normaltekst>
                        { adresse?.adresse?.[0] ?? '' }
                    </Normaltekst>
                    <Normaltekst>
                        { adresse?.postnummer ?? '' }
                        { ' ' }
                        { adresse?.poststed ?? '' }
                    </Normaltekst>
                </Tekstboks>

                <Tekstboks className="underenhet-kode">
                    <Normaltekst>
                        Næringskoder
                    </Normaltekst>
                    <Normaltekst>
                        {underenhet.naeringskode1
                            ? `${underenhet.naeringskode1.kode}. ${underenhet.naeringskode1.beskrivelse}`
                            : ''}
                    </Normaltekst>
                    <Normaltekst>
                        {underenhet.naeringskode2
                            ? `${underenhet.naeringskode2.kode}. ${underenhet.naeringskode2.beskrivelse}`
                            : ''}
                    </Normaltekst>
                    <Normaltekst>
                        {underenhet.naeringskode3
                            ? `${underenhet.naeringskode3.kode}. ${underenhet.naeringskode3.beskrivelse}`
                            : ''}
                    </Normaltekst>
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
            <hr />
        </>
    );
};

export default Underenhet;
