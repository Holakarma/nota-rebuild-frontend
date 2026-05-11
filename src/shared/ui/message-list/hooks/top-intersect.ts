import { useEffect, useRef, type RefObject } from 'react';

export type UseTopIntersectProps = {
	parentRef: RefObject<HTMLDivElement | null>;
	topRef: RefObject<HTMLDivElement | null>;
	enabled?: boolean;
	onIntersect: (entry: IntersectionObserverEntry) => void;
};

export const useTopIntersect = ({
	parentRef,
	topRef,
	enabled = true,
	onIntersect,
}: UseTopIntersectProps) => {
	const onIntersectRef = useRef(onIntersect);

	useEffect(() => {
		onIntersectRef.current = onIntersect;
	}, [onIntersect]);

	useEffect(() => {
		if (!enabled) {
			return undefined;
		}

		const root = parentRef.current;
		const target = topRef.current;

		if (!root || !target) {
			return undefined;
		}

		const observer = new IntersectionObserver(
			(entries) => {
				const entry = entries.find(
					({ isIntersecting }) => isIntersecting,
				);

				if (entry) {
					onIntersectRef.current(entry);
				}
			},
			{ root },
		);

		observer.observe(target);

		return () => observer.disconnect();
	}, [enabled, parentRef, topRef]);
};
