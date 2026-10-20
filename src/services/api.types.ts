/** Types shared by the GigaBrain REST API services. */

export type ConversationAction = "ask" | "propose" | "approved";
export type RequirementClass = "FR" | "NFR";

export interface UserStory {
  role: string;
  goal: string;
  benefit: string;
}

export interface AcceptanceCriterion {
  scenario: string;
  given: string;
  when: string;
  then: string;
}

export interface RequirementQuality {
  ears: boolean;
  ears_pattern: string | null;
  story_complete: boolean;
  criteria_count: number;
  criteria_gherkin: boolean;
  vague_terms: string[];
}

export interface ProposedRequirement {
  id?: string;
  title: string;
  statement: string;
  ears_pattern?: string;
  story: UserStory | null;
  acceptance_criteria: AcceptanceCriterion[];
  class: RequirementClass;
  subtype: string | null;
  kind?: string;
  topics: string[];
  quality?: RequirementQuality;
  [key: string]: unknown;
}

export interface BehindTheScenesEvent {
  id: number;
  timestamp: string;
  sender: string;
  recipient: string;
  kind: string;
  summary: string;
  content?: Record<string, unknown>;
}

export interface TwinAnswer {
  action: ConversationAction;
  message: string;
  proposed_requirements: ProposedRequirement[];
  saved: string[];
  pending_proposal: boolean;
  conversation_active: boolean;
  behind_the_scenes: BehindTheScenesEvent[];
}

export interface OpenConversationResponse {
  id: string;
  mode: "after_meeting" | "in_meeting";
  status: string;
  active: boolean;
}

export interface CloseConversationResponse {
  id: string;
  status: "closed" | string;
  active: boolean;
}

export interface ConversationSummary {
  id: string;
  title?: string | null;
  started_at: string;
  ended_at: string | null;
  mode: string;
  status: string;
  events: number;
  active: boolean;
}

export interface ConversationMessage {
  id: number;
  timestamp: string;
  author: "po" | "twin" | string;
  kind: string;
  text: string;
  proposed_requirements: ProposedRequirement[];
  saved: string[];
}

export interface ConversationListResponse {
  conversations: ConversationSummary[];
}

export interface ConversationDetails extends ConversationSummary {
  pending_proposal: boolean;
  messages: ConversationMessage[];
  saved_requirements: string[];
}

export interface RequirementSummary {
  id: string;
  title: string;
  status: string;
  current_version: number;
  kind: string;
  topics: string[];
  statement: string | null;
  story: UserStory | null;
  acceptance_criteria: number;
  class: RequirementClass;
  subtype: string | null;
  created_at: string;
  updated_at: string;
}

export interface RequirementDetails {
  id: string;
  title: string;
  status: string;
  current_version: number;
  content: ProposedRequirement;
  quality: RequirementQuality;
  versions: Array<Record<string, unknown>>;
  links: RequirementLink[];
  trace: Array<Record<string, unknown>>;
  [key: string]: unknown;
}

export interface RequirementLink {
  id: number;
  source_id: string;
  target_id: string;
  kind: string;
  reason: string | null;
  conversation_id: string | null;
  created_at: string;
}

export interface ExpertSummary {
  id: string;
  topic: string;
  description: string;
  file: string;
  knowledge_version: number;
  consultations: number;
  created_at: string;
  updated_at: string;
}

export interface ExpertDetails extends ExpertSummary {
  knowledge: string;
  versions: Array<Record<string, unknown>>;
}

export interface ExpertListResponse {
  experts?: ExpertSummary[];
  items?: ExpertSummary[];
  results?: ExpertSummary[];
}

export interface RequirementListResponse {
  requirements?: RequirementSummary[];
  items?: RequirementSummary[];
  results?: RequirementSummary[];
}

export interface RequirementFilters {
  status?: string;
  topic?: string;
  search?: string;
}
