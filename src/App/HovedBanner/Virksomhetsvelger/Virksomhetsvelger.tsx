import React, { FunctionComponent, useContext, useState, useEffect } from 'react';
import { Collapse } from 'react-collapse';
import { Undertittel } from 'nav-frontend-typografi';
import { withRouter, RouteComponentProps } from 'react-router';
import { Wrapper, Button, Menu } from 'react-aria-menubutton';

import { byggSokeresultat } from './byggSokeresultat';
import {
    JuridiskEnhetMedUnderEnheterArray,
    tomAltinnOrganisasjon,
} from '../../../Objekter/Organisasjoner/OrganisasjonerFraAltinn';
import { OrganisasjonsDetaljerContext } from '../../../OrganisasjonDetaljerProvider';
import { OrganisasjonsListeContext } from '../../../OrganisasjonsListeProvider';
import './Virksomhetsvelger.less';
import DefaultMeny from './MenyValg/DefaultMeny';
import MenyFraSokeresultat from './MenyValg/MenyFraSokeresultat';
import Sokefelt from './Sokefelt/Sokefelt';
import Organisasjonsbeskrivelse from './Organisasjonsbeskrivelse/Organisasjonsbeskrivelse';

interface Props {
    className?: string;
}

const Virksomhetsvelger: FunctionComponent<Props & RouteComponentProps> = props => {
    const { organisasjonstre, organisasjoner } = useContext(OrganisasjonsListeContext);
    const { valgtOrganisasjon } = useContext(OrganisasjonsDetaljerContext);
    const [erApen, setErApen] = useState(false);
    const [soketekst, setSoketekst] = useState('');
    const [listeMedOrganisasjonerFraSok, setlisteMedOrganisasjonerFraSok] = useState(
        organisasjonstre
    );

    useEffect(() => {
        setErApen(false);
    }, [valgtOrganisasjon]);

    const brukSoketekst = (soketekst: string) => {
        setSoketekst(soketekst);
        setlisteMedOrganisasjonerFraSok(
            byggSokeresultat(organisasjonstre, organisasjoner, soketekst)
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
                        <Organisasjonsbeskrivelse
                            navn={valgtOrganisasjon.Name}
                            orgnummer={valgtOrganisasjon.OrganizationNumber}
                        />
                    </Button>
                )}
                <div className={`virksomhetsvelger__wrapper-${erApen ? 'apen' : 'lukket'}`}>
                    <Collapse isOpened>
                        <Menu className={'virksomhetsvelger'}>
                            <div className="virksomhetsvelger__valgtVirksomhet">
                                <Organisasjonsbeskrivelse
                                    brukOverskrift
                                    navn={valgtOrganisasjon.Name}
                                    orgnummer={valgtOrganisasjon.OrganizationNumber}
                                />
                            </div>
                            <Undertittel className={'virksomhetsvelger__dine-aktorer-tekst'}>
                                Dine aktører
                            </Undertittel>
                            <Sokefelt soketekst={soketekst} onChange={brukSoketekst} />
                            <div className={'virksomhetsvelger__meny-komponenter-container'}>
                                {soketekst.length === 0 ? (
                                    <DefaultMeny menyKomponenter={organisasjonstre} />
                                ) : (
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
