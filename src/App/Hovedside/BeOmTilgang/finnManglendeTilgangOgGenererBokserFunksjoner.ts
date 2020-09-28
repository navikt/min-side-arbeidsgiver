import { Tilgang } from '../../LoginBoundary';
import { TjenesteInfoProps } from './TjenesteInfo/TjenesteInfo';
import {
    altinnSkjemakoder,
    AltinnSkjemanavn,
    OrganisasjonInfo,
} from '../../OrganisasjonsListeProvider';
import { beOmTilgangIAltinnLink } from '../../../lenker';

interface AndreTilganger {
    tilgangTilSyfo: Tilgang,
    tilgangTilPam: Tilgang,
}
export const genererTekstbokser = (
    organisasjon: OrganisasjonInfo | undefined,
    {tilgangTilSyfo, tilgangTilPam }: AndreTilganger
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

        if (tilgangTilPam === Tilgang.IKKE_TILGANG) {
            listeMedProps.push({
                overskrift: 'Rekruttering',
                innholdstekst: 'Gå til Arbeidsplassen for å rekruttere og lage stillingsannonser.',
                lenkeTilBeOmTjeneste: beOmTilgangIAltinnLink(orgnr, '5078', '1'),
            });
        }

        if (!organisasjon.iawebtilgang) {
            listeMedProps.push({
                overskrift: 'Sykfraværsstatistikk',
                innholdstekst: 'Oversikt over sykefravær i din virksomhet og bransje.',
                lenkeTilBeOmTjeneste: beOmTilgangIAltinnLink(orgnr, '3403', '2'),
            });
        }
        if (!tilgang.Arbeidstrening) {
            listeMedProps.push({
                overskrift: 'Arbeidstrening',
                innholdstekst:
                    'Arbeidstrening er et tiltak som gir arbeidssøker mulighet til å prøve seg i arbeid, få relevant erfaring og skaffe seg en ordinær jobb. Arbeidstrening i din bedrift kan bidra til at arbeidssøkeren når målene sine. ',
                lenkeTilBeOmTjeneste: beOmTilgangIAltinnLink(orgnr, '5332', '2', '1'),
            });
        }

        if (!tilgang.Arbeidsforhold) {
            listeMedProps.push({
                overskrift: 'Arbeidsforhold',
                innholdstekst:
                    'Få oversikt over alle arbeidsforhold du som arbeidsgiver har rapportert inn via A-meldingen. Her kan du kontrollere opplysningene og se hva som er registrert i arbeidsgiver- og arbeidstakerregisteret (Aa-registeret). ',
                lenkeTilBeOmTjeneste: beOmTilgangIAltinnLink(orgnr, '5441', '1'),
            });
        }

        if (!tilgang['Midlertidig lønnstilskudd']) {
            listeMedProps.push({
                overskrift: 'Midlertidig lønnstilskudd',
                innholdstekst:
                    'Få tilgang til avtaler om midlertidig lønnstilskudd i din virksomhet. Lønnstilskudd kan gis dersom du ansetter personer som har problemer med å komme inn på arbeidsmarkedet.',
                lenkeTilBeOmTjeneste: beOmTilgangIAltinnLink(orgnr, '5516', '1'),
            });
        }

        if (!tilgang['Varig lønnstilskudd']) {
            listeMedProps.push({
                overskrift: 'Varig lønnstilskudd',
                innholdstekst:
                    'Få tilgang til avtaler om varig lønnstilskudd i din virksomhet. Lønnstilskudd kan gis dersom du ansetter personer som har problemer med å komme inn på arbeidsmarkedet.',
                lenkeTilBeOmTjeneste: beOmTilgangIAltinnLink(orgnr, '5516', '2'),
            });
        }

        const andreSkjema: AltinnSkjemanavn[] = [
            'Ekspertbistand', 'Inkluderingstilskudd', 'Mentortilskudd', 'Inntektsmelding'
        ];
        for (let skjema of andreSkjema) {
            if (!tilgang[skjema]) {
                listeMedProps.push(genererPropsForAltinnTjeneste(skjema, orgnr));
            }
        }
    }
    return listeMedProps;
};

const innholdstekst: { [key: string]: string } = {
    Mentortilskudd:
        'Få tilgang til å søke om mentortilskudd i Altinn. Du kan søke om mentortilskudd for å få dekket frikjøp av en arbeidskollega som kan gi praktisk hjelp, veiledning og opplæring for personer som gjennomfører arbeidsmarkedstiltak. ',
    Inkluderingstilskudd:
        'Få tilgang til å søke om inkluderingstilskudd i Altinn. Du kan søke om tilskudd for å dekke merkostnader du som arbeidsgiver har ved tilrettelegging av arbeidsplassen.',
    Ekspertbistand:
        'Få tilgang til å søke ekspertbistand i Altinn. Du kan søke om ekspertbistand hvis en arbeidstaker har lange og/eller hyppige sykefravær.',
    Inntektsmelding:
        'Få tilgang til å sende digital inntektsmelding når arbeidstakeren skal ha sykepenger, foreldrepenger, svangerskapspenger, pleiepenger, omsorgspenger eller opplæringspenger.',
};

const genererPropsForAltinnTjeneste = (
    skjemanavn: AltinnSkjemanavn,
    orgnr: string
): TjenesteInfoProps => ({
    overskrift: skjemanavn,
    lenkeTilBeOmTjeneste: beOmTilgangIAltinnLink(
        orgnr,
        altinnSkjemakoder[skjemanavn].kode,
        altinnSkjemakoder[skjemanavn].versjon
    ),
    innholdstekst: innholdstekst[skjemanavn] ?? '',
});
