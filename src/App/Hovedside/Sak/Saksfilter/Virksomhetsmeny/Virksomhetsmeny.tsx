import React, {useRef, useState} from "react"
import {BodyShort, Button, CheckboxGroup, Search} from "@navikt/ds-react";
import {Collapse, Expand} from "@navikt/ds-icons";
import "./Virksomhetsmeny.css"
import {EkstraChip, VirksomhetChips} from "../VirksomhetChips";
import {UnderenhetCheckboks} from "./UnderenhetCheckboks";
import {HovedenhetCheckbox} from "./HovedenhetCheckbox";
import fuzzysort from 'fuzzysort';
import {Hovedenhet} from "../Virksomhetsikoner/Virksomhetsikoner";

export type Props = {
    organisasjonstre: OrganisasjonEnhet[],
    valgteEnheter: Organisasjon[] | "ALLEBEDRIFTER",
    settValgteEnheter: (enheter: Organisasjon[] | "ALLEBEDRIFTER") => void,
    juridiskEnhetEkspandert?: boolean,
}

export type OrganisasjonEnhet = {
    juridiskEnhet: Organisasjon,
    organisasjoner: Organisasjon[]
}


export type Organisasjon = {
    Name: string,
    Type: string,
    OrganizationNumber: string,
    OrganizationForm: string,
    Status: string,
    ParentOrganizationNumber: string | null,
}
/**
 *
 * @param organisasjonstre
 * @param valgteEnheter
 * @param settValgteEnheter
 * @param juridiskEnhetEkspandert Default 'true', vil styre om det skal sendes
 * kun organisasjoner/underenheter til valgteEnheter. Ved å velge 'false', vil juridisk enhet sendes uten at
 * tilhørende organisasjoner hentes ut eksplisitt.
 * @constructor
 */
export const Virksomhetsmeny = ({
                                    organisasjonstre,
                                    valgteEnheter,
                                    settValgteEnheter,
                                    juridiskEnhetEkspandert = true
                                }: Props) => {
    const alleVirksomheter = organisasjonstre
        .map(({juridiskEnhet, organisasjoner}): Hovedenhet => {
            const juridiskEnhetValgt = valgteEnheter === "ALLEBEDRIFTER" ||
                valgteEnheter.some(v => v.OrganizationNumber === juridiskEnhet.OrganizationNumber)
            return {
                ...juridiskEnhet,
                valgt: juridiskEnhetValgt ||
                    organisasjoner.every(underenhet =>
                        valgteEnheter.some(v => v.OrganizationNumber === underenhet.OrganizationNumber)
                    ),
                åpen: !juridiskEnhetValgt &&
                    organisasjoner.some(underenhet => valgteEnheter.some(v => v.OrganizationNumber === underenhet.OrganizationNumber)),
                søkMatch: true,
                underenheter: organisasjoner.map((organisasjon): Underenhet => {
                    return {
                        ...organisasjon,
                        valgt: juridiskEnhetValgt || valgteEnheter.some((valgtEnhet) => organisasjon.OrganizationNumber === valgtEnhet.OrganizationNumber),
                        søkMatch: true,
                    }
                })
            }
        })

    const handlesettValgteEnheter = (valgteEnheter: Array<Underenhet | Hovedenhet>) => {
        const hovedenheterValgt = valgteEnheter.filter(ve => "underenheter" in ve)
        const alleHovedenheterValgt = hovedenheterValgt.length === organisasjonstre.length
        if (alleHovedenheterValgt) {
            settValgteEnheter("ALLEBEDRIFTER")
            return
        }
        settValgteEnheter(valgteEnheter.flatMap(enhet => {
            if ("underenheter" in enhet) {
                return juridiskEnhetEkspandert ? enhet.underenheter : [enhet]
            } else {
                return [enhet]
            }
        }))
    }

    return <VirksomhetsmenyIntern alleVirksomheter={alleVirksomheter} setValgteVirksomheter={handlesettValgteEnheter}/>
}


export interface Underenhet extends Organisasjon {
    valgt: boolean,
    søkMatch: boolean,
}

export interface Hovedenhet extends Organisasjon {
    valgt: boolean,
    åpen: boolean,
    søkMatch: boolean,
    underenheter: Array<Underenhet>,
}

type VirksomhetsmenyProps = {
    alleVirksomheter: Array<Hovedenhet>,
    setValgteVirksomheter: (a: Array<Underenhet | Hovedenhet>) => void,
}

const useOnClickOutside = (ref: React.RefObject<HTMLDivElement>, handler: (event: MouseEvent | TouchEvent) => void) => {
    React.useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {

            if (!ref.current || ref.current.contains(event.target as Node)) {
                return;
            }
            handler(event);
        };
        document.addEventListener("mousedown", listener);
        document.addEventListener("touchstart", listener);
        return () => {
            document.removeEventListener("mousedown", listener);
            document.removeEventListener("touchstart", listener);
        };
    }, [ref, handler]);
}


const VirksomhetsmenyIntern = ({
                                   alleVirksomheter,
                                   setValgteVirksomheter
                               }: VirksomhetsmenyProps) => {
    const [alleVirksomheterIntern, setAlleVirksomheterIntern] = useState(alleVirksomheter);

    const [virksomhetsmenyÅpen, setVirksomhetsmenyÅpen] = useState(false);
    const virksomhetsmenyRef = useRef<HTMLDivElement>(null);

    const valgteVirksomheter: Array<Hovedenhet | Underenhet> = alleVirksomheter.flatMap(Hovedenhet => {
        if (Hovedenhet.valgt) {
            return [Hovedenhet]
        } else {
            return Hovedenhet.underenheter.filter(underenhet => underenhet.valgt)
        }
    })

    useOnClickOutside(virksomhetsmenyRef, () => virksomhetsmenyÅpen && oppdaterValgte(alleVirksomheterIntern, "lukk"));


    const settAlleTil = (valgt: boolean): Array<Hovedenhet> =>
        alleVirksomheterIntern.map(hovedenhet => ({
            ...hovedenhet,
            valgt: valgt,

            underenheter: hovedenhet.underenheter.map(underenhet => ({
                ...underenhet,
                valgt: valgt
            }))
        }));

    const oppdaterValgte = (
        valgte: Array<Hovedenhet>,
        commit: "lukk" | "forbliÅpen"
    ) => {

        if (commit === "lukk") {
            const virksomheter = valgte.flatMap<Underenhet | Hovedenhet>(hovedenhet => {
                if (hovedenhet.valgt) {
                    return [hovedenhet]
                } else {
                    return hovedenhet.underenheter.filter(underenhet => underenhet.valgt)
                }
            });
            setValgteVirksomheter(
                virksomheter
            )
            setVirksomhetsmenyÅpen(false)
            setAlleVirksomheterIntern(valgte.map(hovedenhet => ({
                ...hovedenhet,
                åpen: hovedenhet.underenheter.some(underenhet =>
                    virksomheter.some(v => v.OrganizationNumber === underenhet.OrganizationNumber)
                ),
                søkMatch: true,
                underenheter: hovedenhet.underenheter.map(underenhet => ({
                    ...underenhet,
                    søkMatch: true,
                }))
            })))
        } else if (commit === "forbliÅpen") {
            setAlleVirksomheterIntern(valgte)
        }
    }


    return <div className="virksomheter">
        <div className="virksomheter_container" ref={virksomhetsmenyRef}>
            <button
                className="virksomheter_menyknapp"
                onClick={() => {
                    if (virksomhetsmenyÅpen) {
                        oppdaterValgte(alleVirksomheterIntern, "lukk")
                    } else {
                        setVirksomhetsmenyÅpen(true)
                    }
                }}
            >
                <BodyShort> Velg virksomheter </BodyShort>
                {virksomhetsmenyÅpen ? <Collapse aria-hidden={true}/> : <Expand aria-hidden={true}/>}
            </button>
            {virksomhetsmenyÅpen ?
                <div className="virksomheter_virksomhetsmeny">
                    <div className="virksomheter_virksomhetsmeny_sok">
                        <Search
                            label="Søk etter virksomhet"
                            variant="simple"
                            onChange={(søkeord) => {
                                if (søkeord.length === 0) {
                                    setAlleVirksomheterIntern(
                                        alleVirksomheterIntern.map(hovedenhet => {
                                                return ({
                                                    ...hovedenhet,
                                                    søkMatch: true,
                                                    åpen: hovedenhet.valgt || hovedenhet.underenheter.some(underenhet => underenhet.valgt),
                                                    underenheter: hovedenhet.underenheter.map(underenhet => {
                                                        return {
                                                            ...underenhet,
                                                            søkMatch: true
                                                        }
                                                    })
                                                });
                                            }
                                        )
                                    )
                                } else {
                                    const flatArrayAlleEnheter = alleVirksomheterIntern.flatMap(hovedenhet => [hovedenhet, ...hovedenhet.underenheter]);
                                    const fuzzyResultsNavn = fuzzysort.go(søkeord, flatArrayAlleEnheter, {keys: ['Name', "OrganizationNumber"]});
                                    const fuzzyResultsUnique = new Set(fuzzyResultsNavn.map(({obj}) => obj));
                                    const søksreslutater = alleVirksomheterIntern.map(hovedenhet => {
                                        const isOrHasMatch = fuzzyResultsUnique.has(hovedenhet) || hovedenhet.underenheter.some(underenhet => fuzzyResultsUnique.has(underenhet));
                                        return {
                                            ...hovedenhet,
                                            søkMatch: isOrHasMatch,
                                            åpen: isOrHasMatch || hovedenhet.underenheter.some(underenhet => underenhet.valgt),
                                            underenheter: hovedenhet.underenheter.map(underenhet => {
                                                return {
                                                    ...underenhet,
                                                    søkMatch: fuzzyResultsUnique.has(underenhet)
                                                }
                                            })
                                        }
                                    })
                                    setAlleVirksomheterIntern(søksreslutater);
                                }
                            }}/>
                    </div>
                    <CheckboxGroup
                        className="virksomheter_virksomhetsmeny_sok_checkbox"
                        legend="Velg virksomheter"
                        hideLegend
                        value={
                            alleVirksomheterIntern
                                .flatMap(hovedenhet => [hovedenhet, ...hovedenhet.underenheter])
                                .filter(enhet => enhet.valgt)
                                .map(enhet => enhet.OrganizationNumber)
                        }

                        onChange={(e) => {
                            setAlleVirksomheterIntern(alleVirksomheterIntern.map(hovedenhet => {
                                if (e.includes(hovedenhet.OrganizationNumber) !== hovedenhet.valgt) {
                                    return {
                                        ...hovedenhet,
                                        valgt: e.includes(hovedenhet.OrganizationNumber),
                                        underenheter: hovedenhet.underenheter.map((underenhet) =>
                                            ({
                                                ...underenhet,
                                                valgt: e.includes(hovedenhet.OrganizationNumber)
                                            })
                                        )
                                    }
                                } else {
                                    return {
                                        ...hovedenhet,
                                        valgt: hovedenhet.underenheter.every(underenhet => e.includes(underenhet.OrganizationNumber)),
                                        underenheter: hovedenhet.underenheter.map((underenhet) =>
                                            ({
                                                ...underenhet,
                                                valgt: e.includes(underenhet.OrganizationNumber)
                                            })
                                        )
                                    }
                                }
                            }))
                        }}
                    >
                        {
                            alleVirksomheterIntern.map((hovedenhet) => {
                                    return hovedenhet.søkMatch ?
                                        <div key={hovedenhet.OrganizationNumber}>
                                            <HovedenhetCheckbox
                                                hovedenhet={hovedenhet}
                                                erÅpen={hovedenhet.åpen}
                                                toggleÅpen={() => {
                                                    setAlleVirksomheterIntern(alleVirksomheterIntern.map(hovedenhetIntern => {
                                                            return {
                                                                ...hovedenhetIntern,
                                                                åpen: hovedenhetIntern.OrganizationNumber === hovedenhet.OrganizationNumber ? !hovedenhetIntern.åpen : hovedenhetIntern.åpen
                                                            }
                                                        }
                                                    ))
                                                }}
                                            >
                                                {
                                                    hovedenhet.underenheter.map((underenhet) =>
                                                        underenhet.søkMatch ?
                                                            <UnderenhetCheckboks key={underenhet.OrganizationNumber}
                                                                                 underenhet={underenhet}/> : null
                                                    )
                                                }
                                            </HovedenhetCheckbox>
                                        </div> :
                                        null;
                                }
                            )}
                    </CheckboxGroup>
                    <div className="virksomheter_virksomhetsmeny_footer">
                        <Button
                            onClick={() => {
                                oppdaterValgte(alleVirksomheterIntern, "lukk")
                            }}
                        > Velg
                        </Button>
                        <Button
                            onClick={() => {
                                oppdaterValgte(settAlleTil(true), "lukk")
                            }}
                            variant="secondary"
                        > Velg alle </Button>
                        <Button
                            variant="tertiary"
                            onClick={() => {
                                oppdaterValgte(settAlleTil(false), "forbliÅpen")
                            }}
                        >
                            Fjern alle
                        </Button>
                    </div>


                </div> : null}
        </div>
        <ul className="saksfilter_vis-valgte">
            {valgteVirksomheter.map((virksomhet, indeks) =>
                indeks < 7 ?
                    <VirksomhetChips
                        key={virksomhet.OrganizationNumber}
                        navn={virksomhet.Name}
                        orgnr={virksomhet.OrganizationNumber}
                        antallUndervirksomheter={"underenheter" in virksomhet ? virksomhet.underenheter?.length : null}
                        onLukk={() => {
                            const tilstandUtenVirksomhet = alleVirksomheterIntern.map(hovedenhet => {
                                if (hovedenhet.OrganizationNumber === virksomhet.OrganizationNumber) {
                                    return {
                                        ...hovedenhet,
                                        valgt: false,
                                        underenheter: hovedenhet.underenheter.map(underenhet => ({
                                            ...underenhet,
                                            valgt: false
                                        }))
                                    }
                                } else {
                                    return {
                                        ...hovedenhet,
                                        underenheter: hovedenhet.underenheter.map(underenhet =>
                                            underenhet.OrganizationNumber === virksomhet.OrganizationNumber ?
                                                {...underenhet, valgt: false} :
                                                underenhet
                                        )
                                    }
                                }

                            });
                            oppdaterValgte(tilstandUtenVirksomhet, "lukk")
                        }}
                    />
                    : indeks === 7 ?
                        <EkstraChip key="ekstraUnderenheter" antall={valgteVirksomheter.length}/>
                        : null
            )}
        </ul>
    </div>;
}