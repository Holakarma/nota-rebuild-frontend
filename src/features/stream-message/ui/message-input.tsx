import { forwardRef, useEffect, useRef } from 'react';
import { Box, IconButton, InputAdornment, TextField } from '@mui/material';
import { useCreateChatMessageMutation } from '@entities/chat';
import { SendIcon } from '@shared/icons/send';
import { useMessageDraftStore } from '../model/stream-message-draft';

type StreamMessageInputProps = {
	disabled?: boolean;
	autoFocus?: boolean;
	chatId?: string;
	streamId?: string;
	onFocus?: () => void;
};

export const MessageInput = forwardRef<
	HTMLInputElement | HTMLTextAreaElement,
	StreamMessageInputProps
>(({ disabled = false, autoFocus = false, onFocus, chatId }, ref) => {
	const bodyMarkdown = useMessageDraftStore(
		(state) => state.bodyMarkdown,
	);
	const setBodyMarkdown = useMessageDraftStore(
		(state) => state.setBodyMarkdown,
	);
	const clearBodyMarkdown = useMessageDraftStore(
		(state) => state.clearBodyMarkdown,
	);
	const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(
		null,
	);
	const createChatMessageMutation = useCreateChatMessageMutation();

	const isPending = createChatMessageMutation.isPending;
	const isDisabled = disabled || isPending;

	useEffect(() => {
		if (autoFocus && !isDisabled) {
			inputRef.current?.focus();
		}
	}, [autoFocus, isDisabled]);

	const setInputRef = (
		element: HTMLInputElement | HTMLTextAreaElement | null,
	) => {
		inputRef.current = element;

		if (typeof ref === 'function') {
			ref(element);
		} else if (ref) {
			ref.current = element;
		}
	};

	const submitMessage = async () => {
		const message = bodyMarkdown.trim();

		if (!message || isDisabled || !chatId) {
			return;
		}

		await createChatMessageMutation.mutateAsync({
			chatId,
			data: {
				bodyMarkdown: message,
			},
		});

		clearBodyMarkdown();
	};

	const sendMessage = async (event: React.SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();
		await submitMessage();
	};

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key !== 'Enter' || event.shiftKey) {
			return;
		}

		event.preventDefault();
		void submitMessage();
	};

	const isSubmitDisabled = isDisabled || !chatId || !bodyMarkdown.trim();

	return (
		<Box
			component="form"
			onSubmit={(event) => sendMessage(event)}
		>
			<TextField
				placeholder="Сообщение"
				aria-label="Сообщение"
				onChange={(event) => setBodyMarkdown(event.target.value)}
				onFocus={onFocus}
				onKeyDown={handleKeyDown}
				inputRef={setInputRef}
				value={bodyMarkdown}
				disabled={isDisabled}
				multiline
				minRows={1}
				maxRows={6}
				fullWidth
				slotProps={{
					htmlInput: {
						maxLength: 32768,
					},
					input: {
						endAdornment: (
							<InputAdornment position="end">
								<IconButton
									type="submit"
									aria-label="Отправить"
									disabled={isSubmitDisabled}
								>
									<SendIcon />
								</IconButton>
							</InputAdornment>
						),
					},
				}}
			/>
		</Box>
	);
});

MessageInput.displayName = 'MessageInput';
