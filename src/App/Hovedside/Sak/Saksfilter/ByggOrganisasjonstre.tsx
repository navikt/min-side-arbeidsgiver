import {Organisasjon, OrganisasjonEnhet} from "./Virksomhetsmeny/Virksomhetsmeny";
import {hentAlleJuridiskeEnheter} from "@navikt/bedriftsmeny/lib/hentAlleJuridiskeEnheter";

const erHovedenhet = (organisasjon: Organisasjon): boolean =>
    !(organisasjon.OrganizationNumber === "") &&
    (organisasjon.Type === 'Enterprise' || organisasjon.OrganizationForm === 'FLI');

const erUnderenhet = (organisasjon: Organisasjon): boolean =>
    !(organisasjon.OrganizationNumber === "")
    && ['BEDR', 'AAFY'].includes(organisasjon.OrganizationForm);


const sorted = <T extends any>(array: T[], on: (e:T) => string): T[] =>
    [...array].sort((a, b) => on(a).localeCompare(on(b)));

export async function byggOrganisasjonstre(
    organisasjoner: Organisasjon[]
): Promise<OrganisasjonEnhet[]> {
    organisasjoner = sorted(organisasjoner, org => org.Name);

    const hovedenheter = organisasjoner.filter(erHovedenhet);
    const underenheter = organisasjoner.filter(erUnderenhet);

    const hovedenhetersOrgnr = new Set(hovedenheter.map(enhet => enhet.OrganizationNumber));
    const manglendeHovedenheterOrgnr = underenheter
        .map(org => org.ParentOrganizationNumber)
        .filter((ParentOrganizationNumber): ParentOrganizationNumber is string => ParentOrganizationNumber !== null && !hovedenhetersOrgnr.has(ParentOrganizationNumber))

    hovedenheter.push(... await hentAlleJuridiskeEnheter(manglendeHovedenheterOrgnr))

    const resultat = hovedenheter
        .map(hovedenhet => ({
                juridiskEnhet: hovedenhet,
                organisasjoner: underenheter.filter(underenhet =>
                    underenhet.ParentOrganizationNumber === hovedenhet.OrganizationNumber
                )
            })
        )
        .filter(orgtre => orgtre.organisasjoner.length > 0);
    return sorted(resultat, a => a.juridiskEnhet.Name);
}
