import { useState, useLayoutEffect } from "react";

export type ResizeObserverProps = React.RefObject<HTMLDivElement | null>

export const useResizeObserver = (ref: ResizeObserverProps) => {
    const [containerHeight, setContainerHeight] = useState(0);

    useLayoutEffect(() => {
        const element = ref.current;
        if (!element) {
            return undefined;
        }

        const updateHeight = () => {
            setContainerHeight(element.clientHeight);
        };

        updateHeight();

        if (typeof ResizeObserver === 'undefined') {
            if (typeof window === 'undefined') {
                return undefined;
            }

            window.addEventListener('resize', updateHeight);
            return () => {
                window.removeEventListener('resize', updateHeight);
            };
        }

        const observer = new ResizeObserver(updateHeight);
        observer.observe(element);

        return () => observer.disconnect();
    }, [ref.current]);

    return containerHeight
}