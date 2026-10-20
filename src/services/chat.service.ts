import { API } from "./api";
import type {
  CloseConversationResponse,
  OpenConversationResponse,
  TwinAnswer,
} from "./api.types";

const conversationPath = (id: string) =>
  `/conversations/${encodeURIComponent(id)}`;

export const ChatService = {
  async openChat(): Promise<OpenConversationResponse> {
    const { data } = await API.post<OpenConversationResponse>("/conversations");
    return data;
  },

  async sendMessage(id: string, text: string): Promise<TwinAnswer> {
    const { data } = await API.post<TwinAnswer>(
      `${conversationPath(id)}/messages`,
      {
        text,
      },
    );
    return data;
  },

  async approve(id: string): Promise<TwinAnswer> {
    const { data } = await API.post<TwinAnswer>(
      `${conversationPath(id)}/approve`,
    );
    return data;
  },

  async close(id: string): Promise<CloseConversationResponse> {
    const { data } = await API.post<CloseConversationResponse>(
      `${conversationPath(id)}/close`,
    );
    return data;
  },
};
