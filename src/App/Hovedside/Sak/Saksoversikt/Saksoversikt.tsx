import React, { useContext, useState } from 'react';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import './Saksoversikt.less';
import Brodsmulesti from '../../../Brodsmulesti/Brodsmulesti';
import SideBytter from './SideBytter/SideBytter';
import { Search } from '@navikt/ds-icons';
import { BodyShort, SearchField } from '@navikt/ds-react';
import SearchFieldButton from '@navikt/ds-react/esm/form/search-field/SearchFieldButton';
import SearchFieldInput from '@navikt/ds-react/esm/form/search-field/SearchFieldInput';
import { SaksListe } from '../SaksListe';
import { useSaker } from '../useSaker';
import { Spinner } from '../../../Spinner';

const SIDE_SIZE = 10;

const Saksoversikt = () => {
    const {valgtOrganisasjon} = useContext(OrganisasjonsDetaljerContext);
    const [filter, settFilter] = useState("");
    const [side, settSide] = useState(1);
    const {loading, data, previousData} = useSaker(SIDE_SIZE, {
        tekstsoek: filter,
        side,
        virksomhetsnummer: valgtOrganisasjon?.organisasjon.OrganizationNumber ?? null
    })

    let body;
    let antallSider;

    if (loading) {
        // Hvis det ikke er sidebytte, så er side-velgeren humbug.
        antallSider = Math.ceil((previousData?.saker.totaltAntallSaker ?? 0) / SIDE_SIZE)
        body = <Spinner />
    } else if (!data) {
        antallSider = 0
        body = <BodyShort>Ingen saker å vise på valgt virksomhet.</BodyShort>;
    } else if (data?.saker.saker.length == 0) {
        antallSider = 0
        body = <BodyShort>Ingen treff.</BodyShort>
    } else {
        antallSider = Math.ceil(data?.saker.totaltAntallSaker / SIDE_SIZE)
        body = <SaksListe saker={data?.saker.saker}/>
    }

    return <div className='saksoversikt'>
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

        {body}
    </div>
};

export default Saksoversikt;