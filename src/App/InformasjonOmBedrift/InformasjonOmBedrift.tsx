import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState
} from "react";
import { Normaltekst } from "nav-frontend-typografi";
import { OrganisasjonsDetaljerContext } from "../../OrganisasjonDetaljerProvider";
import { hentBedriftsInfo } from "../../api/enhetsregisteretApi";
import { defaultOrg, EnhetsregisteretOrg } from "../../enhetsregisteretOrg";

const InformasjonOmBedrift: FunctionComponent = () => {
  const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
  const [org, setOrg] = useState<EnhetsregisteretOrg>(defaultOrg);
  useEffect(() => {
    const getInfo = async () => {
      const bedriftinfo: EnhetsregisteretOrg = await hentBedriftsInfo(
        "889640782"
      );
      setOrg(bedriftinfo);
    };
    getInfo();
  }, [valgtOrganisasjon]);

  return (
    <div className="Informasjon-om-bedrift">
      <Normaltekst>Helloo</Normaltekst>
    </div>
  );
};

export default InformasjonOmBedrift;

//await hentBedriftsInfo(
//  "889640782"
//);
