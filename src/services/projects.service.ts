import { API } from "./api";
import type { Project } from "./api.types";

const projectPath = (id: string) => `/projects/${encodeURIComponent(id)}`;

export const PROJECTS_UPDATED_EVENT = "gigabrain:projects-updated";

export const ProjectsService = {
  async list(): Promise<Project[]> {
    const { data } = await API.get<Project[]>("/projects");
    return data;
  },

  async get(id: string): Promise<Project> {
    const { data } = await API.get<Project>(projectPath(id));
    return data;
  },

  async create(name: string, description = ""): Promise<Project> {
    const { data } = await API.post<Project>("/projects", { name, description });
    window.dispatchEvent(new Event(PROJECTS_UPDATED_EVENT));
    return data;
  },

  async update(
    id: string,
    changes: { name?: string; description?: string },
  ): Promise<Project> {
    const { data } = await API.patch<Project>(projectPath(id), changes);
    window.dispatchEvent(new Event(PROJECTS_UPDATED_EVENT));
    return data;
  },
};
