import {
	useVirtualizer as useTanstackVirtualizer,
	type Virtualizer,
	type VirtualItem,
} from '@tanstack/react-virtual';
import { useCallback } from 'react';
import type { Key } from 'react';

export type MessageListVirtualizer = Virtualizer<
	HTMLDivElement,
	HTMLDivElement
>;

export type ShouldAdjustScrollPositionOnItemSizeChange = (
	item: VirtualItem,
	delta: number,
	instance: MessageListVirtualizer,
) => boolean;

export type MessageListVirtualizerOptions = Parameters<
	typeof useTanstackVirtualizer<HTMLDivElement, HTMLDivElement>
>[0] & {
	shouldAdjustScrollPositionOnItemSizeChange?: ShouldAdjustScrollPositionOnItemSizeChange;
};

export type UseVirtualizerProps = {
	count: number;
	getScrollElement: () => HTMLDivElement | null;
	itemHeight: number;
	getItemKey: ((index: number) => Key) | undefined;
};

export const useVirtualizer = ({
	count,
	getScrollElement,
	itemHeight,
	getItemKey,
}: UseVirtualizerProps) => {
	const estimateSize = useCallback(() => itemHeight, [itemHeight]);
	const shouldAdjustScrollPositionOnItemSizeChange =
		useCallback<ShouldAdjustScrollPositionOnItemSizeChange>(
			(virtualItem, _delta, instance) => {
				const first = instance.getVirtualItems()[0];
				return first ? virtualItem.index < first.index : false;
			},
			[],
		);

	const virtualizerOptions: MessageListVirtualizerOptions = {
		count,
		getScrollElement,
		estimateSize,
		overscan: 4,
		useAnimationFrameWithResizeObserver: true,
		getItemKey,
		shouldAdjustScrollPositionOnItemSizeChange,
	};

	return useTanstackVirtualizer<HTMLDivElement, HTMLDivElement>(
		virtualizerOptions,
	);
};
