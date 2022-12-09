/**
 * Poor man's useId. React 18 har useId
 * Fjern denne når på React 18
 */
import {useMemo} from "react";

let globalId = 0;
const useId = () => useMemo(() => {
        globalId += 1
        return `elementId-${globalId}`
    }, []
)