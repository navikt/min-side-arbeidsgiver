import {SkjemaMedOrganisasjonerMedTilgang} from "../../../api/dnaApi";
import {Tilgang} from "../../LoginBoundary";
import {TjenesteInfoProps} from "./TjenesteInfo/TjenesteInfo";
import {AltinnSkjema} from "../../../OrganisasjonsListeProvider";


const sjekkOmTilgangTilAltinnSkjema = (orgnr: string, skjema: SkjemaMedOrganisasjonerMedTilgang ) => {
    if (skjema.OrganisasjonerMedTilgang.filter(org => org.OrganizationNumber === orgnr).length>0) {
        return true
    }
    return false;
};

const genererPropsForAltinnTjeneste = (skjema: AltinnSkjema): TjenesteInfoProps => {
    const tjenesteInnhold: TjenesteInfoProps = {overskrift:skjema.navn, lenkeTilBeOmTjeneste: skjema.kode, innholdstekst: ""}
    switch (skjema.navn) {
        case 'Mentortilskudd': {
            tjenesteInnhold.innholdstekst = 'Søk om tilskudd til Mentor';
            break
        }
        case 'Inkluderingstilskudd': {
            tjenesteInnhold.innholdstekst = 'Søk om Inkluderingsstilskudd';
            break;
        }
        case 'Ekspertbistand': {
            tjenesteInnhold.innholdstekst = 'Søk om eksperbistand';
            break;
        }
        case 'Lonnstilskudd': {
            tjenesteInnhold.innholdstekst = 'Søk om Lønnstilskudd';
            break;
        }
        case 'Inntektsmelding': {
            tjenesteInnhold.innholdstekst = 'Send inntektsmelding';
            break;
        }
    }
    return tjenesteInnhold;
};

export const genererTekstbokser = (tjenesteboksTilgangsArray: Tilgang[], altinnTjenester: SkjemaMedOrganisasjonerMedTilgang[], valgtOrgNr: string): TjenesteInfoProps[] => {
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

    altinnTjenester.forEach(tjeneste => {
        if (sjekkOmTilgangTilAltinnSkjema(valgtOrgNr,tjeneste)) {
            listeMedProps.push(genererPropsForAltinnTjeneste(tjeneste.Skjema));
        }
    })
    return listeMedProps

};