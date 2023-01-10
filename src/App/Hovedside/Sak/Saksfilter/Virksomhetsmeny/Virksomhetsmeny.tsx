import React, {useRef, useState} from "react"
import {BodyShort, Button, CheckboxGroup, Search} from "@navikt/ds-react";
import {Collapse, Expand} from "@navikt/ds-icons";
import "./Virksomhetsmeny.css"
import {EkstraChip, VirksomhetChips} from "../VirksomhetChips";
import {UnderenhetCheckboks} from "./UnderenhetCheckboks";
import {HovedenhetCheckbox} from "./HovedenhetCheckbox";
import fuzzysort from 'fuzzysort';
import {Hovedenhet} from "../Virksomhetsikoner/Virksomhetsikoner";

export type Underenhet = {
    name: string,
    orgnr: string,
    valgt: boolean,
    søkMatch: boolean,
}

export type Hovedenhet = {
    name: string,
    orgnr: string,
    valgt: boolean,
    åpen: boolean,
    søkMatch: boolean,
    underenheter: Array<Underenhet>,
}

type VirksomhetsmenyProps = {
    alleVirksomheter: Array<Hovedenhet>,
    valgteVirksomheter: Array<Underenhet | Hovedenhet>,
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


export const Virksomhetsmeny = ({
                                    alleVirksomheter,
                                    valgteVirksomheter,
                                    setValgteVirksomheter
                                }: VirksomhetsmenyProps) => {
    const [alleVirksomheterIntern, setAlleVirksomheterIntern] = useState(() =>
        alleVirksomheter.map(hovedenhet => {
            return {
                ...hovedenhet,
                valgt:
                    valgteVirksomheter.some(v => v.orgnr === hovedenhet.orgnr) ||
                    hovedenhet.underenheter.every(underenhet => valgteVirksomheter.some(v => v.orgnr === underenhet.orgnr)),
                åpen: hovedenhet.underenheter.some(underenhet => valgteVirksomheter.some(v => v.orgnr === underenhet.orgnr)),
                søkMatch: true,
                underenheter: hovedenhet.underenheter.map(underenhet => {
                    return {
                        ...underenhet,
                        valgt: valgteVirksomheter.some(v => v.orgnr === hovedenhet.orgnr) || valgteVirksomheter.some(v => v.orgnr === underenhet.orgnr),
                        søkMatch: true,
                    }
                })
            }
        })
    );

    const [virksomhetsmenyÅpen, setVirksomhetsmenyÅpen] = useState(false);
    const virksomhetsmenyRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(virksomhetsmenyRef, () => oppdaterValgte(alleVirksomheterIntern, "lukk"));

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
                åpen: hovedenhet.underenheter.some(underenhet => virksomheter.some(v => v.orgnr === underenhet.orgnr)),
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
                {virksomhetsmenyÅpen ? <Collapse/> : <Expand/>}
            </button>
            {virksomhetsmenyÅpen ?
                <div className="virksomheter_virksomhetsmeny">
                    <div className="virksomheter_virksomhetsmeny_sok">
                        <Search label="Søk etter virksomhet" variant="simple" onChange={(søkeord) => {
                            if (søkeord.length === 0) {
                                console.log("null søkeord")
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
                                const fuzzyResultsNavn = fuzzysort.go(søkeord, flatArrayAlleEnheter, {keys: ['name', "orgnr"]});
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
                                .map(enhet => enhet.orgnr)
                        }

                        onChange={(e) => {
                            setAlleVirksomheterIntern(alleVirksomheterIntern.map(hovedenhet => {
                                if (e.includes(hovedenhet.orgnr) !== hovedenhet.valgt) {
                                    return {
                                        ...hovedenhet,
                                        valgt: e.includes(hovedenhet.orgnr),
                                        underenheter: hovedenhet.underenheter.map((underenhet) =>
                                            ({
                                                ...underenhet,
                                                valgt: e.includes(hovedenhet.orgnr)
                                            })
                                        )
                                    }
                                } else {
                                    return {
                                        ...hovedenhet,
                                        valgt: hovedenhet.underenheter.every(underenhet => e.includes(underenhet.orgnr)),
                                        underenheter: hovedenhet.underenheter.map((underenhet) =>
                                            ({
                                                ...underenhet,
                                                valgt: e.includes(underenhet.orgnr)
                                            })
                                        )
                                    }
                                }
                            }))
                        }}
                    >
                        {
                            alleVirksomheterIntern.map((hovedenhet) => {
                                    console.log(hovedenhet)
                                    return hovedenhet.søkMatch ?
                                        <div key={hovedenhet.orgnr}>
                                            <HovedenhetCheckbox
                                                hovedenhet={hovedenhet}
                                                erÅpen={hovedenhet.åpen}
                                                toggleÅpen={() => {
                                                    setAlleVirksomheterIntern(alleVirksomheterIntern.map(hovedenhetIntern => {
                                                            return {
                                                                ...hovedenhetIntern,
                                                                åpen: hovedenhetIntern.orgnr === hovedenhet.orgnr ? !hovedenhetIntern.åpen : hovedenhetIntern.åpen
                                                            }
                                                        }
                                                    ))
                                                }}
                                            >
                                                {
                                                    hovedenhet.underenheter.map((underenhet) =>
                                                        underenhet.søkMatch ? <UnderenhetCheckboks key={underenhet.orgnr}
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
                        key={virksomhet.orgnr}
                        navn={virksomhet.name}
                        orgnr={virksomhet.orgnr}
                        antallUndervirksomheter={"underenheter" in virksomhet ? virksomhet.underenheter?.length : null}
                        onLukk={() => {
                            const tilstandUtenVirksomhet = alleVirksomheterIntern.map(hovedenhet => {
                                if (hovedenhet.orgnr === virksomhet.orgnr) {
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
                                            underenhet.orgnr === virksomhet.orgnr ?
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
    </div>
}