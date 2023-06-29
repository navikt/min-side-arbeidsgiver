import React, { FC, useContext, useEffect, useState } from 'react';
import './Saksfilter.css';
import { Virksomhetsmeny, } from './Virksomhetsmeny/Virksomhetsmeny';
import { Søkeboks } from './Søkeboks';
import { Filter } from '../Saksoversikt/useOversiktStateTransitions';
import { Ekspanderbartpanel } from '../../../../GeneriskeElementer/Ekspanderbartpanel';
import { Accordion, BodyShort, Checkbox, CheckboxGroup } from '@navikt/ds-react';
import { Filter as FilterIkon } from '@navikt/ds-icons';
import { OppgaveTilstand, OppgaveTilstandInfo, Sakstype, SakstypeOverordnet } from '../../../../api/graphql-types';
import { sorted } from '../../../../utils/util';
import { useSearchParams } from 'react-router-dom';
import { Set } from 'immutable'
import { OrganisasjonerOgTilgangerContext } from '../../../OrganisasjonerOgTilgangerProvider';


type SaksfilterProps = {
    filter: Filter;
    setFilter: (filter: Filter) => void;
    valgteVirksomheter: Set<string>;
    setValgteVirksomheter: (valgteVirksomheter: Set<string>) => void;
    sakstypeinfo: Sakstype[] | undefined;
    alleSakstyper: SakstypeOverordnet[];
    oppgaveTilstandInfo: OppgaveTilstandInfo[] | undefined;
}

type KollapsHvisMobilProps = {
    width: Number
    children?: React.ReactNode | undefined
}

const KollapsHvisMobil: FC<KollapsHvisMobilProps> = ({ width, children }: KollapsHvisMobilProps) => {
    if (width < 730) {
        return <Ekspanderbartpanel tittel='Filtrering' ikon={<FilterIkon />}>
            {children}
        </Ekspanderbartpanel>;
    } else {
        return <>{children}</>;
    }
};


export const Saksfilter = ({
                               valgteVirksomheter,
                               setValgteVirksomheter,
                               filter,
                               setFilter,
                               sakstypeinfo,
                               oppgaveTilstandInfo,
                               alleSakstyper,
                           }: SaksfilterProps) => {
    const [width, setWidth] = useState(window.innerWidth);
    const {organisasjonstre} = useContext(OrganisasjonerOgTilgangerContext)
    const [searchParams, setSearchParams] = useSearchParams();
    const [visVirksomhetsmeny, setVisVirksomhetsmeny] = useState(searchParams.get("virksomhetsmeny") === "open");

    const handleVisVirksomhetsmeny = (tilstand: boolean) => {
        setVisVirksomhetsmeny(tilstand);
        if (tilstand) {
            searchParams.set("virksomhetsmeny", "open")
        } else {
            searchParams.delete("virksomhetsmeny");
        }
        setSearchParams(searchParams);
    }

    useEffect(() => {
        const setSize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', setSize);
        return () => window.removeEventListener('resize', setSize);
    }, [setWidth]);


    if (organisasjonstre === undefined) {
        return null;
    }

    const sakstyperForFilter = alleSakstyper.map((sakstypeOverordnet) =>
        ({
            navn: sakstypeOverordnet.navn,
            antall: sakstypeinfo === undefined
                ? undefined
                : (sakstypeinfo.find(sakstype => sakstype.navn === sakstypeOverordnet.navn)?.antall ?? 0),
        }),
    );

    const antallUløsteOppgaver = oppgaveTilstandInfo?.find(oppgaveTilstand => oppgaveTilstand.tilstand === OppgaveTilstand.Ny)?.antall;

    return <KollapsHvisMobil width={width}>
        <div className='saksfilter'>

            <Accordion>
                <Accordion.Item open={visVirksomhetsmeny}>
                    <Accordion.Header onClick={() => handleVisVirksomhetsmeny(!visVirksomhetsmeny)}>
                        Virksomheter
                            {/*({valgteVirksomheter === 'ALLEBEDRIFTER' ? 'alle valgt' : valgteVirksomheter.length})*/}
                            ({valgteVirksomheter.size})
                    </Accordion.Header>
                    <Accordion.Content className='virksomheter_accordation'>
                        <Virksomhetsmeny
                            valgteEnheter={valgteVirksomheter}
                            setValgteEnheter={setValgteVirksomheter}
                        />
                    </Accordion.Content>
                </Accordion.Item>
            </Accordion>

            <Søkeboks filter={filter} byttFilter={setFilter}></Søkeboks>

            <CheckboxGroup
                value={filter.oppgaveTilstand}
                legend={'Oppgaver'}
                onChange={valgteOppgavetilstander =>
                    setFilter({ ...filter, oppgaveTilstand: valgteOppgavetilstander })
                }
            >
                <Checkbox value={OppgaveTilstand.Ny}>
                    <BodyShort>Uløste oppgaver
                        {
                            oppgaveTilstandInfo ? ` (${antallUløsteOppgaver ?? '0'})` : ''
                        }
                    </BodyShort>
                </Checkbox>
            </CheckboxGroup>
            {sakstyperForFilter.length > 1 && <CheckboxGroup
                legend='Type sak'
                value={filter.sakstyper}
                onChange={valgteSakstyper => {
                    setFilter({ ...filter, sakstyper: valgteSakstyper });
                }}
            >
                {
                    sorted(sakstyperForFilter, sakstype => sakstype.navn).map(({ navn, antall }) =>
                        <Checkbox key={navn} value={navn}>
                            <BodyShort>
                                {antall === undefined
                                    ? navn
                                    : `${navn} (${antall})`
                                }
                            </BodyShort>
                        </Checkbox>)
                }
            </CheckboxGroup>
            }
        </div>
    </KollapsHvisMobil>;

};

