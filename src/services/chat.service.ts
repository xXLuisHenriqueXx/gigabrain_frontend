import { API } from "./api";
import type {
  CloseConversationResponse,
  OpenConversationResponse,
  TwinAnswer,
} from "./api.types";

const conversationsPath = (projectId: string) =>
  `/projects/${encodeURIComponent(projectId)}/conversations`;
const conversationPath = (projectId: string, id: string) =>
  `${conversationsPath(projectId)}/${encodeURIComponent(id)}`;

export const ChatService = {
  async openChat(projectId: string): Promise<OpenConversationResponse> {
    const { data } = await API.post<OpenConversationResponse>(
      conversationsPath(projectId),
    );
    return data;
  },

  async sendMessage(
    projectId: string,
    id: string,
    text: string,
  ): Promise<TwinAnswer> {
    const { data } = await API.post<TwinAnswer>(
      `${conversationPath(projectId, id)}/messages`,
      {
        text,
      },
    );
    return data;
  },

  async approve(projectId: string, id: string): Promise<TwinAnswer> {
    const { data } = await API.post<TwinAnswer>(
      `${conversationPath(projectId, id)}/approve`,
    );
    return data;
  },

  async close(projectId: string, id: string): Promise<CloseConversationResponse> {
    const { data } = await API.post<CloseConversationResponse>(
      `${conversationPath(projectId, id)}/close`,
    );
    return data;
  },
};
