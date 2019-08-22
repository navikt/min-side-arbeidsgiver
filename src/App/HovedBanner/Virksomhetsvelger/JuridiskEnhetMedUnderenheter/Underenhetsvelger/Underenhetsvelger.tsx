import React, { FunctionComponent, useState } from 'react';
import { Collapse } from 'react-collapse';
import { NedChevron, OppChevron } from 'nav-frontend-chevron';
import { withRouter, RouteComponentProps } from 'react-router';
import { Wrapper, Button, Menu } from 'react-aria-menubutton';

import {
    Organisasjon,
    JuridiskEnhetMedUnderEnheterArray,
} from '../../../../../Objekter/Organisasjoner/OrganisasjonerFraAltinn';
import Underenhet from './Underenhet/Underenhet';
import './Underenhetsvelger.less';

interface EgneProps {
    hovedOrganisasjon: JuridiskEnhetMedUnderEnheterArray;
}

type Props = EgneProps & RouteComponentProps;

const Underenhetsvelger: FunctionComponent<Props> = ({ history, hovedOrganisasjon }) => {
    const settUrl = (orgnr: string) => {
        history.push('/' + orgnr);
    };

    const [visUnderenheter, setVisUnderenheter] = useState(false);

    return (
        <div className="virksomhets-velger-niva-2">
            <Wrapper
                className="virksomhets-velger-niva-2__wrapper"
                onSelection={(value: string) => settUrl(value)}
                closeOnSelection={false}
                onMenuToggle={({ isOpen }) => {
                    setVisUnderenheter(isOpen);
                    if (hovedOrganisasjon.JuridiskEnhet.Type !== 'Enterprise') {
                        settUrl(hovedOrganisasjon.JuridiskEnhet.OrganizationNumber);
                    }
                }}
            >
                <Button className={'virksomhets-velger-niva-2__nedre-button'}>
                    {visUnderenheter ? (
                        <>
                            <OppChevron className="virksomhets-velger-niva-2__nedre-button-chevron" />
                            Skjul {hovedOrganisasjon.Underenheter.length} underenheter
                        </>
                    ) : (
                        <>
                            <NedChevron className="virksomhets-velger-niva-2__nedre-button-chevron" />
                            Vis {hovedOrganisasjon.Underenheter.length} underenheter
                        </>
                    )}
                </Button>

                <div className="virksomhets-velger-niva-2__meny-wrapper">
                    <Collapse isOpened>
                        <Menu className={'virksomhets-velger-niva-2__meny'}>
                            {hovedOrganisasjon.Underenheter.map((organisasjon: Organisasjon) => (
                                <Underenhet key={organisasjon.Name} underEnhet={organisasjon} />
                            ))}
                        </Menu>
                    </Collapse>
                </div>
            </Wrapper>
        </div>
    );
};

export default withRouter(Underenhetsvelger);
