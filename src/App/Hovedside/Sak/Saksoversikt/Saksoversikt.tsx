import React, {useContext, useEffect, useState} from 'react';
import {gql, TypedDocumentNode, useQuery,} from '@apollo/client'
import {GQL} from "@navikt/arbeidsgiver-notifikasjon-widget";
import {OrganisasjonsDetaljerContext} from '../../../OrganisasjonDetaljerProvider';
import './Saksoversikt.less';
import Lenkepanel from "nav-frontend-lenkepanel";
import Lenke from "nav-frontend-lenker";
import {Search} from "@navikt/ds-icons";
import {Undertekst, UndertekstBold} from "nav-frontend-typografi";
import Brodsmulesti from "../../../Brodsmulesti/Brodsmulesti";
import {TextField} from "@navikt/ds-react";
import SideBytter from "./SideBytter/SideBytter";


const HENT_SAKER: TypedDocumentNode<Pick<GQL.Query, "saker">> = gql`
    query hentSaker($virksomhetsnummer: String!, $offset: Int, $limit: Int) {
        saker(virksomhetsnummer: $virksomhetsnummer, offset: $offset, limit: $limit) {
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
const sideStørrelse = 10;

const Saksoversikt = () => {
    const {valgtOrganisasjon} = useContext(OrganisasjonsDetaljerContext);
    const {loading, data, fetchMore} = useQuery(HENT_SAKER, {
        variables: {
            virksomhetsnummer: valgtOrganisasjon?.organisasjon?.OrganizationNumber,
            limit: sideStørrelse
        },
    })

    const [valgtSide, settValgtSide] = useState(1);
    useEffect(() => {
        const _ = fetchMore({
            variables: {
                virksomhetsnummer: valgtOrganisasjon?.organisasjon?.OrganizationNumber,
                offset: (valgtSide - 1) * sideStørrelse,
                limit: sideStørrelse
            }
        })
    }, [valgtSide])

    if (loading || !data || data?.saker.saker.length == 0) return null;
    const antallSider = Math.ceil(data?.saker.totaltAntallSaker / sideStørrelse)

    return (
        <div className='saksoversikt'>
            <Brodsmulesti brodsmuler={[{ url: '/saksoversikt', title: 'Saksoversikt', handleInApp: true }]} />

            <div className="saksoversikt__header">
                <div className="saksoversikt__sokefelt">
                    <TextField label="" placeholder="Søk" hideLabel />
                    <Search height="1.5rem" width="1.5rem" className="saksoversikt__sokefelt-ikon"/>
                </div>

                <SideBytter
                    valgtSide={valgtSide}
                    antallSider={antallSider}
                    onSideValgt={settValgtSide}
                />
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