import {BodyShort, LinkPanel} from '@navikt/ds-react';
import React from 'react';
import {loggNavigasjonTags} from '../../../utils/funksjonerForAmplitudeLogging';
import {useLocation} from "react-router-dom";
import "./SaksListe.css"
import OppgaveIkon from "./OppgaveIkon";
import {OppgaveMetadata, OppgaveTilstand, Sak} from "../../../api/graphql-types";


const dateFormat = new Intl.DateTimeFormat('no', {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
});

type SakPanelProps = {
    sak: Sak;
    placeholder?: boolean;
}

export const SakPanel = ({
        placeholder,
        sak: {lenke, tittel, virksomhet, sisteStatus, merkelapp, frister, oppgaver}
    }: SakPanelProps) => {
    const fake = placeholder ?? false
    const style: React.CSSProperties = fake ? {visibility: 'hidden'} : {}
    const {pathname} = useLocation()
    const [frist,] = frister
    const paminnelse: boolean = oppgaver.some((oppgave: OppgaveMetadata) =>
        oppgave.tilstand === OppgaveTilstand.Ny && oppgave.paaminnelseTidspunkt !== null
    )


    return <LinkPanel className="sakslenkepanel" href={lenke} as={fake ? 'div' : 'a'} onClick={() => {
        loggNavigasjonTags(lenke, merkelapp, pathname, {component: 'sak'})
    }}>
        <div className="sakscontainer">
            <div className="sakscontent">
                <BodyShort size="small" style={style}>
                    {virksomhet.navn.toUpperCase()}
                </BodyShort>

                <LinkPanel.Title style={style} className="sakstekst">
                    {tittel}
                </LinkPanel.Title>

                <BodyShort size="small" style={style}>
                    {sisteStatus.tekst}{' '}{dateFormat.format(new Date(sisteStatus.tidspunkt))}
                </BodyShort>

            </div>
            {frist !== undefined &&
                <div className="saksfrist" style={style}>
                    <OppgaveIkon/>
                    <div>
                        {paminnelse ? <BodyShort size="small" className="paminnelse"> Påminnelse </BodyShort> : null}
                        <BodyShort size="small"> Oppgave venter {frist == null ? "" : ` – frist ${dateFormat.format(new Date(frist))}`}</BodyShort>
                    </div>
                </div>
            }
        </div>
    </LinkPanel>
}