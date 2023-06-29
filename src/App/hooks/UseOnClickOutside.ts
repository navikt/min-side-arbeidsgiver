import React from "react";

export const useOnClickOutside = (ref: React.RefObject<HTMLElement>, handler: (event: MouseEvent) => void) => {
    React.useEffect(() => {
        const listener = (event: MouseEvent) => {
            const node = ref.current
            console.log(`checking ${event.target}`)
            // @ts-ignore
            if (node && node !== event.target && node.contains(event.target as HTMLElement)) {
                return
            }

            // @ts-ignore
            if (!document.contains(event.target as HTMLOrSVGElement)){
                return
                //Clear-knapp i søkefeltet forsvinner når klikket på.
                //Dette blir derfor registrert som klikk utenfor dropdown-menyen.
            }

            console.log(`running handler `)
            handler(event);
        };
        document.addEventListener("click", listener);
        return () => {
            document.removeEventListener("click", listener);
        };
    }, [ref, handler]);
}