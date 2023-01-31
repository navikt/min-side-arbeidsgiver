import React from "react";

export const useOnClickOutside = (ref: React.RefObject<HTMLElement>, handler: (event: MouseEvent) => void) => {
    React.useEffect(() => {
        const listener = (event: MouseEvent) => {
            const node = ref.current
            // @ts-ignore
            if (node && node !== event.target && node.contains(event.target as HTMLElement)) {
                return
            }
            handler(event);
        };
        document.addEventListener("click", listener);
        return () => {
            document.removeEventListener("click", listener);
        };
    }, [ref, handler]);
}