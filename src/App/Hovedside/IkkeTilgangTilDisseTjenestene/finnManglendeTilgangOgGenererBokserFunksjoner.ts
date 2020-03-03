import {SkjemaMedOrganisasjonerMedTilgang} from "../../../api/dnaApi";
import {Tilgang} from "../../LoginBoundary";
import {TjenesteInfoProps} from "./TjenesteInfo/TjenesteInfo";
import {AltinnSkjema} from "../../../OrganisasjonsListeProvider";
import {beOmTilgangIAltinnLink} from "../../../lenker";

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
        const harTilgangTilTjeneste = !sjekkOmTilgangTilAltinnSkjema(valgtOrgNr,tjeneste);
        if (!harTilgangTilTjeneste) {
            listeMedProps.push(genererPropsForAltinnTjeneste(tjeneste.Skjema, valgtOrgNr));
        };
    });
    return listeMedProps

};


const sjekkOmTilgangTilAltinnSkjema = (orgnr: string, skjema: SkjemaMedOrganisasjonerMedTilgang ) => {
    console.log(skjema.OrganisasjonerMedTilgang);
    if (skjema.OrganisasjonerMedTilgang.filter(org => org.OrganizationNumber === orgnr).length>0) {
        console.log("sjekket riktig");
        return true
    }
    return false;
};

const genererPropsForAltinnTjeneste = (skjema: AltinnSkjema, orgnr: string): TjenesteInfoProps => {
    const tjenesteInnhold: TjenesteInfoProps = {overskrift:skjema.navn, lenkeTilBeOmTjeneste: beOmTilgangIAltinnLink(orgnr, skjema.kode, skjema.versjon), innholdstekst: ""}
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




