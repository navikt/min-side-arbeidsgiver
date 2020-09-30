import { Tilgang } from '../../LoginBoundary';
import { TjenesteInfoProps } from './TjenesteInfo/TjenesteInfo';
import { OrganisasjonInfo } from '../../OrganisasjonerOgTilgangerProvider';
import { beOmTilgangIAltinnLink } from '../../../lenker';
import { alleAltinntjenster, AltinnId } from '../../../altinn/tjenester';

interface AndreTilganger {
    tilgangTilSyfo: Tilgang;
}
export const genererTekstbokser = (
    organisasjon: OrganisasjonInfo | undefined,
    { tilgangTilSyfo }: AndreTilganger
): TjenesteInfoProps[] => {
    const listeMedProps: TjenesteInfoProps[] = [];

    if (tilgangTilSyfo === Tilgang.IKKE_TILGANG) {
        listeMedProps.push({
            overskrift: 'Dine sykmeldte',
            innholdstekst: 'Gå til digitale sykmeldinger og følg opp sykmeldte du har ansvar for.',
            lenkeTilBeOmTjeneste: 'syfo',
            erSyfo: true,
        });
    }

    if (organisasjon) {
        const orgnr = organisasjon.organisasjon.OrganizationNumber;
        const tilgang = organisasjon.altinnSkjematilgang;

        const altinnIdIRekkefølge: AltinnId[] = [
            'pam',
            'iaweb',
            'arbeidstrening',
            'arbeidsforhold',
            'midlertidigLønnstilskudd',
            'varigLønnstilskudd',
            'ekspertbistand',
            'inkluderingstilskudd',
            'mentortilskudd',
            'inntektsmelding',
        ];

        for (let altinnId of altinnIdIRekkefølge) {
            if (!tilgang[altinnId]) {
                const tjeneste = alleAltinntjenster[altinnId];
                listeMedProps.push({
                    overskrift: tjeneste.navn,
                    innholdstekst: tjeneste.beOmTilgangBeskrivelse,
                    lenkeTilBeOmTjeneste: beOmTilgangIAltinnLink(
                        orgnr,
                        tjeneste.tjenestekode,
                        tjeneste.tjenesteversjon
                    ),
                    erSyfo: false,
                });
            }
        }
    }
    return listeMedProps;
};
