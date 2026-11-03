import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowUpRight,
  FolderKanban,
  LoaderCircle,
  Pencil,
  Plus,
} from "lucide-react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Textarea } from "@/components/ui/textarea";
import { Typography } from "@/components/ui/typography";
import { getApiErrorMessage } from "@/services/api";
import { ProjectsService } from "@/services/projects.service";
import type { Project } from "@/services/api.types";

export const Route = createFileRoute("/projects/")({
  component: ProjectsPage,
});

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(date);
}

function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setProjects(await ProjectsService.list());
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Cannot load projects."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const create = async () => {
    if (!name.trim() || isCreating) return;
    setIsCreating(true);
    setError(null);
    try {
      const project = await ProjectsService.create(name, description);
      await router.navigate({
        to: "/projects/$projectId/chat",
        params: { projectId: project.id },
      });
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Cannot create project."));
    } finally {
      setIsCreating(false);
    }
  };

  const rename = async (project: Project) => {
    setError(null);
    try {
      await ProjectsService.update(project.id, { name: editName });
      setEditing(null);
      await load();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Cannot rename project."));
    }
  };

  return (
    <DashboardLayout>
      <div className="flex h-dvh min-h-140 w-full min-w-0 flex-col overflow-hidden">
        <header className="flex items-start gap-3 border-b px-4 py-4 sm:px-8">
          <SidebarTrigger className="mt-1 shrink-0" />
          <div className="min-w-0 flex-1">
            <Typography as="h1" className="text-xl font-semibold">
              Projects
            </Typography>
            <Typography as="p" className="mt-1">
              Each project have its own requirements, chats and experts.
            </Typography>
          </div>
        </header>

        <section className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8">
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
            <Card className="gap-3">
              <Typography as="h2" className="font-semibold">
                New Project
              </Typography>
              <Input
                aria-label="Project name"
                placeholder="Project name"
                value={name}
                maxLength={80}
                onChange={(event) => setName(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && void create()}
              />
              <Textarea
                aria-label="Project description"
                placeholder="What is your project about? (optional)"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
              <Button
                className="w-fit"
                disabled={!name.trim() || isCreating}
                onClick={() => void create()}
              >
                {isCreating ? (
                  <LoaderCircle className="animate-spin" />
                ) : (
                  <Plus />
                )}{" "}
                Create Project
              </Button>
            </Card>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 text-sm text-destructive"
              >
                <AlertCircle className="mt-0.5 size-4 shrink-0" /> {error}
              </div>
            )}

            {isLoading && (
              <p
                role="status"
                className="flex items-center gap-2 text-sm text-muted-foreground"
              >
                <LoaderCircle className="size-4 animate-spin" /> Loading
                Projects ...
              </p>
            )}

            {!isLoading && !error && projects.length === 0 && (
              <p className="text-sm text-muted-foreground">
                You don't have any projects yet. Create the first one to get
                started.
              </p>
            )}

            <ul className="grid gap-3 sm:grid-cols-2">
              {projects.map((project) => (
                <li key={project.id}>
                  <Card className="h-full gap-2">
                    <div className="flex items-start gap-2">
                      <FolderKanban className="mt-1 size-4 shrink-0" />
                      {editing === project.id ? (
                        <Input
                          aria-label="New name"
                          className="h-9 rounded-lg px-3 py-1"
                          value={editName}
                          autoFocus
                          onChange={(event) => setEditName(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === "Enter") void rename(project);
                            if (event.key === "Escape") setEditing(null);
                          }}
                          onBlur={() => setEditing(null)}
                        />
                      ) : (
                        <Typography
                          as="h3"
                          className="min-w-0 flex-1 truncate font-semibold"
                        >
                          {project.name}
                        </Typography>
                      )}
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Renomear projeto"
                        onClick={() => {
                          setEditing(project.id);
                          setEditName(project.name);
                        }}
                      >
                        <Pencil className="size-4" />
                      </Button>
                    </div>
                    {project.description && (
                      <p className="line-clamp-3 text-sm text-muted-foreground">
                        {project.description}
                      </p>
                    )}
                    <div className="mt-auto flex items-center justify-between pt-2 text-xs text-muted-foreground">
                      <span>Created at {formatDate(project.created_at)}</span>
                      <Link
                        to="/projects/$projectId/chat"
                        params={{ projectId: project.id }}
                        className="inline-flex items-center gap-1 text-sm text-foreground underline underline-offset-4"
                      >
                        Open <ArrowUpRight className="size-4" />
                      </Link>
                    </div>
                  </Card>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
