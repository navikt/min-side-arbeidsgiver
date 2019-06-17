import React, { FunctionComponent, useEffect, useState } from "react";
import { Organisasjon, OverenhetOrganisasjon } from "./organisasjon";
import { hentOrganisasjoner, lagToDimensjonalArray } from "./api/dnaApi";

export type Context = {
  organisasjoner: Array<Organisasjon>;
  organisasjonstre:  Array<OverenhetOrganisasjon>;
};

const OrganisasjonsListeContext = React.createContext<Context>({} as Context);
export { OrganisasjonsListeContext };

export const OrganisasjonsListeProvider: FunctionComponent = props => {
  const [organisasjoner, setOrganisasjoner] = useState(Array<Organisasjon>());
  const [organisasjonstre, setorganisasjonstre] = useState(Array<OverenhetOrganisasjon>());

  useEffect(() => {
    const getOrganisasjoner = async () => {
      let organisasjoner = await hentOrganisasjoner();
      setOrganisasjoner(organisasjoner);
      const toDim: Array<OverenhetOrganisasjon> = lagToDimensjonalArray(
        organisasjoner
      );
      setorganisasjonstre(toDim);
      console.log(toDim);
    };
    getOrganisasjoner();
  }, []);

  let defaultContext: Context = {
    organisasjoner,
    organisasjonstre
  };

  return (
    <OrganisasjonsListeContext.Provider value={defaultContext}>
      {props.children}
    </OrganisasjonsListeContext.Provider>
  );
};
