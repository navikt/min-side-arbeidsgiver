import { hentAlleJuridiskeEnheter } from '@navikt/bedriftsmeny/';
import { sorted } from '../utils/util';
import * as Record from '../utils/Record';
import { OrganisasjonEnhet, OrganisasjonInfo } from './OrganisasjonerOgTilgangerProvider';
import { Organisasjon } from '../altinn/organisasjon';

const erHovedenhet = (organisasjon: Organisasjon): boolean =>
    (organisasjon.ParentOrganizationNumber ?? "").trim().length === 0

const erUnderenhet = (organisasjon: Organisasjon): boolean =>
    !erHovedenhet(organisasjon)

export async function byggOrganisasjonstre(
    orgMap: Record<string, OrganisasjonInfo> | undefined
): Promise<OrganisasjonEnhet[] | undefined> {
    if (orgMap === undefined) {
        return undefined
    }
    const organisasjoner = sorted(Record.values(orgMap).map(it => it.organisasjon), org => org.Name);

    const hovedenheter = organisasjoner.filter(erHovedenhet)
    const underenheter = organisasjoner.filter(erUnderenhet)

    const hovedenhetersOrgnr = new Set(hovedenheter.map(organisasjon => organisasjon.OrganizationNumber));
    const manglendeHovedenheterOrgnr = underenheter
        .map(organisasjon => organisasjon.ParentOrganizationNumber)
        .filter((ParentOrganizationNumber): ParentOrganizationNumber is string => ParentOrganizationNumber !== null && !hovedenhetersOrgnr.has(ParentOrganizationNumber))

    hovedenheter.push(... await hentAlleJuridiskeEnheter(manglendeHovedenheterOrgnr))

    const resultat = hovedenheter
        .map(hovedenhet => ({
                hovedenhet: hovedenhet,
                underenheter: underenheter.filter(underenhet =>
                    underenhet.ParentOrganizationNumber === hovedenhet.OrganizationNumber
                )
            })
        )
        .filter(orgtre => orgtre.underenheter.length > 0);
    return sorted(resultat, a => a.hovedenhet.Name)
}
