import {Heading, LinkPanel} from "@navikt/ds-react";
import React, {useContext} from "react";
import {loggNavigasjonTags} from "../../../utils/funksjonerForAmplitudeLogging";
import {DisplayBetween, shouldDisplay} from "../../../GeneriskeElementer/DisplayBetween";
import {useLocation} from "react-router-dom";
import "./AktueltRubrikk.css"
import {OrganisasjonsDetaljerContext} from "../../OrganisasjonDetaljerProvider";

type AktueltProps = {
    lenke: string,
    tittel: string,
    visFra: Date,
    visTil: Date,
}

const dateFormat = new Intl.DateTimeFormat('no', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
});

const Aktuelt = ({lenke, tittel, visFra, visTil}: AktueltProps) => {
    const {valgtOrganisasjon} = useContext(OrganisasjonsDetaljerContext);
    const {pathname} = useLocation()
    if (!valgtOrganisasjon) {
        return null
    }

    const skalVises = valgtOrganisasjon.altinntilgang.midlertidigLønnstilskudd ||
        valgtOrganisasjon.altinntilgang.varigLønnstilskudd ||
        (valgtOrganisasjon.altinntilgang.inntektsmelding && (valgtOrganisasjon.refusjonstatus["KLAR_FOR_INNSENDING"] ?? 0) > 0);

    if (!skalVises) {
        return null
    }

    return (
        <DisplayBetween showFrom={visFra} showUntil={visTil}>
            <LinkPanel className="aktuelt-panel" href={lenke} border onClick={() => {
                loggNavigasjonTags(lenke, tittel, pathname, {component: 'aktuelt'})
            }}>
                <LinkPanel.Title>{tittel}</LinkPanel.Title>
                <LinkPanel.Description>
                    {dateFormat.format(visFra)}
                </LinkPanel.Description>
            </LinkPanel>
        </DisplayBetween>
    );

};

const aktuelt: Array<AktueltProps> = [
    {
        lenke: "https://www.nav.no/no/bedrift/innhold-til-bedrift-forside/nyttig-a-vite/lonnstilskudd-far-ny-digital-refusjonslosning-fra-februar",
        tittel: "Lønnstilskudd får ny digital refusjonsløsning fra februar",
        visFra: new Date('2023-02-23T00:00:00+02:00'),
        visTil: new Date('2023-03-23T23:59:59+02:00'),
    },
]

export const AktueltRubrikk = () => {
    const aktuelleVises = aktuelt.some(({visFra, visTil}) => shouldDisplay({
        showFrom: visFra,
        showUntil: visTil,
        currentTime: new Date()
    }))

    if (!aktuelleVises) {
        return null
    }

    return <div className='aktuelt-container'>
        <Heading size="small" level="2" id='aktuelt-tittel' className='aktuelt-tittel'>
            Aktuelt
        </Heading>
        <div className="aktuelt">
            {aktuelt.map(({
                              lenke,
                              tittel,
                              visFra,
                              visTil,
                          }) =>
                <Aktuelt key={tittel} lenke={lenke} tittel={tittel} visFra={visFra} visTil={visTil}/>
            )}
        </div>
    </div>
}