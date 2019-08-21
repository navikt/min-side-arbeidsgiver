import React, { FunctionComponent, useContext, useState, useEffect } from 'react';
import { Collapse } from 'react-collapse';
import { Input } from 'nav-frontend-skjema';
import { Undertittel, Element } from 'nav-frontend-typografi';
import { withRouter, RouteComponentProps } from 'react-router';
import { Wrapper, Button, Menu } from 'react-aria-menubutton';

import { byggSokeresultat } from './byggSokeresultat';
import {
    JuridiskEnhetMedUnderEnheterArray,
    tomAltinnOrganisasjon,
} from '../../../Objekter/Organisasjoner/OrganisasjonerFraAltinn';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import { OrganisasjonsListeContext } from '../../../OrganisasjonsListeProvider';
import { ReactComponent as Virksomhetsikon } from './virksomhet.svg';
import kryss from './kryss.svg';
import sok from './forstorrelsesglass.svg';
import './Virksomhetsvelger.less';
import DefaultMeny from './MenyValg/DefaultMeny';
import MenyFraSokeresultat from './MenyValg/MenyFraSokeresultat';

interface Props {
    className?: string;
}

const Virksomhetsvelger: FunctionComponent<Props & RouteComponentProps> = props => {
    const { organisasjonstre, organisasjoner } = useContext(OrganisasjonsListeContext);
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    const [erApen, setErApen] = useState(false);
    const [søketekst, setSøketekst] = useState('');
    const [listeMedOrganisasjonerFraSok, setlisteMedOrganisasjonerFraSok] = useState(
        organisasjonstre
    );

    useEffect(() => {
        setErApen(false);
    }, [valgtOrganisasjon]);

    const brukSøketekst = (event: any) => {
        setSøketekst(event.currentTarget.value);
        setlisteMedOrganisasjonerFraSok(
            byggSokeresultat(organisasjonstre, organisasjoner, søketekst)
        );
    };

    const setOrganisasjonHvisUnderEnhet = (org: JuridiskEnhetMedUnderEnheterArray) => {
        if (org.JuridiskEnhet.Type !== 'Enterprise') {
            props.history.push('/' + org.JuridiskEnhet.OrganizationNumber);
            setErApen(false);
        }
    };

    return (
        <div className={'virksomhetsvelger ' + props.className}>
            <Wrapper
                className="virksomhetsvelger__wrapper"
                onMenuToggle={({ isOpen }) => {
                    setErApen(isOpen);
                }}
                closeOnSelection={false}
                onSelection={(value: JuridiskEnhetMedUnderEnheterArray) =>
                    setOrganisasjonHvisUnderEnhet(value)
                }
            >
                {valgtOrganisasjon !== tomAltinnOrganisasjon && (
                    <Button className="virksomhetsvelger__button">
                        <Virksomhetsikon />
                        <div className="virksomhetsvelger__button-tekst">
                            <Element>{valgtOrganisasjon.Name}</Element>
                            org. nr. {valgtOrganisasjon.OrganizationNumber}
                        </div>
                    </Button>
                )}
                <div className={`virksomhetsvelger__wrapper-${erApen ? 'apen' : 'lukket'}`}>
                    <Collapse isOpened>
                        <Menu className={'virksomhetsvelger'}>
                            <div className={'virksomhetsvelger__vis-valgt-bedrift'}>
                                <Virksomhetsikon />
                                <div className="virksomhetsvelger__vis-valgt-bedrift-tekst">
                                    <Undertittel>{valgtOrganisasjon.Name}</Undertittel>
                                    org. nr. {valgtOrganisasjon.OrganizationNumber}
                                </div>
                            </div>
                            <Undertittel className={'virksomhetsvelger__dine-aktorer-tekst'}>
                                Dine aktører{' '}
                            </Undertittel>
                            <Input
                                type="search"
                                label={''}
                                value={søketekst}
                                onChange={brukSøketekst}
                                placeholder="Søk etter underenheter"
                            />
                            {søketekst.length === 0 && (
                                <img
                                    alt={''}
                                    className={'virksomhetsvelger__input-sok'}
                                    src={sok}
                                />
                            )}
                            {søketekst.length > 0 && (
                                <img
                                    alt={''}
                                    className={'virksomhetsvelger__input-kryss'}
                                    src={kryss}
                                    onClick={() => setSøketekst('')}
                                />
                            )}
                            <div className={'virksomhetsvelger__meny-komponenter-container'}>
                                {søketekst.length === 0 && (
                                    <DefaultMeny menyKomponenter={organisasjonstre} />
                                )}
                                {søketekst.length > 0 && (
                                    <MenyFraSokeresultat
                                        ListeMedObjektFraSok={listeMedOrganisasjonerFraSok}
                                    />
                                )}
                            </div>
                        </Menu>
                    </Collapse>
                </div>
            </Wrapper>
        </div>
    );
};

export default withRouter(Virksomhetsvelger);
