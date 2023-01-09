import React, {FunctionComponent, useContext, useEffect, useState} from 'react';
import { OrganisasjonsDetaljerContext } from '../../OrganisasjonDetaljerProvider';
import * as Sentry from "@sentry/browser";
import Arbeidsforholdboks from './Arbeidsforholdboks/Arbeidsforholdboks';
import Syfoboks from './Syfoboks/Syfoboks';
import Pamboks from './Pamboks/Pamboks';
import Kandidatlisteboks from "./Kandidatlisteboks/Kandidatlisteboks";
import Tiltakboks from './Tiltakboks/Tiltakboks';
import IAwebboks from './IAwebboks/IAwebboks';
import TiltakRefusjonboks from './TiltakRefusjonboks/TiltakRefusjonboks';
import './TjenesteBoksContainer.css';
import {hentPushbokser, Pushboks} from "../../../api/dnaApi";
import {Tjenesteboks} from "./Tjenesteboks";
import arbeidsforholdikon from "./Arbeidsforholdboks/arbeidsforholdikon.svg";
import {z} from "zod";

const FooboksProps = z.object({
    virksomhetsnummer: z.string(),
    innhold: z.object({
        foo: z.string(),
    }),
})
type FooboksProps = z.infer<typeof FooboksProps>
const Fooboks : FunctionComponent<FooboksProps> = (props : FooboksProps) => {
    let data: FooboksProps;
    try {
        data = FooboksProps.parse(props)
    } catch (error) {
        Sentry.captureException(error)
        return null;
    }
    return <Tjenesteboks
        ikon={arbeidsforholdikon}
        href='#foo'
        tittel='Foo'
        aria-label='Foo to the bar'
    >
        <div className='fooboks'>
            <span> <span>"{data.innhold.foo}"</span> is your foo!</span>
            <div>::{data.virksomhetsnummer}::</div>
        </div>
    </Tjenesteboks>;
};
type TjenestePushboksProp = {
    virksomhetsnummer: string,
    innhold: any
}
const TjenestePushbokser : Record<string, FunctionComponent<TjenestePushboksProp>> = {
    "foo": Fooboks,
}
const TjenesteBoksContainer: FunctionComponent = () => {
    const {valgtOrganisasjon} = useContext(OrganisasjonsDetaljerContext);
    const [pushbokser, setPushbokser] = useState<Pushboks[]>([]);

    useEffect(() => {
        const _hentPushbokser = async () => {
            if (valgtOrganisasjon == null) {
                return
            }
            const result = await hentPushbokser(valgtOrganisasjon.organisasjon.OrganizationNumber);
            setPushbokser(result)
        }

        _hentPushbokser().catch(Sentry.captureException)
    }, [valgtOrganisasjon]);

    if (valgtOrganisasjon === undefined) {
        return null;
    }

    const tjenester: FunctionComponent[] = [];

    if (valgtOrganisasjon.altinntilgang.arbeidsforhold) {
        tjenester.push(Arbeidsforholdboks);
    }

    if (valgtOrganisasjon.syfotilgang) {
        tjenester.push(Syfoboks);
    }

    if (valgtOrganisasjon.altinntilgang.iaweb) {
        tjenester.push(IAwebboks);
    }

    if (valgtOrganisasjon.altinntilgang.rekruttering) {
        tjenester.push(Kandidatlisteboks);
        tjenester.push(Pamboks);
    }

    if (valgtOrganisasjon.altinntilgang.midlertidigLønnstilskudd
        || valgtOrganisasjon.altinntilgang.varigLønnstilskudd
        || valgtOrganisasjon.altinntilgang.arbeidstrening
        || valgtOrganisasjon.altinntilgang.mentortilskudd
        || valgtOrganisasjon.altinntilgang.inkluderingstilskudd
    ) {
        tjenester.push(Tiltakboks);
    }

    if (valgtOrganisasjon.altinntilgang.inntektsmelding && valgtOrganisasjon.refusjonstatustilgang) {
        tjenester.push(TiltakRefusjonboks);
    }

    return (
        <div className={'tjenesteboks-container'}>
            {pushbokser.map((pushboks, indeks) => {
                const Boks = TjenestePushbokser[pushboks.tjeneste]
                if (Boks == null) return <></>

                return <Boks key={indeks} virksomhetsnummer={pushboks.virksomhetsnummer} innhold={pushboks.innhold}/>
            })}
            {tjenester.map((Tjeneste, indeks) =>
                <Tjeneste key={indeks} />
            )}
        </div>
    );
};

export default TjenesteBoksContainer;
