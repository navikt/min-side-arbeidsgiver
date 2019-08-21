import React, { FunctionComponent, useContext, useState, useEffect } from 'react';
import { Collapse } from 'react-collapse';
import { Input } from 'nav-frontend-skjema';
import { Undertittel, Element } from 'nav-frontend-typografi';
import { withRouter, RouteComponentProps } from 'react-router';
import { WrapperState, Wrapper, Button, Menu } from 'react-aria-menubutton';

import { byggSokeresultat } from './byggSokeresultat';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import { OrganisasjonsListeContext } from '../../../OrganisasjonsListeProvider';
import {
    JuridiskEnhetMedUnderEnheter,
    tomAltinnOrganisasjon,
} from '../../../Objekter/organisasjon';
import bedriftsikon from './underenhet-ikon.svg';
import hvittbedriftsikon from './hvit-underenhet.svg';
import JuridiskEnhetMedUnderenheter from './JuridiskEnhetMedUnderenheter/JuridiskEnhetMedUnderenheter';
import kryss from './kryss.svg';
import Sokeresultat from './MenyFraSokeresultat';
import sok from './forstorrelsesglass.svg';
import './Virksomhetsvelger.less';

interface Props {
    className?: string;
}

const Virksomhetsvelger: FunctionComponent<Props & RouteComponentProps> = props => {
    const { organisasjonstre, organisasjoner } = useContext(OrganisasjonsListeContext);
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    const [erApen, setErApen] = useState(false);
    const [valgtOrgNavn, setValgtOrgNavn] = useState(' ');
    const [inputTekst, setInputTekst] = useState('');
    const [listeMedOrganisasjonerFraSok, setlisteMedOrganisasjonerFraSok] = useState(
        organisasjonstre
    );

    const HentTekstOgSettState = (event: any) => {
        setInputTekst(event.currentTarget.value);
        setlisteMedOrganisasjonerFraSok(
            byggSokeresultat(organisasjonstre, organisasjoner, inputTekst)
        );
    };

    const setOrganisasjonHvisUnderEnhet = (org: JuridiskEnhetMedUnderEnheter) => {
        if (org.JuridiskEnhet.Type !== 'Enterprise') {
            props.history.push('/' + org.JuridiskEnhet.OrganizationNumber);
            setErApen(false);
        }
    };

    useEffect(() => {
        setErApen(false);
        if (valgtOrganisasjon.Name.length > 23) {
            setValgtOrgNavn(valgtOrganisasjon.Name.substring(0, 22) + '...');
        } else {
            setValgtOrgNavn(valgtOrganisasjon.Name);
        }
    }, [valgtOrganisasjon]);

    const OrganisasjonsMenyKomponenter = organisasjonstre.map(function(organisasjon) {
        return <JuridiskEnhetMedUnderenheter organisasjon={organisasjon} />;
    });

    return (
        <div className={'organisasjons-meny ' + props.className}>
            <Wrapper
                className="organisasjons-meny__wrapper"
                style={{ marginTop: 20 }}
                onMenuToggle={(erApen: WrapperState) => {
                    setErApen(erApen.isOpen);
                }}
                closeOnSelection={false}
                onSelection={(value: JuridiskEnhetMedUnderEnheter) =>
                    setOrganisasjonHvisUnderEnhet(value)
                }
            >
                {valgtOrganisasjon !== tomAltinnOrganisasjon && (
                    <Button className="organisasjons-meny__button">
                        <img
                            alt={'ikon for bedrift'}
                            className={'organisasjons-meny__button__bedrifts-ikon'}
                            src={bedriftsikon}
                        />
                        <img
                            alt={'ikon for bedrift'}
                            className={'organisasjons-meny__button__hvitt-ikon'}
                            src={hvittbedriftsikon}
                        />
                        <div className="organisasjons-meny__button-tekst">
                            <Element>{valgtOrgNavn}</Element>
                            org. nr. {valgtOrganisasjon.OrganizationNumber}
                        </div>
                    </Button>
                )}
                <div
                    className={
                        erApen
                            ? 'organisasjons-meny__wrapper-apen'
                            : 'organisasjons-meny__wrapper-lukket'
                    }
                >
                    <Collapse isOpened={true || false}>
                        <Menu className={'organisasjons-meny'}>
                            <div className={'organisasjons-meny__vis-valgt-bedrift'}>
                                <img alt={'ikon for bedrift'} src={bedriftsikon} />
                                <div className="organisasjons-meny__vis-valgt-bedrift-tekst">
                                    <Undertittel>{valgtOrganisasjon.Name}</Undertittel>
                                    org. nr. {valgtOrganisasjon.OrganizationNumber}
                                </div>
                            </div>
                            <Undertittel className={'organisasjons-meny__dine-aktorer-tekst'}>
                                Dine aktører{' '}
                            </Undertittel>
                            <Input
                                type="search"
                                label={''}
                                value={inputTekst}
                                onChange={HentTekstOgSettState}
                                placeholder="Søk etter underenheter"
                            />
                            {inputTekst.length === 0 && (
                                <img
                                    alt={''}
                                    className={'organisasjons-meny__input-sok'}
                                    src={sok}
                                />
                            )}
                            {inputTekst.length > 0 && (
                                <img
                                    alt={''}
                                    className={'organisasjons-meny__input-kryss'}
                                    src={kryss}
                                    onClick={() => setInputTekst('')}
                                />
                            )}
                            <div className={'organisasjons-meny__meny-komponenter-container'}>
                                {inputTekst.length === 0 && OrganisasjonsMenyKomponenter}
                                {inputTekst.length > 0 && (
                                    <>
                                        <Sokeresultat
                                            ListeMedObjektFraSok={listeMedOrganisasjonerFraSok}
                                        />
                                    </>
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
