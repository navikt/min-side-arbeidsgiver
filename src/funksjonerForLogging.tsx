import { OrganisasjonFraEnhetsregisteret } from './Objekter/Organisasjoner/OrganisasjonFraEnhetsregisteret';
import { Organisasjon } from './Objekter/Organisasjoner/OrganisasjonerFraAltinn';
import { logInfo } from './utils/metricsUtils';
import { hentOverordnetEnhet, hentUnderenhet } from './api/enhetsregisteretApi';

export const hentInfoOgLoggInformasjon = async (organisasjon?: Organisasjon) => {
    if (organisasjon) {
        const infoFraEreg: OrganisasjonFraEnhetsregisteret = await hentUnderenhet(
            organisasjon.OrganizationNumber
        );
        logInfo(
            'besok fra organisasjon: ' + organisasjon.Name,
            organisasjon.OrganizationNumber + ' ' + infoFraEreg.forretningsadresse.kommune
        );
        logInfo('antall ansatte: ' + infoFraEreg.antallAnsatte);
        const parent: OrganisasjonFraEnhetsregisteret = await hentOverordnetEnhet(
            organisasjon.ParentOrganizationNumber
        );
        logInfo('antall ansatte: ' + infoFraEreg.antallAnsatte);
        logInfo(
            'juridisk enhet: ' + parent.navn,
            parent.organisasjonsnummer + 'antall ansatte i juridisk enhet' + parent.antallAnsatte
        );
    }
};
