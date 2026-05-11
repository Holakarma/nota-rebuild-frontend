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

/* {
	"pages": [
		{
			"result": [
				{
					"id": "d26bdc4a-b3dd-4117-917e-09f85061040b",
					"chatId": "0d650bdf-ac3c-4c8f-9dc7-4363d45304d3",
					"role": "SYSTEM",
					"kind": "NOTE_CREATED",
					"bodyMarkdown": "Заметка создана",
					"replyToMessageId": "c1f61860-916b-4b37-a83f-b2983385e0a1",
					"resultNoteId": "a365fdae-cc65-4a22-9c65-bfcbd0393b82",
					"createdAt": "2026-05-10T16:04:57.303Z"
				},
				{
					"id": "c1f61860-916b-4b37-a83f-b2983385e0a1",
					"chatId": "0d650bdf-ac3c-4c8f-9dc7-4363d45304d3",
					"role": "USER",
					"kind": "USER_INPUT",
					"bodyMarkdown": "dsaf",
					"replyToMessageId": null,
					"resultNoteId": null,
					"createdAt": "2026-05-10T16:04:57.294Z"
				},
			    
			],
			"page": {
				"hasNextPage": true,
				"nextCursor": "ImVhYWNkNTY0LTQwY2EtNDU1Mi05Y2UzLTVlN2ExNjJjOTZmMiI"
			}
		}
	],
	"pageParams": [
		null
	]
} */

/* 
{
"userMessage": {
	"id": "4e6f99a3-e1dc-4e98-a28b-a07ff97533fc",
	"chatId": "0d650bdf-ac3c-4c8f-9dc7-4363d45304d3",
	"role": "USER",
	"kind": "USER_INPUT",
	"bodyMarkdown": "aaa",
	"replyToMessageId": null,
	"resultNoteId": null,
	"createdAt": "2026-05-10T16:08:05.216Z"
},
"systemMessage": {
	"id": "a28fb0e5-4c69-464a-9d64-826cb2a2607c",
	"chatId": "0d650bdf-ac3c-4c8f-9dc7-4363d45304d3",
	"role": "SYSTEM",
	"kind": "NOTE_CREATED",
	"bodyMarkdown": "Заметка создана",
	"replyToMessageId": "4e6f99a3-e1dc-4e98-a28b-a07ff97533fc",
	"resultNoteId": "a40b471c-2045-4527-ad78-7f4231373f87",
	"createdAt": "2026-05-10T16:08:05.223Z"
}
}
 */

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

					return { ...oldData, pages: [{ ...first, result: [data.systemMessage, data.userMessage, ...first.result] }, ...rest] }
				}),
				queryClient.invalidateQueries({ queryKey: chatQueryKeys.lists() }),
			]);
			await options?.onSuccess?.(data, variables, onMutateResult, context);
		},
	});
};
