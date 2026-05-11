import { forwardRef, useEffect, useRef, useState } from 'react';
import { Box, IconButton, InputAdornment, TextField } from '@mui/material';
import { useCreateChatMessageMutation } from '@entities/chat';
import { SendIcon } from '@shared/icons/send';

type StreamMessageInputProps = {
	disabled?: boolean;
	autoFocus?: boolean;
	chatId: string;
	onFocus?: () => void;
};

export const StreamMessageInput = forwardRef<
	HTMLInputElement,
	StreamMessageInputProps
>(({ disabled = false, autoFocus = false, onFocus, chatId }, ref) => {
	const [bodyMarkdown, setBodyMarkdown] = useState('');
	const inputRef = useRef<HTMLInputElement | null>(null);
	const createChatMessageMutation = useCreateChatMessageMutation();

	const isPending = createChatMessageMutation.isPending;
	const isDisabled = disabled || isPending;

	useEffect(() => {
		if (autoFocus && !isDisabled) {
			inputRef.current?.focus();
		}
	}, [autoFocus, isDisabled]);

	const setInputRef = (element: HTMLInputElement | null) => {
		inputRef.current = element;

		if (typeof ref === 'function') {
			ref(element);
		} else if (ref) {
			ref.current = element;
		}
	};

	const sendMessage = async (event: React.SubmitEvent<HTMLFormElement>) => {
		event.preventDefault();

		const message = bodyMarkdown.trim();

		if (!message || isDisabled) {
			return;
		}

		await createChatMessageMutation.mutateAsync({
			chatId,
			data: {
				bodyMarkdown: message,
			},
		});

		setBodyMarkdown('');
	};

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
				inputRef={setInputRef}
				value={bodyMarkdown}
				disabled={isDisabled}
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
									disabled={
										isDisabled || !bodyMarkdown.trim()
									}
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

StreamMessageInput.displayName = 'StreamMessageInput';
