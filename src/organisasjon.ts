import { EnhetsregisteretOrg } from "./enhetsregisteretOrg";

export interface Organisasjon {
  Name: string;
  Type: string;
  OrganizationNumber: string;
  OrganizationForm: string;
  Status: string;
}

export const defaultAltinnOrg: Organisasjon = {
  Name: "",
  Type: "",
  OrganizationNumber: "",
  OrganizationForm: "",
  Status: ""
};
