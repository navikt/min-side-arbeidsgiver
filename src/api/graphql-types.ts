export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  ISO8601Date: any;
  ISO8601DateTime: any;
};

export type Adresse = {
  __typename?: 'Adresse';
  adresse: Scalars['String'];
  postnummer: Scalars['String'];
  poststed: Scalars['String'];
};

export type Beskjed = {
  __typename?: 'Beskjed';
  brukerKlikk: BrukerKlikk;
  id: Scalars['ID'];
  lenke: Scalars['String'];
  merkelapp: Scalars['String'];
  opprettetTidspunkt: Scalars['ISO8601DateTime'];
  sak?: Maybe<SakMetadata>;
  sorteringTidspunkt: Scalars['ISO8601DateTime'];
  tekst: Scalars['String'];
  virksomhet: Virksomhet;
};

export type BeskjedTidslinjeElement = {
  __typename?: 'BeskjedTidslinjeElement';
  id: Scalars['ID'];
  opprettetTidspunkt: Scalars['ISO8601DateTime'];
  tekst: Scalars['String'];
};

export type BrukerKlikk = {
  __typename?: 'BrukerKlikk';
  id: Scalars['ID'];
  klikketPaa: Scalars['Boolean'];
};

export type KalenderAvtale = {
  __typename?: 'KalenderAvtale';
  brukerKlikk: BrukerKlikk;
  digitalt: Scalars['Boolean'];
  fysisk?: Maybe<Adresse>;
  id: Scalars['ID'];
  lenke: Scalars['String'];
  merkelapp: Scalars['String'];
  sak?: Maybe<SakMetadata>;
  sluttTidspunkt?: Maybe<Scalars['ISO8601DateTime']>;
  sorteringTidspunkt: Scalars['ISO8601DateTime'];
  startTidspunkt: Scalars['ISO8601DateTime'];
  tekst: Scalars['String'];
  tilstand: KalenderAvtaleTilstand;
  virksomhet: Virksomhet;
};

export enum KalenderAvtaleTilstand {
  ArbeidsgiverHarGodtatt = 'ARBEIDSGIVER_HAR_GODTATT',
  ArbeidsgiverVilAvlyse = 'ARBEIDSGIVER_VIL_AVLYSE',
  ArbeidsgiverVilEndreTidEllerSted = 'ARBEIDSGIVER_VIL_ENDRE_TID_ELLER_STED',
  Avlyst = 'AVLYST',
  VenterSvarFraArbeidsgiver = 'VENTER_SVAR_FRA_ARBEIDSGIVER'
}

export type KalenderAvtalerResultat = {
  __typename?: 'KalenderAvtalerResultat';
  avtaler: Array<KalenderAvtale>;
  feilAltinn: Scalars['Boolean'];
  feilDigiSyfo: Scalars['Boolean'];
};

export type Mutation = {
  __typename?: 'Mutation';
  notifikasjonKlikketPaa: NotifikasjonKlikketPaaResultat;
};


export type MutationNotifikasjonKlikketPaaArgs = {
  id: Scalars['ID'];
};

export type Notifikasjon = Beskjed | KalenderAvtale | Oppgave;

export type NotifikasjonKlikketPaaResultat = BrukerKlikk | UgyldigId;

export type NotifikasjonerResultat = {
  __typename?: 'NotifikasjonerResultat';
  feilAltinn: Scalars['Boolean'];
  feilDigiSyfo: Scalars['Boolean'];
  notifikasjoner: Array<Notifikasjon>;
};

export type Oppgave = {
  __typename?: 'Oppgave';
  brukerKlikk: BrukerKlikk;
  frist?: Maybe<Scalars['ISO8601Date']>;
  id: Scalars['ID'];
  lenke: Scalars['String'];
  merkelapp: Scalars['String'];
  opprettetTidspunkt: Scalars['ISO8601DateTime'];
  paaminnelseTidspunkt?: Maybe<Scalars['ISO8601DateTime']>;
  sak?: Maybe<SakMetadata>;
  sorteringTidspunkt: Scalars['ISO8601DateTime'];
  tekst: Scalars['String'];
  tilstand?: Maybe<OppgaveTilstand>;
  utfoertTidspunkt?: Maybe<Scalars['ISO8601DateTime']>;
  utgaattTidspunkt?: Maybe<Scalars['ISO8601DateTime']>;
  virksomhet: Virksomhet;
};

export type OppgaveMetadata = {
  __typename?: 'OppgaveMetadata';
  frist?: Maybe<Scalars['ISO8601Date']>;
  paaminnelseTidspunkt?: Maybe<Scalars['ISO8601DateTime']>;
  tilstand: OppgaveTilstand;
};

export type OppgaveTidslinjeElement = {
  __typename?: 'OppgaveTidslinjeElement';
  frist?: Maybe<Scalars['ISO8601Date']>;
  id: Scalars['ID'];
  opprettetTidspunkt: Scalars['ISO8601DateTime'];
  paaminnelseTidspunkt?: Maybe<Scalars['ISO8601DateTime']>;
  tekst: Scalars['String'];
  tilstand: OppgaveTilstand;
  utfoertTidspunkt?: Maybe<Scalars['ISO8601DateTime']>;
  utgaattTidspunkt?: Maybe<Scalars['ISO8601DateTime']>;
};

export enum OppgaveTilstand {
  Ny = 'NY',
  Utfoert = 'UTFOERT',
  Utgaatt = 'UTGAATT'
}

export type OppgaveTilstandInfo = {
  __typename?: 'OppgaveTilstandInfo';
  antall: Scalars['Int'];
  tilstand: OppgaveTilstand;
};

export type Query = {
  __typename?: 'Query';
  kommendeKalenderAvtaler: KalenderAvtalerResultat;
  notifikasjoner: NotifikasjonerResultat;
  sakByGrupperingsid: SakResultat;
  sakById: SakResultat;
  saker: SakerResultat;
  /** Alle sakstyper som finnes for brukeren. */
  sakstyper: Array<SakstypeOverordnet>;
  whoami?: Maybe<Scalars['String']>;
};


export type QueryKommendeKalenderAvtalerArgs = {
  virksomhetsnumre?: InputMaybe<Array<Scalars['String']>>;
};


export type QuerySakByGrupperingsidArgs = {
  grupperingsid: Scalars['String'];
  merkelapp: Scalars['String'];
};


export type QuerySakByIdArgs = {
  id: Scalars['ID'];
};


export type QuerySakerArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  oppgaveTilstand?: InputMaybe<Array<OppgaveTilstand>>;
  sakstyper?: InputMaybe<Array<Scalars['String']>>;
  sortering?: SakSortering;
  tekstsoek?: InputMaybe<Scalars['String']>;
  virksomhetsnummer?: InputMaybe<Scalars['String']>;
  virksomhetsnumre?: InputMaybe<Array<Scalars['String']>>;
};

export type Sak = {
  __typename?: 'Sak';
  /** frist fra oppgaver med status ny. null i array betyr oppgave uten frist */
  frister: Array<Maybe<Scalars['ISO8601Date']>>;
  id: Scalars['ID'];
  lenke?: Maybe<Scalars['String']>;
  merkelapp: Scalars['String'];
  oppgaver: Array<OppgaveMetadata>;
  sisteStatus: SakStatus;
  tidslinje: Array<TidslinjeElement>;
  tittel: Scalars['String'];
  virksomhet: Virksomhet;
};

export type SakMetadata = {
  __typename?: 'SakMetadata';
  tittel: Scalars['String'];
};

export type SakResultat = {
  __typename?: 'SakResultat';
  feilAltinn: Scalars['Boolean'];
  sak?: Maybe<Sak>;
};

export enum SakSortering {
  Frist = 'FRIST',
  Oppdatert = 'OPPDATERT',
  Opprettet = 'OPPRETTET'
}

export type SakStatus = {
  __typename?: 'SakStatus';
  tekst: Scalars['String'];
  tidspunkt: Scalars['ISO8601DateTime'];
  type: SakStatusType;
};

export enum SakStatusType {
  Ferdig = 'FERDIG',
  Mottatt = 'MOTTATT',
  UnderBehandling = 'UNDER_BEHANDLING'
}

export type SakerResultat = {
  __typename?: 'SakerResultat';
  feilAltinn: Scalars['Boolean'];
  oppgaveTilstandInfo: Array<OppgaveTilstandInfo>;
  saker: Array<Sak>;
  /** Hvilke sakstyper (med antall) som finnes for valgte virksomheter. */
  sakstyper: Array<Sakstype>;
  /** Antall saker for gitt filter, men uavhengig av offset/limit. */
  totaltAntallSaker: Scalars['Int'];
};

export type Sakstype = {
  __typename?: 'Sakstype';
  antall: Scalars['Int'];
  navn: Scalars['String'];
};

export type SakstypeOverordnet = {
  __typename?: 'SakstypeOverordnet';
  navn: Scalars['String'];
};

export type TidslinjeElement = BeskjedTidslinjeElement | OppgaveTidslinjeElement;

export type UgyldigId = {
  __typename?: 'UgyldigId';
  feilmelding: Scalars['String'];
};

export type Virksomhet = {
  __typename?: 'Virksomhet';
  navn: Scalars['String'];
  virksomhetsnummer: Scalars['String'];
};
