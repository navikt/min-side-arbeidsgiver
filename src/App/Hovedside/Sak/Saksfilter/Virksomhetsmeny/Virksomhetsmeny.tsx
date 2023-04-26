import React, {useEffect, useRef, useState} from "react"
import {BodyShort, Button, CheckboxGroup, Search} from "@navikt/ds-react";
import {Collapse, Expand} from "@navikt/ds-icons";
import "./Virksomhetsmeny.css"
import {EkstraChip, VirksomhetChips} from "../VirksomhetChips";
import {UnderenhetCheckboks} from "./UnderenhetCheckboks";
import {HovedenhetCheckbox} from "./HovedenhetCheckbox";
import fuzzysort from 'fuzzysort';
import {count, sum} from '../../../../../utils/util';
import amplitude from '../../../../../utils/amplitude';
import {useLoggKlikk} from '../../../../../utils/funksjonerForAmplitudeLogging';
import {useKeyboardEvent} from "../../../../hooks/useKeyboardEvent";
import {useOnClickOutside} from "../../../../hooks/UseOnClickOutside";

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
                    organisasjoner.some(underenhet => valgteEnheter.some(v => v.OrganizationNumber === underenhet.OrganizationNumber)) &&
                    !organisasjoner.every(underenhet => valgteEnheter.some(v => v.OrganizationNumber === underenhet.OrganizationNumber)),
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

    return <VirksomhetsmenyIntern alleVirksomheter={alleVirksomheter} setValgteVirksomheter={handlesettValgteEnheter} valgteEnheter = {valgteEnheter}/>
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
    valgteEnheter: Organisasjon[] | "ALLEBEDRIFTER",
}

const kunValgteVirksomheter = (virksomheter: Hovedenhet[]): Array<Hovedenhet | Underenhet> =>
    virksomheter.flatMap(hovedenhet => {
        if (hovedenhet.valgt) {
            return [hovedenhet]
        } else {
            return hovedenhet.underenheter.filter(underenhet => underenhet.valgt)
        }
    })

const VirksomhetsmenyIntern = ({ alleVirksomheter, setValgteVirksomheter, valgteEnheter }: VirksomhetsmenyProps) => {
    const [alleVirksomheterIntern, setAlleVirksomheterIntern] = useState(alleVirksomheter);
    const [virksomhetsmenyÅpen, setVirksomhetsmenyÅpen] = useState(false);
    const virksomhetsmenyRef = useRef<HTMLDivElement>(null);
    const loggVelgKlikk = useLoggKlikk("velg")
    const loggVelgAlleKlikk = useLoggKlikk("velg alle")
    const loggFjernAlleKlikk = useLoggKlikk("fjern alle")
    const loggVelgUtenforKlikk = useLoggKlikk("velg utenfor")
    const searchRef = useRef<HTMLInputElement>(null)
    const fjernAlleKnappRef = useRef<HTMLButtonElement>(null)
    const velgKnappRef = useRef<HTMLButtonElement>(null)
    const focusSearch = () => {
        searchRef.current?.focus()
    }
    const focusFjernAlleKnapp = () => {
        fjernAlleKnappRef.current?.focus()
    }
    const focusVelgKnapp = () => {
        velgKnappRef.current?.focus()
    }
    const amplitudeValgteVirksomheter = (valgte: Array<Hovedenhet>) => {
        amplitude.logEvent("velg-virksomheter", {
            antallHovedenheterValgt: count(valgte, hovedenhet => hovedenhet.valgt),
            antallHovedenheterTotalt: alleVirksomheter.length,
            antallUnderenheterValgt: sum(valgte, hovedenhet =>
                count(hovedenhet.underenheter, underenhet => underenhet.valgt)
            ),
            antallUnderenheterEksplisittValgt: sum(valgte, hovedenhet =>
                hovedenhet.valgt ? 0 : count(hovedenhet.underenheter, underenhet => underenhet.valgt)
            ),
            antallUnderenheterTotalt: sum(valgte, hovedenhet => hovedenhet.underenheter.length),
        })
    };

    const valgteVirksomheter = kunValgteVirksomheter(alleVirksomheter)
    const [valgtEnhet, setValgtEnhet] = useState(valgteVirksomheter[0] ?? alleVirksomheterIntern[0])
    const enhetRefs: Record<string, HTMLInputElement> = {}
    const focusEnhet = () => {
        let organizationNumber = valgtEnhet?.OrganizationNumber;
        enhetRefs[organizationNumber]?.focus()
        enhetRefs[organizationNumber]?.scrollIntoView({behavior: "smooth", block: "nearest", inline: "nearest"})
    }
    useEffect(() => {
        if (virksomhetsmenyÅpen) {
            focusEnhet()
        }
    }, [virksomhetsmenyÅpen, valgtEnhet])

    useOnClickOutside(virksomhetsmenyRef, () => {
        if (virksomhetsmenyÅpen) {
            loggVelgUtenforKlikk()
            oppdaterValgte(alleVirksomheterIntern, 'lukk');
        }
    });

    useKeyboardEvent('keydown', virksomhetsmenyRef,(event) => {
        if (event.key === 'Escape') {
            if (virksomhetsmenyÅpen) {
                oppdaterValgte(alleVirksomheterIntern, 'lukk');
            }
        }
    })

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
            const virksomheter = kunValgteVirksomheter(valgte)
            setValgtEnhet(virksomheter[0])
            setValgteVirksomheter(virksomheter)
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
            amplitudeValgteVirksomheter(valgte)
        } else if (commit === "forbliÅpen") {
            setAlleVirksomheterIntern(valgte)
        }
    }

    return <div className="virksomheter">
        <div className="virksomheter_container" ref={virksomhetsmenyRef}>
            <button
                className="virksomheter_menyknapp"
                aria-haspopup="true"
                aria-controls="virksomheter_virksomhetsmeny"
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
                <div id="virksomheter_virksomhetsmeny" className="virksomheter_virksomhetsmeny" role="menu">
                    <div className="virksomheter_virksomhetsmeny_sok">
                        <Search
                            ref={searchRef}
                            label="Søk etter virksomhet"
                            variant="simple"
                            onKeyDown={(event) => {
                                if (event.key === 'Tab') {
                                    if (event.shiftKey) {
                                        focusFjernAlleKnapp()
                                    } else {
                                        focusEnhet()
                                    }
                                    event.preventDefault()
                                }
                            }}
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
                        onKeyDown={(e) => {
                            if (e.key === 'Tab') {
                                if (e.shiftKey) {
                                    focusSearch()
                                } else {
                                    focusVelgKnapp()
                                }
                                e.preventDefault()
                            }
                            if (e.key === 'Home') {
                                setValgtEnhet(alleVirksomheterIntern[0])
                                e.preventDefault()
                            }
                            if (e.key === 'End') {
                                let sisteEnhet = alleVirksomheterIntern[alleVirksomheterIntern.length - 1]
                                if (sisteEnhet.åpen && sisteEnhet.underenheter.length > 0) {
                                    setValgtEnhet(sisteEnhet.underenheter[sisteEnhet.underenheter.length - 1])
                                } else {
                                    setValgtEnhet(sisteEnhet)
                                }
                                e.preventDefault()
                            }
                            if (e.key === 'Enter') {
                                oppdaterValgte(alleVirksomheterIntern.map(hovedenhet => {
                                    if (hovedenhet.OrganizationNumber === valgtEnhet.OrganizationNumber) {
                                        return {
                                            ...hovedenhet,
                                            valgt: !valgtEnhet.valgt,
                                            underenheter: hovedenhet.underenheter.map(underenhet => ({
                                                ...underenhet,
                                                valgt: !valgtEnhet.valgt
                                            }))
                                        }
                                    } else {
                                        const underenheter = hovedenhet.underenheter.map(underenhet =>
                                            underenhet.OrganizationNumber === valgtEnhet.OrganizationNumber ?
                                                {...underenhet, valgt: !valgtEnhet.valgt} :
                                                underenhet
                                        );
                                        return {
                                            ...hovedenhet,
                                            valgt: underenheter.every(underenhet => underenhet.valgt),
                                            underenheter,
                                        }
                                    }

                                }), "lukk")
                                e.preventDefault()
                            }

                        }}
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
                                                setEnhetRef={(id, ref) => {
                                                    enhetRefs[id] = ref
                                                }}
                                                hovedenhet={hovedenhet}
                                                erÅpen={hovedenhet.åpen}
                                                gåTilForrige={() => {
                                                    const forrigeIndex = Math.max(0, (alleVirksomheterIntern.indexOf(hovedenhet)) - 1)
                                                    const forrigeHovedenhet = alleVirksomheterIntern[forrigeIndex];
                                                    if (forrigeHovedenhet === hovedenhet) {
                                                        return
                                                    }
                                                    if (forrigeHovedenhet.åpen && forrigeHovedenhet.underenheter.length > 0) {
                                                        setValgtEnhet(forrigeHovedenhet.underenheter[forrigeHovedenhet.underenheter.length - 1])
                                                    } else {
                                                        setValgtEnhet(forrigeHovedenhet)
                                                    }
                                                }}
                                                gåTilNeste={() => {
                                                    const nesteIndex = Math.min(alleVirksomheterIntern.indexOf(hovedenhet) + 1, alleVirksomheterIntern.length - 1)
                                                    const nesteHovedenhet = alleVirksomheterIntern[nesteIndex];
                                                    setValgtEnhet(nesteHovedenhet)
                                                }}
                                                gåTilUnderenhet={() => {
                                                    setValgtEnhet(hovedenhet.underenheter[0])
                                                }}
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
                                                    hovedenhet.underenheter.map((underenhet, idx) =>
                                                        underenhet.søkMatch ?
                                                            <UnderenhetCheckboks
                                                                setEnhetRef={(id, ref) => {
                                                                    enhetRefs[id] = ref
                                                                }}
                                                                gåTilHovedenhet={() => {
                                                                    setValgtEnhet(hovedenhet)
                                                                }}
                                                                gåTilForrige={() => {
                                                                    if (idx === 0) {
                                                                        setValgtEnhet(hovedenhet)
                                                                    } else {
                                                                        setValgtEnhet(hovedenhet.underenheter[idx - 1])
                                                                    }
                                                                }}
                                                                gåTilNeste={() => {
                                                                    if (idx < hovedenhet.underenheter.length - 1) {
                                                                        setValgtEnhet(hovedenhet.underenheter[idx + 1])
                                                                    } else {
                                                                        const nesteIndex = Math.min(alleVirksomheterIntern.indexOf(hovedenhet) + 1, alleVirksomheterIntern.length - 1)
                                                                        const nesteHovedenhet = alleVirksomheterIntern[nesteIndex];
                                                                        if (nesteHovedenhet === hovedenhet) {
                                                                            return
                                                                        }
                                                                        setValgtEnhet(nesteHovedenhet)
                                                                    }
                                                                }}
                                                                key={underenhet.OrganizationNumber}
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
                            ref={velgKnappRef}
                            onKeyDown={(event) => {
                                if (event.key === 'Tab') {
                                    if (event.shiftKey) {
                                        focusEnhet()
                                        event.preventDefault()
                                    }
                                }
                            }}
                            onClick={() => {
                                loggVelgKlikk()
                                oppdaterValgte(alleVirksomheterIntern, "lukk")
                            }}
                        > Velg
                        </Button>
                        <Button
                            onClick={() => {
                                loggVelgAlleKlikk()
                                oppdaterValgte(settAlleTil(true), "lukk")
                            }}
                            variant="secondary"
                        > Velg alle </Button>
                        <Button
                            variant="tertiary"
                            ref={fjernAlleKnappRef}
                            onKeyDown={(event) => {
                                if (event.key === 'Tab') {
                                    if (!event.shiftKey) {
                                        focusSearch()
                                        event.preventDefault()
                                    }
                                }
                            }}
                            onClick={() => {
                                loggFjernAlleKlikk()
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
                indeks < 3 ?
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
                    : indeks === 3 ?
                        <EkstraChip key="ekstraUnderenheter" antall={valgteVirksomheter.length} offsett={3}/>
                        : null
            )}
        </ul>
    </div>;
}

