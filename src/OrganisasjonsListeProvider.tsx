import React, { FunctionComponent, useEffect, useState } from "react";
import { Organisasjon } from "./organisasjon";
import { hentOrganisasjoner } from "./api/dnaApi";

export type Context = {
  organisasjoner: Array<Organisasjon>;
};

const OrganisasjonsListeContext = React.createContext<Context>({} as Context);
export { OrganisasjonsListeContext };

export const OrganisasjonsListeProvider: FunctionComponent = props => {
  const [organisasjoner, setOrganisasjoner] = useState(Array<Organisasjon>());

  useEffect(() => {
    const getOrganisasjoner = async () => {
      let organisasjoner = await hentOrganisasjoner();
      setOrganisasjoner(organisasjoner);
    };
    getOrganisasjoner();
  }, []);

  let defaultContext: Context = {
    organisasjoner
  };

  return (
    <OrganisasjonsListeContext.Provider value={defaultContext}>
      {props.children}
    </OrganisasjonsListeContext.Provider>
  );
};
