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

        altinnTjenester.forEach(tjeneste => {
            const harTilgangTilTjeneste = sjekkOmTilgangTilAltinnSkjema(valgtOrgNr, tjeneste);
            if (!harTilgangTilTjeneste) {
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
                'Tilskudd til mentor innebærer å frikjøpe en arbeidskollega som kan gi praktisk hjelp, veiledning og opplæring for personer som gjennomfører arbeidsmarkedstiltak. Mentor kan også gis for at personer med nedsatt arbeidsevne skal få eller beholde lønnet arbeid.';
            break;
        }
        case 'Inkluderingstilskudd': {
            tjenesteInnhold.innholdstekst =
                'Arbeidsgivere kan få dekket utgifter til tilrettelegging av arbeidsplassen gjennom inkluderingstilskudd. Tilskuddet skal kompensere for eventuelle merkostnader bedriften har i forbindelse med tilrettelegging av arbeidsplassen.';
            break;
        }
        case 'Ekspertbistand': {
            tjenesteInnhold.innholdstekst =
                'NAV kan gi tilskudd til ekspertbistand hvis en arbeidstaker har lange og/eller hyppige sykefravær. Arbeidstakeren, arbeidsgiveren og NAV skal være enige om at ekspertbistand er et hensiktsmessig tiltak.';
            break;
        }
        case 'Lonnstilskudd': {
            tjenesteInnhold.innholdstekst =
                'Lønnstilskudd er en støtteordning for arbeidsgivere, hvor NAV kan dekke deler av lønnen ved ansettelse av personer som har problemer med å komme inn på arbeidsmarkedet.';
            tjenesteInnhold.overskrift = 'Lønnstilskudd';
            break;
        }
        case 'Inntektsmelding': {
            tjenesteInnhold.innholdstekst =
                'Send digital inntektsmelding når arbeidstakeren skal ha sykepenger, foreldrepenger, svangerskapspenger, pleiepenger, omsorgspenger eller opplæringspenger.';
            break;
        }
    }
    return tjenesteInnhold;
};
