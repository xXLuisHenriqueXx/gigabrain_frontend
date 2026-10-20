import { API } from "./api";
import type {
  ConversationDetails,
  ConversationSummary,
  ConversationListResponse,
  BehindTheScenesEvent,
  ExpertDetails,
  ExpertListResponse,
  ExpertSummary,
  RequirementDetails,
  RequirementFilters,
  RequirementListResponse,
  RequirementLink,
  RequirementSummary,
} from "./api.types";

const conversationPath = (id: string) =>
  `/conversations/${encodeURIComponent(id)}`;
const requirementPath = (id: string) =>
  `/requirements/${encodeURIComponent(id)}`;
const expertPath = (id: string) => `/experts/${encodeURIComponent(id)}`;

export const HistoryService = {
  async getChats(): Promise<ConversationSummary[]> {
    const { data } = await API.get<
      ConversationSummary[] | ConversationListResponse
    >("/conversations");
    return Array.isArray(data) ? data : data.conversations;
  },

  async getChatById(id: string): Promise<ConversationDetails> {
    const { data } = await API.get<ConversationDetails>(conversationPath(id));
    return data;
  },

  async getChatByIdEvents(id: string): Promise<BehindTheScenesEvent[]> {
    const { data } = await API.get<BehindTheScenesEvent[]>(
      `${conversationPath(id)}/events`,
    );
    return data;
  },

  async getRequirements(
    filters: RequirementFilters = {},
  ): Promise<RequirementSummary[]> {
    const params = Object.fromEntries(
      Object.entries(filters).filter(
        ([, value]) => value !== undefined && value !== "",
      ),
    );
    const { data } = await API.get<
      RequirementSummary[] | RequirementListResponse
    >("/requirements", { params });
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.requirements)) return data.requirements;
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.results)) return data.results;
    throw new Error(
      "A API retornou uma lista de requisitos em formato inesperado.",
    );
  },

  async getRequirementById(id: string): Promise<RequirementDetails> {
    const { data } = await API.get<RequirementDetails>(requirementPath(id));
    return data;
  },

  async getLinks(): Promise<RequirementLink[]> {
    const { data } = await API.get<RequirementLink[]>("/links");
    return data;
  },

  async getExperts(): Promise<ExpertSummary[]> {
    const { data } = await API.get<ExpertSummary[] | ExpertListResponse>(
      "/experts",
    );
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.experts)) return data.experts;
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.results)) return data.results;
    throw new Error(
      "A API retornou uma lista de especialistas em formato inesperado.",
    );
  },

  async getExpertById(id: string): Promise<ExpertDetails> {
    const { data } = await API.get<ExpertDetails>(expertPath(id));
    return data;
  },
};

/** Notify mounted navigation components that conversation summaries may have changed. */
export const CONVERSATIONS_UPDATED_EVENT = "gigabrain:conversations-updated";

export function notifyConversationsUpdated(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CONVERSATIONS_UPDATED_EVENT));
  }
}
