import { SkjemaMedOrganisasjonerMedTilgang } from '../../../api/dnaApi';
import { Tilgang } from '../../LoginBoundary';
import { TjenesteInfoProps } from './TjenesteInfo/TjenesteInfo';
import { AltinnSkjema } from '../../../OrganisasjonsListeProvider';
import { beOmTilgangIAltinnLink } from '../../../lenker';
import { Tilganger } from '../../../OrganisasjonDetaljerProvider';

export const genererTekstbokser = (
    tilganger: Tilganger,
    altinnTjenester: SkjemaMedOrganisasjonerMedTilgang[],
    valgtOrgNr: string
): TjenesteInfoProps[] => {
    const listeMedProps: TjenesteInfoProps[] = [];
    if (tilganger.tilgangTilSyfo  === Tilgang.IKKE_TILGANG) {
        listeMedProps.push({
            overskrift: 'Dine sykmeldte',
            innholdstekst: 'Gå til digitale sykmeldinger og følg opp sykmeldte du har ansvar for.',
            lenkeTilBeOmTjeneste: 'syfo',
            erSyfo: true,
        });
    }

    if (valgtOrgNr && valgtOrgNr !== '') {
        if (tilganger.tilgangTilPam === Tilgang.IKKE_TILGANG) {
            listeMedProps.push({
                overskrift: 'Rekruttering',
                innholdstekst: 'Gå til Arbeidsplassen for å rekruttere og lage stillingsannonser.',
                lenkeTilBeOmTjeneste: beOmTilgangIAltinnLink(valgtOrgNr, '5078', '1'),
            });
        }
        if (tilganger.tilgangTilIAWeb === Tilgang.IKKE_TILGANG) {
            listeMedProps.push({
                overskrift: 'Sykfraværsstatistikk',
                innholdstekst: 'Oversikt over sykefravær i din virksomhet og bransje.',
                lenkeTilBeOmTjeneste: beOmTilgangIAltinnLink(valgtOrgNr, '3403', '2'),
            });
        }
        if (tilganger.tilgangTilArbeidstreningsavtaler === Tilgang.IKKE_TILGANG) {
            listeMedProps.push({
                overskrift: 'Arbeidstrening',
                innholdstekst:
                    'Arbeidstrening er et tiltak som gir arbeidssøker mulighet til å prøve seg i arbeid, få relevant erfaring og skaffe seg en ordinær jobb. Arbeidstrening i din bedrift kan bidra til at arbeidssøkeren når målene sine. ',
                lenkeTilBeOmTjeneste: beOmTilgangIAltinnLink(valgtOrgNr, '5332', '2', '1'),
            });
        }

        if (tilganger.tilgangTilArbeidsforhold === Tilgang.IKKE_TILGANG) {
            listeMedProps.push({
                overskrift: 'Arbeidsforhold',
                innholdstekst:
                    'Få oversikt over alle arbeidsforhold du som arbeidsgiver har rapportert inn via A-meldingen. Her kan du kontrollere opplysningene og se hva som er registrert i arbeidsgiver- og arbeidstakerregisteret (Aa-registeret). ',
                lenkeTilBeOmTjeneste: beOmTilgangIAltinnLink(valgtOrgNr, '5441', '1'),
            });
        }

        if (tilganger.tilgangTilMidlertidigLonnstilskudd === Tilgang.IKKE_TILGANG) {
            listeMedProps.push({
                overskrift: 'Midlertidig lønnstilskudd',
                innholdstekst:
                    'Få tilgang til avtaler om midlertidig lønnstilskudd i din virksomhet. Lønnstilskudd kan gis dersom du ansetter personer som har problemer med å komme inn på arbeidsmarkedet.',
                lenkeTilBeOmTjeneste: beOmTilgangIAltinnLink(valgtOrgNr, '5516', '1'),
            });
        }

        if (tilganger.tilgangTilVarigLonnstilskudd === Tilgang.IKKE_TILGANG) {
            listeMedProps.push({
                overskrift: 'Varig lønnstilskudd',
                innholdstekst:
                    'Få tilgang til avtaler om varig lønnstilskudd i din virksomhet. Lønnstilskudd kan gis dersom du ansetter personer som har problemer med å komme inn på arbeidsmarkedet.',
                lenkeTilBeOmTjeneste: beOmTilgangIAltinnLink(valgtOrgNr, '5516', '2'),
            });
        }

        altinnTjenester.forEach(tjeneste => {
            const harTilgangTilTjeneste = sjekkOmTilgangTilAltinnSkjema(valgtOrgNr, tjeneste);
            /* Tjenestene Arbeidsforhold, Midlertidg/varig lønnstilskudd og Arbeidstrening
            er allerede lagt til ved å bruke tjenesteboksTilgangsArray */
            if (
                !harTilgangTilTjeneste &&
                tjeneste.Skjema.navn !== 'Arbeidstrening' &&
                tjeneste.Skjema.navn !== 'Arbeidsforhold' &&
                tjeneste.Skjema.navn !== 'Midlertidig lønnstilskudd' &&
                tjeneste.Skjema.navn !== 'Varig lønnstilskudd' &&
                tjeneste.Skjema.navn !== 'Lønnstilskudd'
            ) {
                listeMedProps.push(genererPropsForAltinnTjeneste(tjeneste.Skjema, valgtOrgNr));
            }
        });
    }
    return listeMedProps;
};

const sjekkOmTilgangTilAltinnSkjema = (orgnr: string, skjema: SkjemaMedOrganisasjonerMedTilgang) =>
    skjema.OrganisasjonerMedTilgang.some(org => org.OrganizationNumber === orgnr);

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

const genererPropsForAltinnTjeneste = (skjema: AltinnSkjema, orgnr: string): TjenesteInfoProps => ({
    overskrift: skjema.navn,
    lenkeTilBeOmTjeneste: beOmTilgangIAltinnLink(orgnr, skjema.kode, skjema.versjon),
    innholdstekst: innholdstekst[skjema.navn] ?? '',
});
