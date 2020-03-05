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
    if (tjenesteboksTilgangsArray[0] !== Tilgang.IKKE_TILGANG) {
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
                innholdstekst: 'Lag arbeidstreningsavtaler',
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
        return true;
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
                'Tilskudd til mentor for frikjøp av en ansatt. Tilskuddet er ment for ansatte som gjennomfører arbeidsmarkedstiltak eller for å gi ansatte med nedsatt arbeidsevne støtte til å få eller beholde jobb';
            break;
        }
        case 'Inkluderingstilskudd': {
            tjenesteInnhold.innholdstekst =
                'Inkluderingstilskudd til kostnad knyttet til personer som trenger tilrettelegging på arbeids- eller tiltaksplassen.';
            break;
        }
        case 'Ekspertbistand': {
            tjenesteInnhold.innholdstekst =
                'Eksperbistand. NAV kan gi tilskudd til ekspertbistand hvis en arbeidstaker har lange og/eller hyppige sykefravær.';
            break;
        }
        case 'Lonnstilskudd': {
            tjenesteInnhold.innholdstekst =
                'Lønnstilskudd for arbeidstakere som har problemer med å få en jobb på ordinære lønns- og arbeidsvilkår eller som står i fare for å miste jobben din av helsemessige årsaker';
            tjenesteInnhold.overskrift = 'Lønnstilskudd';
            break;
        }
        case 'Inntektsmelding': {
            tjenesteInnhold.innholdstekst =
                'Send digital inntektsmelding når arbeidstakeren skal ha sykepenger, foreldrepenger, svangerskapspenger, pleiepenger, omsorgspenger eller opplæringspenger';
            break;
        }
    }
    return tjenesteInnhold;
};
