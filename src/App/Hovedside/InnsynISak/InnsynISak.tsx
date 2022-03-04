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
    query hentSaker($virksomhetsnummer: String!) {
        saker(virksomhetsnummer: $virksomhetsnummer) {
            saker {
                id
                tittel
                lenke
                merkelapp
                virksomhet {
                    navn
                    virksomhetsnummer
                }
                sisteStatus {
                    type
                    tekst
                    tidspunkt
                }
            }
            feilAltinn
        }
    }
`

const dateFormat = new Intl.DateTimeFormat('no', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
});

const InnsynISak = () => {
    const {valgtOrganisasjon} = useContext(OrganisasjonsDetaljerContext);

    if (valgtOrganisasjon === undefined) return null;

    const {loading, data} = useQuery(HENT_SAKER, {
        variables: {
            virksomhetsnummer: valgtOrganisasjon.organisasjon.OrganizationNumber,
        },
    })

    if (loading || !data || data?.saker.saker.length == 0) return null;

    return (
        <div className='innsynisak'>
            <Undertittel className='innsynisak__tittel'>
                <FolderFilled color='#3386E0' className='folder-icon'/>Siste saker
            </Undertittel>

            <ul>
                {data?.saker.saker.map(({id, tittel, lenke, sisteStatus, virksomhet, merkelapp}) => (
                    <li key={id}>
                        <Lenkepanel tittelProps='element' href={lenke}>
                            <Undertekst>{virksomhet.navn.toUpperCase()}</Undertekst>
                            <Lenke className='innsynisak__lenke' href={lenke}>{tittel}</Lenke>
                            <UndertekstBold>
                                {sisteStatus.tekst}{' '}{dateFormat.format(new Date(sisteStatus.tidspunkt))}
                            </UndertekstBold>
                        </Lenkepanel>
                    </li>
                ))}

            </ul>
        </div>
    );
};

export default InnsynISak;