export type Maybe<T> = T | null;
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
  Instant: any;
};

export type Beskjed = {
  __typename?: 'Beskjed';
  merkelapp: Scalars['String'];
  tekst: Scalars['String'];
  lenke: Scalars['String'];
  opprettetTidspunkt: Scalars['Instant'];
};


export type Notifikasjon = Beskjed | Oppgave;

export type Oppgave = {
  __typename?: 'Oppgave';
  merkelapp: Scalars['String'];
  tekst: Scalars['String'];
  lenke: Scalars['String'];
  opprettetTidspunkt: Scalars['Instant'];
};

export type Query = {
  __typename?: 'Query';
  ping?: Maybe<Scalars['String']>;
  notifikasjoner: Array<Notifikasjon>;
};
