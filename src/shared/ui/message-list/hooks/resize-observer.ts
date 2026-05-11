import { useLayoutEffect, useState, type RefObject } from 'react';

export const useResizeObserver = (
	parentRef: RefObject<HTMLDivElement | null>,
) => {
	const [containerHeight, setContainerHeight] = useState(0);

	useLayoutEffect(() => {
		const element = parentRef.current;

		if (!element) {
			return undefined;
		}

		const updateHeight = () => {
			const nextHeight = element.clientHeight;
			setContainerHeight((height) =>
				height === nextHeight ? height : nextHeight,
			);
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
	}, [parentRef]);

	return { containerHeight };
};
