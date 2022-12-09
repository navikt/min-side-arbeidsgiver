import React, {FunctionComponent, useState} from 'react';
import {Alert, Link} from '@navikt/ds-react';
import {Link as LinkIcon} from "@navikt/ds-icons";
import "@navikt/ds-css";

interface ClipBoardLinkProps {
    hash: string;
}

export const ClipBoardLink: FunctionComponent<ClipBoardLinkProps> = ({hash}) => {
    if (navigator.clipboard === undefined) {
        return null;
    }
    const targetUrl = new URL(window.location.href)
    targetUrl.hash = hash
    const [showAlert, setShowAlert] = useState<boolean>(false);
    const copyLink = () => {
        navigator.clipboard.writeText(targetUrl.toString()).then(
            () => {
                setShowAlert(true);
            },
            () => {
                /* err */
            }
        );
    }
    return (
        <div className='copy-link'>
            <Link onClick={copyLink}><LinkIcon title="lenkeikon" aria-hidden="true" /> Kopier lenke</Link>
            <Alert variant='success' size='small' className={showAlert ? 'alert-show' : 'alert-hide'}
                   onAnimationEnd={() => setShowAlert(false)}>
                Lenken er kopiert
            </Alert>
        </div>
    )
}