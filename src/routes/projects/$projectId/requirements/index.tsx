import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowUpRight,
  FileText,
  LoaderCircle,
  RefreshCw,
  Search,
} from "lucide-react";

import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Typography } from "@/components/ui/typography";
import { getApiErrorMessage } from "@/services/api";
import { HistoryService } from "@/services/history.service";
import type { RequirementSummary } from "@/services/api.types";

export const Route = createFileRoute("/projects/$projectId/requirements/")({
  component: RequirementsPage,
});

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);
}

function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    approved: "Approved",
    active: "Active",
    draft: "Draft",
    proposed: "Proposed",
    deprecated: "Superseded",
    rejected: "Rejected",
  };
  return labels[status.toLowerCase()] ?? status;
}

function RequirementsPage() {
  const { projectId } = Route.useParams();
  const [requirements, setRequirements] = useState<RequirementSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [topic, setTopic] = useState("all");

  const loadRequirements = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setRequirements(await HistoryService.getRequirements(projectId));
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          "Could not load the requirements.",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    void loadRequirements();
  }, [loadRequirements]);

  const statuses = useMemo(
    () =>
      [
        ...new Set(requirements.map((item) => item.status).filter(Boolean)),
      ].sort(),
    [requirements],
  );
  const topics = useMemo(
    () =>
      [
        ...new Set(
          requirements.flatMap((item) => item.topics ?? []).filter(Boolean),
        ),
      ].sort(),
    [requirements],
  );
  const filteredRequirements = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("en-US");
    return requirements.filter((item) => {
      const matchesQuery =
        !query ||
        [
          item.id,
          item.title,
          item.statement ?? "",
          item.kind,
          item.class,
          ...(item.topics ?? []),
        ].some((value) =>
          String(value ?? "")
            .toLocaleLowerCase("en-US")
            .includes(query),
        );
      const matchesStatus = status === "all" || item.status === status;
      const matchesTopic =
        topic === "all" || (item.topics ?? []).includes(topic);
      return matchesQuery && matchesStatus && matchesTopic;
    });
  }, [requirements, search, status, topic]);

  return (
    <main className="flex h-dvh min-h-140 w-full flex-col overflow-hidden">
      <AppSidebar />
      <header className="flex items-start gap-3 border-b px-4 py-4 sm:px-8">
        <SidebarTrigger className="mt-1 shrink-0" />
        <div className="min-w-0 flex-1">
          <Typography as="h1" className="text-xl font-semibold">
            Requirements
          </Typography>
          <Typography as="p" className="mt-1">
            Browse saved requirements, their classifications and versions.
          </Typography>
        </div>
        <Button
          variant="outline"
          className="h-9 px-3"
          onClick={() => void loadRequirements()}
          disabled={isLoading}
        >
          <RefreshCw className={isLoading ? "animate-spin" : ""} />
          <span className="hidden sm:inline">Refresh</span>
        </Button>
      </header>

      <section className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
          <div className="grid gap-3 sm:grid-cols-3">
            <Card className="gap-1">
              <Typography as="p">Total requirements</Typography>
              <Typography as="h2" className="text-2xl font-semibold">
                {isLoading ? "—" : requirements.length}
              </Typography>
            </Card>
            <Card className="gap-1">
              <Typography as="p">Functional</Typography>
              <Typography as="h2" className="text-2xl font-semibold">
                {isLoading
                  ? "—"
                  : requirements.filter((item) => item.class === "FR").length}
              </Typography>
            </Card>
            <Card className="gap-1">
              <Typography as="p">Non-functional</Typography>
              <Typography as="h2" className="text-2xl font-semibold">
                {isLoading
                  ? "—"
                  : requirements.filter((item) => item.class === "NFR").length}
              </Typography>
            </Card>
          </div>

          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_180px_220px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                aria-label="Search requirements"
                className="h-11 pl-9"
                placeholder="Search by title, description or topic..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <select
              aria-label="Filter by status"
              className="h-11 rounded-2xl border border-input bg-background px-3 text-sm"
              value={status}
              onChange={(event) => setStatus(event.target.value)}
            >
              <option value="all">All statuses</option>
              {statuses.map((value) => (
                <option key={value} value={value}>
                  {statusLabel(value)}
                </option>
              ))}
            </select>
            <select
              aria-label="Filter by topic"
              className="h-11 rounded-2xl border border-input bg-background px-3 text-sm"
              value={topic}
              onChange={(event) => setTopic(event.target.value)}
            >
              <option value="all">All topics</option>
              {topics.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          {isLoading && (
            <div
              role="status"
              className="flex items-center gap-2 py-12 text-sm text-muted-foreground"
            >
              <LoaderCircle className="size-4 animate-spin" /> Loading
              requisitos...
            </div>
          )}
          {error && !isLoading && (
            <Card role="alert" className="gap-3">
              <div className="flex items-start gap-2 text-destructive">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
              <Button variant="outline" onClick={() => void loadRequirements()}>
                <RefreshCw /> Try again
              </Button>
            </Card>
          )}

          {!isLoading && !error && filteredRequirements.length === 0 && (
            <Card className="items-center gap-3 py-12 text-center">
              <FileText className="size-8 text-muted-foreground" />
              <Typography as="h2" className="font-semibold">
                {requirements.length
                  ? "No requirement matches the filters"
                  : "No saved requirements"}
              </Typography>
              <Typography as="p">
                {requirements.length
                  ? "Change the search or remove the filters to see other results."
                  : "Approved requirements will appear here once the API saves them."}
              </Typography>
              {(search || status !== "all" || topic !== "all") && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSearch("");
                    setStatus("all");
                    setTopic("all");
                  }}
                >
                  Clear filters
                </Button>
              )}
            </Card>
          )}

          {!isLoading && !error && filteredRequirements.length > 0 && (
            <div className="grid gap-3 md:grid-cols-2">
              {filteredRequirements.map((item) => (
                <Card key={item.id} className="gap-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="mb-2 flex flex-wrap gap-2">
                        <span className="rounded-full border px-2 py-0.5 text-xs">
                          {item.class === "FR"
                            ? "Functional"
                            : item.class === "NFR"
                              ? "Non-functional"
                              : item.class}
                        </span>
                        <span className="rounded-full border px-2 py-0.5 text-xs">
                          {statusLabel(item.status)}
                        </span>
                      </div>
                      <Typography as="h2" className="text-base font-semibold">
                        {item.title}
                      </Typography>
                    </div>
                    <span className="shrink-0 text-xs text-muted-foreground">
                      v{item.current_version}
                    </span>
                  </div>
                  {item.statement && (
                    <p className="line-clamp-3 whitespace-pre-wrap text-sm text-muted-foreground">
                      {item.statement}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-1.5">
                    {(item.topics ?? []).map((value) => (
                      <span
                        key={value}
                        className="rounded-md bg-muted px-2 py-1 text-xs"
                      >
                        {value}
                      </span>
                    ))}
                  </div>
                  <div className="mt-auto flex items-center justify-between gap-3 border-t pt-3">
                    <span className="text-xs text-muted-foreground">
                      Updated on {formatDate(item.updated_at)}
                    </span>
                    <Link
                      to="/projects/$projectId/requirements/$id"
                      params={{ projectId, id: item.id }}
                      className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-primary/50 px-3 text-sm transition-colors hover:bg-primary hover:text-foreground"
                    >
                      Details <ArrowUpRight className="size-4" />
                    </Link>
                  </div>
                </Card>
              ))}
            </div>
          )}
          {!isLoading && !error && filteredRequirements.length > 0 && (
            <p className="text-xs text-muted-foreground">
              Exibindo {filteredRequirements.length} de {requirements.length}{" "}
              requisitos.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
