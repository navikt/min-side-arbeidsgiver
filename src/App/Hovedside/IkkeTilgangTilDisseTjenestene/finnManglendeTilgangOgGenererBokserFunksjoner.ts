import {SkjemaMedOrganisasjonerMedTilgang} from "../../../api/dnaApi";
import {Tilgang} from "../../LoginBoundary";
import {TjenesteInfoProps} from "./TjenesteInfo/TjenesteInfo";


const sjekkOmTilgangTilAltinnSkjema = (orgnr: string, skjema: SkjemaMedOrganisasjonerMedTilgang ) => {
    if (skjema.OrganisasjonerMedTilgang.filter(org => org.OrganizationNumber === orgnr).length>0) {
        return true
    }
    return false;
};

const genererTekstbokser = (tjenesteboksTilgangsArray: Tilgang[], altinnTjenester: SkjemaMedOrganisasjonerMedTilgang[]) => {
    const listeMedProps: TjenesteInfoProps[] = [];
    if (tjenesteboksTilgangsArray[0] === Tilgang.IKKE_TILGANG) {
        listeMedProps.push({overskrift: 'Dine sykmeldte', innholdstekst: 'Gå til digitale sykmeldinger', lenkeTilBeOmTjeneste: 'syfo'})
    }
    if (tjenesteboksTilgangsArray[1] === Tilgang.IKKE_TILGANG) {
        listeMedProps.push({overskrift: 'Rekruttering', innholdstekst: 'Gå til Arbeidsplassen for å rekruttere', lenkeTilBeOmTjeneste: 'arbeidsplassen'})
    }
    if (tjenesteboksTilgangsArray[2] === Tilgang.IKKE_TILGANG) {
        listeMedProps.push({overskrift: 'Sykfraværsstatistikk', innholdstekst: 'Se sykmeldte i din bedrift og bransje', lenkeTilBeOmTjeneste: 'IA'})
    }
    if (tjenesteboksTilgangsArray[3] === Tilgang.IKKE_TILGANG) {
        listeMedProps.push({overskrift: 'Arbeidstrening', innholdstekst: 'Lag arbeidstreningsavtaler', lenkeTilBeOmTjeneste: 'Arbeidstrening'})
    }

};