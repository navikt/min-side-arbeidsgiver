import React, { FunctionComponent, useState, useEffect } from 'react';
import { Collapse } from 'react-collapse';
import { Undertittel } from 'nav-frontend-typografi';
import { withRouter, RouteComponentProps } from 'react-router';
import { Wrapper, Button, Menu } from 'react-aria-menubutton';

import { byggSokeresultat } from './byggSokeresultat';
import {
    JuridiskEnhetMedUnderEnheterArray,
    tomAltinnOrganisasjon,
    Organisasjon,
} from '../../../Objekter/Organisasjoner/OrganisasjonerFraAltinn';
import DefaultMeny from './MenyValg/DefaultMeny';
import MenyFraSokeresultat from './MenyValg/MenyFraSokeresultat';
import Organisasjonsbeskrivelse from './Organisasjonsbeskrivelse/Organisasjonsbeskrivelse';
import Sokefelt from './Sokefelt/Sokefelt';
import './Virksomhetsvelger.less';

interface EgneProps {
    organisasjoner: Organisasjon[];
    organisasjonstre: JuridiskEnhetMedUnderEnheterArray[];
    valgtOrganisasjon: Organisasjon;
}

type Props = EgneProps & RouteComponentProps;

const Virksomhetsvelger: FunctionComponent<Props> = props => {
    const { organisasjoner, organisasjonstre, valgtOrganisasjon } = props;
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

    const setOrganisasjon = (orgnr: string) => {
        props.history.push('/' + orgnr);
        setErApen(false);
    };

    return (
        <div className="virksomhetsvelger">
            <Wrapper
                className="virksomhetsvelger__wrapper"
                closeOnSelection={false}
                onSelection={(value: string) => setOrganisasjon(value)}
                onMenuToggle={({ isOpen }) => {
                    setErApen(isOpen);
                }}
            >
                {valgtOrganisasjon !== tomAltinnOrganisasjon && (
                    <Button className="virksomhetsvelger__button">
                        <Organisasjonsbeskrivelse
                            navn={valgtOrganisasjon.Name}
                            orgnummer={valgtOrganisasjon.OrganizationNumber}
                        />
                    </Button>
                )}

                <div className={`virksomhetsvelger__wrapper--${erApen ? 'apen' : 'lukket'}`}>
                    <Collapse isOpened={erApen}>
                        <Menu className="virksomhetsvelger__dropdown">
                            <div className="virksomhetsvelger__valgtVirksomhet">
                                <Organisasjonsbeskrivelse
                                    brukOverskrift
                                    navn={valgtOrganisasjon.Name}
                                    orgnummer={valgtOrganisasjon.OrganizationNumber}
                                />
                            </div>
                            <Undertittel className="virksomhetsvelger__overskrift">
                                Dine aktører
                            </Undertittel>
                            <Sokefelt soketekst={soketekst} onChange={brukSoketekst} />
                            <div className="virksomhetsvelger__meny">
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
