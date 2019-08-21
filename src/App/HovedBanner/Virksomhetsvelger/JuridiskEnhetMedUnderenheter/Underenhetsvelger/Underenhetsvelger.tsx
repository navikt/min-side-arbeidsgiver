import React, { FunctionComponent, useState } from 'react';
import { Collapse } from 'react-collapse';
import { NedChevron, OppChevron } from 'nav-frontend-chevron';
import { withRouter, RouteComponentProps } from 'react-router';
import { WrapperState, Wrapper, Button, Menu } from 'react-aria-menubutton';

import { Organisasjon, OverenhetOrganisasjon } from '../../../../../Objekter/organisasjon';
import Underenhet from './Underenhet/Underenhet';
import './Underenhetsvelger.less';

interface Props {
    className?: string;
    hovedOrganisasjon: OverenhetOrganisasjon;
}

const Underenhetsvelger: FunctionComponent<
    Props & RouteComponentProps<{ className: string }>
> = props => {
    const settUrl = (orgnr: string) => {
        props.history.push('/' + orgnr);
    };

    const [erApen, setErApen] = useState(false);

    const OrganisasjonsMenyKomponenter = props.hovedOrganisasjon.UnderOrganisasjoner.map(function(
        organisasjon: Organisasjon
    ) {
        return <Underenhet underEnhet={organisasjon} />;
    });

    return (
        <div className="virksomhets-velger-niva-2">
            <Wrapper
                className="virksomhets-velger-niva-2__wrapper"
                onSelection={(value: string) => settUrl(value)}
                closeOnSelection={false}
                onMenuToggle={(erApen: WrapperState) => {
                    setErApen(erApen.isOpen);
                    if (props.hovedOrganisasjon.overordnetOrg.Type !== 'Enterprise') {
                        settUrl(props.hovedOrganisasjon.overordnetOrg.OrganizationNumber);
                    }
                }}
            >
                <Button className={'virksomhets-velger-niva-2__nedre-button'}>
                    {!erApen && (
                        <>
                            <NedChevron className="virksomhets-velger-niva-2__nedre-button-chevron" />
                            Vis {props.hovedOrganisasjon.UnderOrganisasjoner.length} underenheter
                        </>
                    )}
                    {erApen && (
                        <>
                            <OppChevron className="virksomhets-velger-niva-2__nedre-button-chevron" />
                            Skjul {props.hovedOrganisasjon.UnderOrganisasjoner.length} underenheter
                        </>
                    )}
                </Button>

                <div className="virksomhets-velger-niva-2__meny-wrapper">
                    <Collapse isOpened={true || false}>
                        <Menu className={'virksomhets-velger-niva-2__meny'}>
                            {OrganisasjonsMenyKomponenter}
                        </Menu>
                    </Collapse>
                </div>
            </Wrapper>
        </div>
    );
};

export default withRouter(Underenhetsvelger);
