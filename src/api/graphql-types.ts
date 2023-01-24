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

export type Beskjed = {
  __typename?: 'Beskjed';
  brukerKlikk: BrukerKlikk;
  id: Scalars['ID'];
  lenke: Scalars['String'];
  merkelapp: Scalars['String'];
  opprettetTidspunkt: Scalars['ISO8601DateTime'];
  sorteringTidspunkt: Scalars['ISO8601DateTime'];
  tekst: Scalars['String'];
  virksomhet: Virksomhet;
};

export type BrukerKlikk = {
  __typename?: 'BrukerKlikk';
  id: Scalars['ID'];
  klikketPaa: Scalars['Boolean'];
};

export type Mutation = {
  __typename?: 'Mutation';
  notifikasjonKlikketPaa: NotifikasjonKlikketPaaResultat;
};


export type MutationNotifikasjonKlikketPaaArgs = {
  id: Scalars['ID'];
};

export type Notifikasjon = Beskjed | Oppgave;

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
  sorteringTidspunkt: Scalars['ISO8601DateTime'];
  tekst: Scalars['String'];
  tilstand?: Maybe<OppgaveTilstand>;
  utgaattTidspunkt?: Maybe<Scalars['ISO8601DateTime']>;
  virksomhet: Virksomhet;
};

export type OppgaveMetadata = {
  __typename?: 'OppgaveMetadata';
  frist?: Maybe<Scalars['ISO8601Date']>;
  paaminnelseTidspunkt?: Maybe<Scalars['ISO8601DateTime']>;
  tilstand: OppgaveTilstand;
};

export enum OppgaveTilstand {
  Ny = 'NY',
  Utfoert = 'UTFOERT',
  Utgaatt = 'UTGAATT'
}

export type Query = {
  __typename?: 'Query';
  notifikasjoner: NotifikasjonerResultat;
  saker: SakerResultat;
  whoami?: Maybe<Scalars['String']>;
};


export type QuerySakerArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
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
  lenke: Scalars['String'];
  merkelapp: Scalars['String'];
  oppgaver: Array<OppgaveMetadata>;
  sisteStatus: SakStatus;
  tittel: Scalars['String'];
  virksomhet: Virksomhet;
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
  saker: Array<Sak>;
  /** Antall saker for gitt filter, men uavhengig av offset/limit. */
  totaltAntallSaker: Scalars['Int'];
};

export type UgyldigId = {
  __typename?: 'UgyldigId';
  feilmelding: Scalars['String'];
};

export type Virksomhet = {
  __typename?: 'Virksomhet';
  navn: Scalars['String'];
  virksomhetsnummer: Scalars['String'];
};
