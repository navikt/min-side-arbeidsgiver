export interface Organisasjon {
  Name: string;
  Type: string;
  OrganizationNumber: string;
  OrganizationForm: string;
  Status: string;
  ParentOrganizationNumber: string;
}

export interface OverenhetOrganisasjon {
  overordnetOrg: Organisasjon;
  UnderOrganisasjoner: Array<Organisasjon>;
}

export const tomAltinnOrganisasjon: Organisasjon = {
  Name: "",
  Type: "",
  OrganizationNumber: "",
  OrganizationForm: "",
  Status: "",
  ParentOrganizationNumber: ""
};
