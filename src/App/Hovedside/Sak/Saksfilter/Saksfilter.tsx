import React, { FC, useContext, useEffect, useState } from 'react';
import './Saksfilter.css';
import { Virksomhetsmeny } from './Virksomhetsmeny/Virksomhetsmeny';
import { Søkeboks } from './Søkeboks';
import { Filter } from '../Saksoversikt/useOversiktStateTransitions';
import { Ekspanderbartpanel } from '../../../../GeneriskeElementer/Ekspanderbartpanel';
import { BodyShort, Checkbox, CheckboxGroup, Label } from '@navikt/ds-react';
import { Filter as FilterIkon } from '@navikt/ds-icons';
import { OppgaveTilstand, OppgaveTilstandInfo, Sakstype, SakstypeOverordnet } from '../../../../api/graphql-types';
import { sorted } from '../../../../utils/util';
import { Set } from 'immutable';
import { OrganisasjonerOgTilgangerContext } from '../../../OrganisasjonerOgTilgangerProvider';
import amplitude from '../../../../utils/amplitude';


type SaksfilterProps = {
    filter: Filter;
    setFilter: (filter: Filter) => void;
    valgteVirksomheter: Set<string>;
    setValgteVirksomheter: (valgteVirksomheter: Set<string>) => void;
    sakstypeinfo: Sakstype[] | undefined;
    alleSakstyper: SakstypeOverordnet[];
    oppgaveTilstandInfo: OppgaveTilstandInfo[] | undefined;
}

export const oppgaveTilstandTilTekst = (oppgavetilstand: OppgaveTilstand) => {
    switch (oppgavetilstand) {
        case OppgaveTilstand.Ny:
            return 'Uløste oppgaver'
        default:
            return ""
    }
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

export const amplitudeFilterKlikk = (kategori: string, filternavn: string, target: EventTarget) => {
    if (target instanceof HTMLInputElement) {
        amplitude.logEvent("filtervalg", {
            "kategori": kategori,
            "filternavn": filternavn,
            "checked": target.checked,
        })
    }
}


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

            <Søkeboks filter={filter} byttFilter={setFilter}></Søkeboks>

            <CheckboxGroup
                value={filter.oppgaveTilstand}
                legend={'Oppgaver'}
                onChange={valgteOppgavetilstander =>
                    setFilter({ ...filter, oppgaveTilstand: valgteOppgavetilstander })
                }
            >
                <Checkbox
                    value={OppgaveTilstand.Ny}
                    onClick={e =>
                        amplitudeFilterKlikk("oppgave", OppgaveTilstand.Ny, e.target)}
                >
                    <BodyShort>{oppgaveTilstandTilTekst(OppgaveTilstand.Ny)}
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
                        <Checkbox
                            key={navn}
                            value={navn}
                            onClick={e => amplitudeFilterKlikk("sakstype", navn, e.target) }
                        >
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
            <div>
                <Label>Virksomheter</Label>
                <Virksomhetsmeny
                    valgteEnheter={valgteVirksomheter}
                    setValgteEnheter={setValgteVirksomheter}
                />
            </div>

        </div>
    </KollapsHvisMobil>;

};

