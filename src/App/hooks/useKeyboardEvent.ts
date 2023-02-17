import React from "react";

export const useKeyboardEvent = (type: 'keydown' | 'keypress' | 'keyup', containerRef: React.RefObject<HTMLElement>, handler: (event: KeyboardEvent) => void) => {
    React.useEffect(() => {
        const listener = (event: KeyboardEvent) => {
            const node = containerRef.current
            if (node === null) {
                return
            }

            if (node !== event.target && !node.contains(event.target as HTMLElement)) {
                return
            }

            handler(event);
        };
        document.addEventListener(type, listener);
        return () => {
            document.removeEventListener(type, listener);
        };
    }, [type, containerRef, handler]);
}