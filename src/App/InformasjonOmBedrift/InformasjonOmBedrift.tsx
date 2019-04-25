import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState
} from "react";
import { Normaltekst, Systemtittel, Ingress } from "nav-frontend-typografi";
import { OrganisasjonsDetaljerContext } from "../../OrganisasjonDetaljerProvider";
import { hentBedriftsInfo } from "../../api/enhetsregisteretApi";
import { defaultOrg, EnhetsregisteretOrg } from "../../enhetsregisteretOrg";
import "./InformasjonOmBedrift.less";

const InformasjonOmBedrift: FunctionComponent = () => {
  const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
  const [org, setOrg] = useState<EnhetsregisteretOrg>(defaultOrg);
  useEffect(() => {
    const getInfo = async () => {
      const bedriftinfo: EnhetsregisteretOrg = await hentBedriftsInfo(
        "975959171"
      );
      setOrg(bedriftinfo);
    };
    getInfo();
  }, [valgtOrganisasjon]);

  return (
    <div className="Informasjon-om-bedrift">
      <div className={"informasjon-om-bedrift__forstekolonne"}>
        <Systemtittel>{org.navn}</Systemtittel>
        <br />
        <Normaltekst>Organisasjonsnummer</Normaltekst>
        <Ingress> {org.organisasjonsnummer}</Ingress>
        <br />
        <Normaltekst>Forretningsadresse</Normaltekst>
        <Ingress> {org.postadresse.adresse[0]}</Ingress>
        <Ingress>
          {org.postadresse.postnummer + " " + org.postadresse.poststed}
        </Ingress>
        {org.naeringskode1.beskrivelse ||
          org.naeringskode2.beskrivelse ||
          (org.naeringskode3.beskrivelse && <Ingress>Næringskoder </Ingress>)}

        <br />
      </div>
      <div className={"informasjon-om-bedrift__andrekolonne"} />
    </div>
  );
};

export default InformasjonOmBedrift;
