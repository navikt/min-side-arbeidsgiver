import React, {useContext, useState} from 'react';
import {gql, TypedDocumentNode, useQuery,} from '@apollo/client'
import {GQL} from "@navikt/arbeidsgiver-notifikasjon-widget";
import {OrganisasjonsDetaljerContext} from '../../../OrganisasjonDetaljerProvider';
import './Saksoversikt.less';
import Lenkepanel from "nav-frontend-lenkepanel";
import Lenke from "nav-frontend-lenker";
import {Undertekst, UndertekstBold} from "nav-frontend-typografi";
import Brodsmulesti from "../../../Brodsmulesti/Brodsmulesti";
import SideBytter from "./SideBytter/SideBytter";
import {Search} from "@navikt/ds-icons";
import {SearchField} from "@navikt/ds-react";
import SearchFieldButton from "@navikt/ds-react/esm/form/search-field/SearchFieldButton";
import SearchFieldInput from "@navikt/ds-react/esm/form/search-field/SearchFieldInput";


const HENT_SAKER: TypedDocumentNode<Pick<GQL.Query, "saker">> = gql`
    query hentSaker($virksomhetsnummer: String!, $filter: String, $offset: Int, $limit: Int) {
        saker(virksomhetsnummer: $virksomhetsnummer, filter: $filter, offset: $offset, limit: $limit) {
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
            filter: null,
            offset: 0,
            limit: sideStørrelse
        },
    })
    const oppdaterSaker = ({filter, side}: { filter: string, side: number }) => {
        const _ = fetchMore({
            variables: {
                virksomhetsnummer: valgtOrganisasjon?.organisasjon?.OrganizationNumber,
                filter: filter !== "" ? filter : null,
                offset: (side - 1) * sideStørrelse,
                limit: sideStørrelse
            }
        });
    }
    const [filter, settFilter] = useState("");
    const [side, settSide] = useState(1);

    if (loading || !data || data?.saker.saker.length == 0) return null;
    const antallSider = Math.ceil(data?.saker.totaltAntallSaker / sideStørrelse)

    return (
        <div className='saksoversikt'>
            <Brodsmulesti brodsmuler={[{ url: '/saksoversikt', title: 'Saksoversikt', handleInApp: true }]} />

            <div className="saksoversikt__header">
                <div className="saksoversikt__sokefelt">
                    <form onSubmit={(e)=>{
                        settSide(1)
                        oppdaterSaker({filter: filter, side: 1})
                        e.preventDefault()
                    }}>
                    <SearchField  label='Søk' hideLabel>
                        <SearchFieldInput value={filter} onChange={(e) => settFilter(e.target.value)}/>
                        <SearchFieldButton variant="primary" type='submit'>
                            <Search height="1.5rem" width="1.5rem" className="saksoversikt__sokefelt-ikon"/>
                        </SearchFieldButton>
                    </SearchField>
                    </form>
                    

                </div>

                <SideBytter
                    side={side}
                    antallSider={antallSider}
                    onSideValgt={(valgtSide) => {
                        settSide(valgtSide)
                        oppdaterSaker({filter, side: valgtSide})
                    }}
                />
            </div>

            <ul>
                {data?.saker.saker.map(({id, tittel, lenke, sisteStatus, virksomhet}) => (
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