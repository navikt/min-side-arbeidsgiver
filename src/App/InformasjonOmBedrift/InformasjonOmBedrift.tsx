import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState
} from "react";
import { Normaltekst, Systemtittel, Ingress } from "nav-frontend-typografi";
import { OrganisasjonsDetaljerContext } from "../../OrganisasjonDetaljerProvider";
import { hentBedriftsInfo } from "../../api/enhetsregisteretApi";
import {
  tomEnhetsregOrg,
  EnhetsregisteretOrg
} from "../../enhetsregisteretOrg";
import "./InformasjonOmBedrift.less";
import Lenke from "nav-frontend-lenker";
import Tekstboks from "./Tekstboks/Tekstboks";

const InformasjonOmBedrift: FunctionComponent = () => {
  const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
  const [org, setOrg] = useState<EnhetsregisteretOrg>(tomEnhetsregOrg);
  const orgnr = valgtOrganisasjon.OrganizationNumber;
  useEffect(() => {
    let bedriftinfo: EnhetsregisteretOrg = tomEnhetsregOrg;
    const getInfo = async () => {
      if (orgnr !== "") {
        bedriftinfo = await hentBedriftsInfo(orgnr);
        setOrg(bedriftinfo);
      }
    };
    getInfo();
  }, [orgnr]);

  return (
    <div className="informasjon-om-bedrift">
      {org !== tomEnhetsregOrg && (
        <div className={"informasjon-om-bedrift__tekstomrade"}>
          <Systemtittel>{org.navn}</Systemtittel>
          <br />
          {org.organisasjonsnummer && (
            <Tekstboks>
              <Normaltekst>Organisasjonsnummer</Normaltekst>
              <Ingress> {org.organisasjonsnummer}</Ingress>
            </Tekstboks>
          )}
          {org.forretningsadresse && (
            <Tekstboks>
              <Normaltekst>Forretningsadresse</Normaltekst>
              <Ingress> {org.forretningsadresse.adresse[0]}</Ingress>
              <Ingress>
                {org.forretningsadresse.postnummer +
                  " " +
                  org.forretningsadresse.poststed}
              </Ingress>
            </Tekstboks>
          )}
          <Normaltekst className={"informasjon-om-bedrift__naeringskoder"}>
            Næringskoder
          </Normaltekst>
          {org.naeringskode1 && (
            <Tekstboks>
              <Ingress>
                {org.naeringskode1.kode + ". " + org.naeringskode1.beskrivelse}
              </Ingress>
            </Tekstboks>
          )}
          {org.naeringskode2 && (
            <Tekstboks>
              <Ingress>
                {org.naeringskode2.kode + ". " + org.naeringskode2.beskrivelse}
              </Ingress>
            </Tekstboks>
          )}
          {org.naeringskode3 && (
            <Tekstboks>
              <Ingress>
                {org.naeringskode3.kode + ". " + org.naeringskode3.beskrivelse}
              </Ingress>
            </Tekstboks>
          )}
          {org.hjemmeside && (
            <Tekstboks>
              <Normaltekst>Hjemmeside</Normaltekst>
              <Lenke href={org.hjemmeside}>{org.hjemmeside}</Lenke>
              <br />
            </Tekstboks>
          )}

          {org.organisasjonsform && (
            <Tekstboks>
              <Normaltekst>Organisasjonsform </Normaltekst>
              <Ingress>
                {org.organisasjonsform.beskrivelse +
                  " " +
                  org.organisasjonsform.kode}
              </Ingress>
            </Tekstboks>
          )}
          {org.postadresse && (
            <Tekstboks>
              <Normaltekst>Postadresse</Normaltekst>
              <Ingress>{org.postadresse.adresse[0]}</Ingress>
              <Ingress>
                {org.postadresse.postnummer + " " + org.postadresse.poststed}
              </Ingress>
            </Tekstboks>
          )}
        </div>
      )}
      {org === tomEnhetsregOrg && <div> Kunne ikke hente informasjon</div>}
    </div>
  );
};

export default InformasjonOmBedrift;
