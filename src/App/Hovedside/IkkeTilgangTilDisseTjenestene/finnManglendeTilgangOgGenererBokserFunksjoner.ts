import { SkjemaMedOrganisasjonerMedTilgang } from '../../../api/dnaApi';
import { Tilgang } from '../../LoginBoundary';
import { TjenesteInfoProps } from './TjenesteInfo/TjenesteInfo';
import { AltinnSkjema } from '../../../OrganisasjonsListeProvider';
import { beOmTilgangIAltinnLink } from '../../../lenker';

export const genererTekstbokser = (
    tjenesteboksTilgangsArray: Tilgang[],
    altinnTjenester: SkjemaMedOrganisasjonerMedTilgang[],
    valgtOrgNr?: string
): TjenesteInfoProps[] => {
    const listeMedProps: TjenesteInfoProps[] = [];
    if (tjenesteboksTilgangsArray[0] === Tilgang.IKKE_TILGANG) {
        listeMedProps.push({
            overskrift: 'Dine sykmeldte',
            innholdstekst: 'Gå til digitale sykmeldinger og følg opp sykmeldte du har ansvar for',
            lenkeTilBeOmTjeneste: 'syfo',
            erSyfo: true,
        });
    }
    if (valgtOrgNr && valgtOrgNr !== '') {
        if (tjenesteboksTilgangsArray[1] === Tilgang.IKKE_TILGANG) {
            listeMedProps.push({
                overskrift: 'Rekruttering',
                innholdstekst: 'Gå til Arbeidsplassen for å rekruttere og lage stillingsannonser',
                lenkeTilBeOmTjeneste: beOmTilgangIAltinnLink(valgtOrgNr, '5078', '1'),
            });
        }
        if (tjenesteboksTilgangsArray[2] === Tilgang.IKKE_TILGANG) {
            listeMedProps.push({
                overskrift: 'Sykfraværsstatistikk',
                innholdstekst: 'Oversikt over sykefravær i din virksomhet og bransje',
                lenkeTilBeOmTjeneste: beOmTilgangIAltinnLink(valgtOrgNr, '3403', '2'),
            });
        }
        if (tjenesteboksTilgangsArray[3] === Tilgang.IKKE_TILGANG) {
            listeMedProps.push({
                overskrift: 'Arbeidstrening',
                innholdstekst: 'Arbeidstrening er et tiltak som gir arbeidssøker mulighet til å prøve seg i arbeid, få relevant erfaring og skaffe seg en ordinær jobb. Arbeidstrening i din bedrift kan bidra til at arbeidssøkeren når målene sine. ',
                lenkeTilBeOmTjeneste: beOmTilgangIAltinnLink(valgtOrgNr, '5332', '2', '1'),
            });
        }

        if (tjenesteboksTilgangsArray[4] === Tilgang.IKKE_TILGANG) {
            listeMedProps.push({
                overskrift: 'Arbeidsforhold',
                innholdstekst: 'Få oversikt over alle arbeidsforhold du som arbeidsgiver har rapportert inn via A-meldingen. Her kan du kontrollere opplysningene og se hva som er registrert i arbeidsgiver- og arbeidstakerregisteret (Aa-registeret). ',
                lenkeTilBeOmTjeneste: beOmTilgangIAltinnLink(valgtOrgNr, '5441','1'),
            });
        }

        altinnTjenester.forEach(tjeneste => {
            const harTilgangTilTjeneste = sjekkOmTilgangTilAltinnSkjema(valgtOrgNr, tjeneste);
            //tjenestene arbeidsforhold og arbeidstrening er allerede lagt v tjenesteboksArray
            if (!harTilgangTilTjeneste && ((tjeneste.Skjema.navn !== 'Tiltaksgjennomforing' && tjeneste.Skjema.navn !== 'Arbeidsforhold')) ){
                listeMedProps.push(genererPropsForAltinnTjeneste(tjeneste.Skjema, valgtOrgNr));
            }
        });
    }
    return listeMedProps;
};

const sjekkOmTilgangTilAltinnSkjema = (
    orgnr: string,
    skjema: SkjemaMedOrganisasjonerMedTilgang
) => {
    if (
        skjema.OrganisasjonerMedTilgang.filter(org => org.OrganizationNumber === orgnr).length > 0
    ) {
        return true
    }
    return false;
};

const genererPropsForAltinnTjeneste = (skjema: AltinnSkjema, orgnr: string): TjenesteInfoProps => {
    const tjenesteInnhold: TjenesteInfoProps = {
        overskrift: skjema.navn,
        lenkeTilBeOmTjeneste: beOmTilgangIAltinnLink(orgnr, skjema.kode, skjema.versjon),
        innholdstekst: '',
    };
    switch (skjema.navn) {
        case 'Mentortilskudd': {
            tjenesteInnhold.innholdstekst =
                'Få tilgang til å søke om mentortilskudd i Altinn. Du kan søke om mentortilskudd for å få dekket frikjøp av en arbeidskollega som kan gi praktisk hjelp, veiledning og opplæring for personer som gjennomfører arbeidsmarkedstiltak. ';
            break;
        }
        case 'Inkluderingstilskudd': {
            tjenesteInnhold.innholdstekst =
                'Få tilgang til å søke om inkluderingstilskudd i Altinn. Du kan søke om tilskudd for å dekke merkostnader du som arbeidsgiver har ved tilrettelegging av arbeidsplassen.';
            break;
        }
        case 'Ekspertbistand': {
            tjenesteInnhold.innholdstekst =
                'Få tilgang til å søke ekspertbistand i Altinn. Du kan søke om ekspertbistand hvis en arbeidstaker har lange og/eller hyppige sykefravær.';
            break;
        }
        case 'Lønnstilskudd': {
            tjenesteInnhold.innholdstekst =
                'Få tilgang å søke om midlertidig eller varig lønnstilskudd i Altinn. Dette kan gis dersom du ansetter personer som har problemer med å komme inn på arbeidsmarkedet.';
            tjenesteInnhold.overskrift = 'Lønnstilskudd';
            break;
        }
        case 'Inntektsmelding': {
            tjenesteInnhold.innholdstekst =
                'Få tilgang til å sende digital inntektsmelding når arbeidstakeren skal ha sykepenger, foreldrepenger, svangerskapspenger, pleiepenger, omsorgspenger eller opplæringspenger.';
            break;
        }

    }
    return tjenesteInnhold;
};
