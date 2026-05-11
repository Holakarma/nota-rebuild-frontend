import { useEffect } from "react";

export type useIntersectionObserverProps = {
    rootRef: React.RefObject<Element | null>,
    observeRef: React.RefObject<Element | null>,
    onIntersect: () => void;
}

export const useIntersectionObserver = ({ rootRef, observeRef, onIntersect }: useIntersectionObserverProps) => {
    useEffect(() => {
        const root = rootRef.current;
        if (!root) {
            return undefined;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (
                        entry.isIntersecting
                    ) {
                        void onIntersect();
                    }
                });
            },
            { root },
        );

        if (observeRef.current) {
            observer.observe(observeRef.current);
        }

        return () => observer.disconnect();
    }, []);
}