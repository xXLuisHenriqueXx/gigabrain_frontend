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

const base = (projectId: string) => `/projects/${encodeURIComponent(projectId)}`;
const conversationPath = (projectId: string, id: string) =>
  `${base(projectId)}/conversations/${encodeURIComponent(id)}`;
const requirementPath = (projectId: string, id: string) =>
  `${base(projectId)}/requirements/${encodeURIComponent(id)}`;
const expertPath = (projectId: string, id: string) =>
  `${base(projectId)}/experts/${encodeURIComponent(id)}`;

export const HistoryService = {
  async getChats(projectId: string): Promise<ConversationSummary[]> {
    const { data } = await API.get<
      ConversationSummary[] | ConversationListResponse
    >(`${base(projectId)}/conversations`);
    return Array.isArray(data) ? data : data.conversations;
  },

  async getChatById(projectId: string, id: string): Promise<ConversationDetails> {
    const { data } = await API.get<ConversationDetails>(conversationPath(projectId, id));
    return data;
  },

  async getChatByIdEvents(projectId: string, id: string): Promise<BehindTheScenesEvent[]> {
    const { data } = await API.get<BehindTheScenesEvent[]>(
      `${conversationPath(projectId, id)}/events`,
    );
    return data;
  },

  async getRequirements(
    projectId: string,
    filters: RequirementFilters = {},
  ): Promise<RequirementSummary[]> {
    const params = Object.fromEntries(
      Object.entries(filters).filter(
        ([, value]) => value !== undefined && value !== "",
      ),
    );
    const { data } = await API.get<
      RequirementSummary[] | RequirementListResponse
    >(`${base(projectId)}/requirements`, { params });
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.requirements)) return data.requirements;
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.results)) return data.results;
    throw new Error(
      "The API returned a list of requirements in an unexpected format.",
    );
  },

  async getRequirementById(projectId: string, id: string): Promise<RequirementDetails> {
    const { data } = await API.get<RequirementDetails>(requirementPath(projectId, id));
    return data;
  },

  async getLinks(projectId: string): Promise<RequirementLink[]> {
    const { data } = await API.get<RequirementLink[]>(`${base(projectId)}/links`);
    return data;
  },

  async getExperts(projectId: string): Promise<ExpertSummary[]> {
    const { data } = await API.get<ExpertSummary[] | ExpertListResponse>(
      `${base(projectId)}/experts`,
    );
    if (Array.isArray(data)) return data;
    if (Array.isArray(data.experts)) return data.experts;
    if (Array.isArray(data.items)) return data.items;
    if (Array.isArray(data.results)) return data.results;
    throw new Error(
      "The API returned a list of experts in an unexpected format.",
    );
  },

  async getExpertById(projectId: string, id: string): Promise<ExpertDetails> {
    const { data } = await API.get<ExpertDetails>(expertPath(projectId, id));
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
