import React, {useContext, useEffect, useState} from 'react';
import {gql, TypedDocumentNode, useLazyQuery,} from '@apollo/client'
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
        saker(virksomhetsnummer: $virksomhetsnummer, tekstsoek: $filter, offset: $offset, limit: $limit) {
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
function useSaker({filter, side, virksomhetsnummer}:{filter: string|null, side: number, virksomhetsnummer: string|null
}){
    const [fetchSaker, {loading, data}] = useLazyQuery(HENT_SAKER, {
        variables: {
            virksomhetsnummer: '',
            filter: filter,
            offset: 0,
            limit: sideStørrelse,
        },
    })

    useEffect(()=>{
        if (virksomhetsnummer !== null) {
            const _ = fetchSaker({
                variables:{
                    virksomhetsnummer: virksomhetsnummer,
                    filter: filter !== "" ? filter : null,
                    offset: (side - 1) * sideStørrelse,
                    limit: sideStørrelse
                }
            });
        }

    }, [virksomhetsnummer, filter, side])

    return {loading, data}
}


const dateFormat = new Intl.DateTimeFormat('no', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
});
const sideStørrelse = 10;

const Saksoversikt = () => {
    const {valgtOrganisasjon} = useContext(OrganisasjonsDetaljerContext);
    const [filter, settFilter] = useState("");
    const [side, settSide] = useState(1);
    const {loading, data} = useSaker({
        filter,
        side,
        virksomhetsnummer: valgtOrganisasjon?.organisasjon.OrganizationNumber??null
    })

    if (loading || !data || data?.saker.saker.length == 0) return null;
    const antallSider = Math.ceil(data?.saker.totaltAntallSaker / sideStørrelse)

    return (
        <div className='saksoversikt'>
            <Brodsmulesti brodsmuler={[{ url: '/saksoversikt', title: 'Saksoversikt', handleInApp: true }]} />

            <div className="saksoversikt__header">
                <div className="saksoversikt__sokefelt">
                    <form onSubmit={(e)=>{
                        settSide(1)
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