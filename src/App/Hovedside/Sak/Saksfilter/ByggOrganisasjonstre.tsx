import {Organisasjon, OrganisasjonEnhet} from "./Virksomhetsmeny/Virksomhetsmeny";
import {hentAlleJuridiskeEnheter} from "@navikt/bedriftsmeny/";
import {sorted} from "../../../../utils/util";

const erHovedenhet = (organisasjon: Organisasjon): boolean =>
    !(organisasjon.OrganizationNumber === "") &&
    (organisasjon.Type === 'Enterprise' || organisasjon.OrganizationForm === 'FLI');

const erUnderenhet = (organisasjon: Organisasjon): boolean =>
    !(organisasjon.OrganizationNumber === "")
    && ['BEDR', 'AAFY'].includes(organisasjon.OrganizationForm);


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
                hovedenhet: hovedenhet,
                underenheter: underenheter.filter(underenhet =>
                    underenhet.ParentOrganizationNumber === hovedenhet.OrganizationNumber
                )
            })
        )
        .filter(orgtre => orgtre.underenheter.length > 0);
    return sorted(resultat, a => a.hovedenhet.Name);
}
