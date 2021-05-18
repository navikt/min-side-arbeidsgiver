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
  ISO8601DateTime: any;
};

export type Beskjed = Klikkbar & {
  __typename?: 'Beskjed';
  klikketPaa: Scalars['Boolean'];
  merkelapp: Scalars['String'];
  tekst: Scalars['String'];
  lenke: Scalars['String'];
  opprettetTidspunkt: Scalars['ISO8601DateTime'];
  id: Scalars['ID'];
};

export type Dummy = {
  __typename?: 'Dummy';
  dummy?: Maybe<Scalars['String']>;
};


export type Klikkbar = {
  klikketPaa: Scalars['Boolean'];
};

export type Mutation = {
  __typename?: 'Mutation';
  notifikasjonKlikketPaa: NotifikasjonKlikketPaaResultat;
};


export type MutationNotifikasjonKlikketPaaArgs = {
  id: Scalars['ID'];
};

export type MutationError = {
  feilmelding: Scalars['String'];
};

export type Notifikasjon = Beskjed | Dummy;

export type NotifikasjonKlikketPaaResultat = {
  __typename?: 'NotifikasjonKlikketPaaResultat';
  errors: Array<MutationError>;
  id?: Maybe<Scalars['ID']>;
  klikketPaa?: Maybe<Scalars['Boolean']>;
};

export type Query = {
  __typename?: 'Query';
  ping?: Maybe<Scalars['String']>;
  notifikasjoner: Array<Notifikasjon>;
  whoami?: Maybe<Scalars['String']>;
};

export type UgyldigId = MutationError & {
  __typename?: 'UgyldigId';
  feilmelding: Scalars['String'];
};
