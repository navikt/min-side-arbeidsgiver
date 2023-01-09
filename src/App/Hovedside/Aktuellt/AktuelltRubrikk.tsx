import {Heading, LinkPanel} from "@navikt/ds-react";
import React from "react";
import {loggNavigasjonTags} from "../../../utils/funksjonerForAmplitudeLogging";
import {DisplayBetween, shouldDisplay} from "../../../GeneriskeElementer/DisplayBetween";
import {useLocation} from "react-router-dom";
import "./AktuelltRubrikk.css"

type AktuelltProps = {
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

const Aktuellt = ({lenke, tittel, visFra, visTil}: AktuelltProps) => {
    const {pathname} = useLocation()
    return (
        <DisplayBetween showFrom={visFra} showUntil={visTil}>
            <LinkPanel className="aktuellt-panel" href={lenke} border onClick={() => {
                loggNavigasjonTags(lenke, tittel, pathname, {component: 'aktuellt'})
            }}>
                <LinkPanel.Title>{tittel}</LinkPanel.Title>
                <LinkPanel.Description>
                    {dateFormat.format(visFra)}
                </LinkPanel.Description>
            </LinkPanel>
        </DisplayBetween>
    );
};

const aktuellt: Array<AktuelltProps> = [
    {
        lenke: "https://www.nav.no/no/bedrift/innhold-til-bedrift-forside/nyttig-a-vite/lonnstilskudd-far-ny-digital-refusjonslosning-fra-februar",
        tittel: "Lønnstilskudd får ny digital refusjonsløsning fra februar",
        visFra: new Date('2023-01-11T00:00:00+02:00'),
        visTil: new Date('2023-02-08T23:59:59+02:00'),
    },
]

export const AktuelltRubrikk = () => {
    const aktuelleVises = aktuellt.some(({visFra, visTil}) => shouldDisplay({
        showFrom: visFra,
        showUntil: visTil,
        currentTime: new Date()
    }))

    return aktuelleVises ? <div className='aktuellt-container'>
        <Heading size="small" level="2" id='aktuellt-tittel' className='aktuellt-tittel'>
            Aktuellt
        </Heading>
        <div className="aktuellt">
            {aktuellt.map(({
                               lenke,
                               tittel,
                               visFra,
                               visTil,
                           }) =>
                <Aktuellt key={tittel} lenke={lenke} tittel={tittel} visFra={visFra} visTil={visTil}/>
            )}
        </div>
    </div> : null
}