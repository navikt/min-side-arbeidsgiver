import React, {useContext} from 'react';
import {gql, TypedDocumentNode, useQuery,} from '@apollo/client'
import {GQL} from "@navikt/arbeidsgiver-notifikasjon-widget";
import {OrganisasjonsDetaljerContext} from '../../OrganisasjonDetaljerProvider';
import './InnsynISak.less';
import Lenkepanel from "nav-frontend-lenkepanel";
import Lenke from "nav-frontend-lenker";
import {Undertekst, UndertekstBold, Undertittel} from "nav-frontend-typografi";
import {FolderFilled} from "@navikt/ds-icons";


const HENT_SAKER: TypedDocumentNode<Pick<GQL.Query, "saker">> = gql`
    query hentSaker($virksomhetsnummer:String!, $first: Int = 3, $after:String) {
        saker(virksomhetsnummer: $virksomhetsnummer, first: $first, after: $after) {
            edges {
                node {
                    virksomhet {
                        virksomhetsnummer
                        navn
                    }
                    sisteStatus {
                        status {
                            ... on PredefinertStatus { predefinertVerdi }
                            ... on EgendefinertStatus { egendefinertVerdi }
                        }
                        tittel
                        lenke
                        tidspunkt
                    }
                }
            }
            pageInfo {
                endCursor
            }
        }
    }
`

const dateFormat = new Intl.DateTimeFormat('no', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
});

const statusVerdi = (status: GQL.PredefinertStatus | GQL.EgendefinertStatus) => {
    let verdi;
    switch (status.__typename) {
        case 'EgendefinertStatus':
            verdi = status.egendefinertVerdi;
            break;
        case 'PredefinertStatus':
            switch (status.predefinertVerdi) {
                case GQL.StatusEnum.Mottatt:
                    verdi = 'mottatt';
                    break;
                case GQL.StatusEnum.UnderBehandling:
                    verdi = 'under behandling';
                    break;
            }
    }
    return verdi;
}

const InnsynISak = () => {
    const {valgtOrganisasjon} = useContext(OrganisasjonsDetaljerContext);

    if (valgtOrganisasjon === undefined) return null;

    const {loading, data} = useQuery(HENT_SAKER, {
        variables: {
            virksomhetsnummer: valgtOrganisasjon.organisasjon.OrganizationNumber,
        },
    })

    if (loading || data?.saker.edges.length == 0) return null;

    return (
        <div className='innsynisak'>
            <Undertittel className='innsynisak-tittel'>
                <FolderFilled color='#3386E0'/> Siste saker
            </Undertittel>

            <ul>
                {data?.saker.edges.map(({node}) => (
                    <li>
                        <Lenkepanel tittelProps='element' className={'sak-lenkepanel'} href={node.sisteStatus.lenke}>
                            <Undertekst>{node.virksomhet.navn.toUpperCase()}</Undertekst>
                            <Lenke href={node.sisteStatus.lenke}>{node.sisteStatus.tittel}</Lenke>
                            <UndertekstBold>
                                {statusVerdi(node.sisteStatus.status)}{' '}{dateFormat.format(new Date(node.sisteStatus.tidspunkt))}
                            </UndertekstBold>
                        </Lenkepanel>
                    </li>
                ))}

            </ul>
        </div>
    );
};

export default InnsynISak;