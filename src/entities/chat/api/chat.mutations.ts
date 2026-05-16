import {
	useMutation,
	useQueryClient,
	type UseMutationOptions,
} from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import {
	api,
	type ChatControllerCreateData,
	type ChatControllerCreateMessageData,
	type ChatControllerCreateMessageParams,
	type CreateChatDto,
	type CreateChatMessageDto,
} from '@shared/api';
import {
	ChatCreateMessageParamsSchema,
	CreateChatMessageSchema,
	CreateChatSchema,
} from './chat.schemas';
import { chatQueryKeys } from './chat.queries';
import { streamQueryKeys } from '@entities/stream';

export type CreateChatMessageVariables = ChatControllerCreateMessageParams & {
	data: CreateChatMessageDto;
};

type CreateChatMutationOptions = Omit<
	UseMutationOptions<ChatControllerCreateData, AxiosError<void>, CreateChatDto>,
	'mutationFn' | 'mutationKey'
>;

type CreateChatMessageMutationOptions = Omit<
	UseMutationOptions<
		ChatControllerCreateMessageData,
		AxiosError<void>,
		CreateChatMessageVariables
	>,
	'mutationFn' | 'mutationKey'
>;

export const chatMutationKeys = {
	all: () => [...chatQueryKeys.all(), 'mutation'] as const,
	create: () => [...chatMutationKeys.all(), 'create'] as const,
	createMessage: (chatId?: string) =>
		[...chatMutationKeys.all(), 'create-message', chatId] as const,
};

export const createChat = async (
	data: CreateChatDto,
): Promise<ChatControllerCreateData> => {
	const validData = CreateChatSchema.parse(data);
	const response = await api.chat.chatControllerCreate(validData);

	return response.data;
};

export const createChatMessage = async ({
	chatId,
	data,
}: CreateChatMessageVariables): Promise<ChatControllerCreateMessageData> => {
	const validParams = ChatCreateMessageParamsSchema.parse({ chatId });
	const validData = CreateChatMessageSchema.parse(data);
	const response = await api.chat.chatControllerCreateMessage(
		validParams,
		validData,
	);

	return response.data;
};

export const useCreateChatMutation = (options?: CreateChatMutationOptions) => {
	const queryClient = useQueryClient();

	return useMutation({
		...options,
		mutationKey: chatMutationKeys.create(),
		mutationFn: createChat,
		onSuccess: async (data, variables, onMutateResult, context) => {
			queryClient.setQueryData(chatQueryKeys.lists(), data);
			await queryClient.invalidateQueries({ queryKey: chatQueryKeys.lists() });
			await options?.onSuccess?.(data, variables, onMutateResult, context);
		},
	});
};

export const useCreateChatMessageMutation = (
	options?: CreateChatMessageMutationOptions,
) => {
	const queryClient = useQueryClient();

	return useMutation({
		...options,
		mutationKey: chatMutationKeys.createMessage(),
		mutationFn: createChatMessage,
		onSuccess: async (data, variables, onMutateResult, context) => {
			await Promise.all([
				queryClient.setQueryData(chatQueryKeys.messageInfinite({ chatId: variables.chatId }), (oldData: any) => {
					const [first, ...rest] = oldData.pages

					return { ...oldData, pages: [{ ...first, result: [data, ...first.result] }, ...rest] }
				}),
				queryClient.invalidateQueries({ queryKey: chatQueryKeys.lists() }),
				queryClient.invalidateQueries({ queryKey: streamQueryKeys.lists() }),
			]);
			await options?.onSuccess?.(data, variables, onMutateResult, context);
		},
	});
};
