import React, {useContext} from 'react';
import {gql, TypedDocumentNode, useQuery,} from '@apollo/client'
import {GQL} from "@navikt/arbeidsgiver-notifikasjon-widget";
import {OrganisasjonsDetaljerContext} from '../../../OrganisasjonDetaljerProvider';
import './Saksoversikt.less';
import Lenkepanel from "nav-frontend-lenkepanel";
import Lenke from "nav-frontend-lenker";
import { Search } from "@navikt/ds-icons";
import {Undertekst, UndertekstBold} from "nav-frontend-typografi";
import Brodsmulesti from "../../../Brodsmulesti/Brodsmulesti";
import {TextField} from "@navikt/ds-react";
import SideBytter from "./SideBytter/SideBytter";


const HENT_SAKER: TypedDocumentNode<Pick<GQL.Query, "saker">> = gql`
    query hentSaker($virksomhetsnummer: String!) {
        saker(virksomhetsnummer: $virksomhetsnummer) {
            saker {
                id
                tittel
                lenke
                merkelapp
                virksomhet {
                    navn
                    virksomhetsnummer
                }
                sisteStatus {
                    type
                    tekst
                    tidspunkt
                }
            }
            feilAltinn
            totaltAntallSaker
        }
    }
`

const dateFormat = new Intl.DateTimeFormat('no', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
});

const Saksoversikt = () => {
    const {valgtOrganisasjon} = useContext(OrganisasjonsDetaljerContext);

    if (valgtOrganisasjon === undefined) return null;

    const {loading, data} = useQuery(HENT_SAKER, {
        variables: {
            virksomhetsnummer: valgtOrganisasjon.organisasjon.OrganizationNumber,
        },
    })

    if (loading || !data || data?.saker.saker.length == 0) return null;

    return (
        <div className='saksoversikt'>
            <Brodsmulesti brodsmuler={[{ url: '/saksoversikt', title: 'Saksoversikt', handleInApp: true }]} />

            <div className="saksoversikt__header">
                <div className="saksoversikt__sokefelt">
                    <TextField label="" placeholder="Søk" hideLabel />
                    <Search height="1.5rem" width="1.5rem" className="saksoversikt__sokefelt-ikon"/>
                </div>

                <SideBytter antallSider={5} />
            </div>

            <ul>
                {data?.saker.saker.map(({id, tittel, lenke, sisteStatus, virksomhet, merkelapp}) => (
                    <li key={id}>
                        <Lenkepanel tittelProps='element' href={lenke}>
                            <Undertekst>{virksomhet.navn.toUpperCase()}</Undertekst>
                            <Lenke className='saksoversikt__lenke' href={lenke}>{tittel}</Lenke>
                            <UndertekstBold>
                                {sisteStatus.tekst}{' '}{dateFormat.format(new Date(sisteStatus.tidspunkt))}
                            </UndertekstBold>
                        </Lenkepanel>
                    </li>
                ))}

            </ul>
        </div>
    );
};

export default Saksoversikt;