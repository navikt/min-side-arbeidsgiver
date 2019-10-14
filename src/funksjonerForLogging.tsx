import { OrganisasjonFraEnhetsregisteret } from './Objekter/Organisasjoner/OrganisasjonFraEnhetsregisteret';
import { Organisasjon } from './Objekter/Organisasjoner/OrganisasjonerFraAltinn';
import { logInfo } from './utils/metricsUtils';
import { hentOverordnetEnhet, hentUnderenhet } from './api/enhetsregisteretApi';

export const hentInfoOgLoggInformasjon = async (organisasjon?: Organisasjon) => {
    if (organisasjon) {
        const infoFraEreg: OrganisasjonFraEnhetsregisteret = await hentUnderenhet(
            organisasjon.OrganizationNumber
        );
        logInfo('besok fra organisasjon: ' + organisasjon.Name, organisasjon.OrganizationNumber);

        if (infoFraEreg.organisasjonsnummer !== '') {
            logInfo(
                'antall ansatte: ' +
                    infoFraEreg.antallAnsatte +
                    'kommune: ' +
                    infoFraEreg.forretningsadresse.kommune
            );
            const parent: OrganisasjonFraEnhetsregisteret = await hentOverordnetEnhet(
                organisasjon.ParentOrganizationNumber
            );
            logInfo('antall ansatte: ' + infoFraEreg.antallAnsatte);
            logInfo(
                'juridisk enhet: ' + parent.navn,
                parent.organisasjonsnummer +
                    'antall ansatte i juridisk enhet' +
                    parent.antallAnsatte
            );
        }

        if (infoFraEreg.organisasjonsnummer === '') {
            logInfo('Klarte ikke hente underenhet fra Ereg');
        }
    }
};
