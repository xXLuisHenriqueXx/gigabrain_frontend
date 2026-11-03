import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowUpRight,
  BrainCircuit,
  LoaderCircle,
  RefreshCw,
  Search,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Typography } from "@/components/ui/typography";
import { getApiErrorMessage } from "@/services/api";
import { HistoryService } from "@/services/history.service";
import type { ExpertSummary } from "@/services/api.types";

export const Route = createFileRoute("/projects/$projectId/experts/")({
  component: ExpertsPage,
});

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(date);
}

function ExpertsPage() {
  const { projectId } = Route.useParams();
  const [experts, setExperts] = useState<ExpertSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  const loadExperts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setExperts(await HistoryService.getExperts(projectId));
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Cannot load experts."));
    } finally {
      setIsLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    void loadExperts();
  }, [loadExperts]);

  const filteredExperts = useMemo(() => {
    const query = search.trim().toLocaleLowerCase("en-US");
    if (!query) return experts;
    return experts.filter((expert) =>
      [expert.id, expert.topic, expert.description, expert.file].some((value) =>
        String(value ?? "")
          .toLocaleLowerCase("en-US")
          .includes(query),
      ),
    );
  }, [experts, search]);

  return (
    <DashboardLayout>
      <div className="flex h-dvh min-h-140 w-full flex-col overflow-hidden">
        <header className="flex items-start gap-3 border-b px-4 py-4 sm:px-8">
          <SidebarTrigger className="mt-1 shrink-0" />
          <div className="min-w-0 flex-1">
            <Typography as="h1" className="text-xl font-semibold">
              Experts
            </Typography>
            <Typography as="p" className="mt-1">
              See the experts and their knowledge areas.
            </Typography>
          </div>
          <Button
            variant="outline"
            className="h-9 px-3"
            onClick={() => void loadExperts()}
            disabled={isLoading}
          >
            <RefreshCw className={isLoading ? "animate-spin" : ""} />
            <span className="hidden sm:inline">Update</span>
          </Button>
        </header>

        <section className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
            <Card className="gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-muted p-3">
                  <Users className="size-5" />
                </div>
                <div>
                  <Typography as="h2" className="font-semibold">
                    Experts Catalog
                  </Typography>
                  <Typography as="p">
                    Each expert represents a knowledge area consultable by the
                    Digital Twin.
                  </Typography>
                </div>
              </div>
              <Typography as="p" className="text-sm font-medium">
                {isLoading
                  ? "Loading …"
                  : `${experts.length} ${experts.length === 1 ? "expert" : "experts"}`}
              </Typography>
            </Card>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                aria-label="Search for experts"
                className="h-11 pl-9"
                placeholder="Search by topic, description or file name"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            {isLoading && (
              <div
                role="status"
                className="flex items-center gap-2 py-12 text-sm text-muted-foreground"
              >
                <LoaderCircle className="size-4 animate-spin" /> Loading experts
                ...
              </div>
            )}
            {error && !isLoading && (
              <Card role="alert" className="gap-3">
                <div className="flex items-start gap-2 text-destructive">
                  <AlertCircle className="mt-0.5 size-4 shrink-0" />
                  <p className="text-sm">{error}</p>
                </div>
                <Button variant="outline" onClick={() => void loadExperts()}>
                  <RefreshCw /> Try again
                </Button>
              </Card>
            )}
            {!isLoading && !error && filteredExperts.length === 0 && (
              <Card className="items-center gap-3 py-12 text-center">
                <BrainCircuit className="size-8 text-muted-foreground" />
                <Typography as="h2" className="font-semibold">
                  {experts.length
                    ? "None expert matches your search."
                    : "None expert found."}
                </Typography>
                <Typography as="p">
                  {experts.length
                    ? "Try another search term."
                    : "When the API provides experts, they will appear here."}
                </Typography>
                {search && (
                  <Button variant="outline" onClick={() => setSearch("")}>
                    Clear search
                  </Button>
                )}
              </Card>
            )}

            {!isLoading && !error && filteredExperts.length > 0 && (
              <div className="grid gap-3 md:grid-cols-2">
                {filteredExperts.map((expert) => (
                  <Card key={expert.id} className="gap-3">
                    <div className="flex items-start gap-3">
                      <div className="rounded-xl border p-3">
                        <BrainCircuit className="size-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <Typography as="h2" className="text-base font-semibold">
                          {expert.topic || "Expert without a topic"}
                        </Typography>
                        <p className="mt-1 wrap-break-word text-xs text-muted-foreground">
                          ID: {expert.id}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full border px-2 py-1 text-xs">
                        v{expert.knowledge_version}
                      </span>
                    </div>
                    <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                      {expert.description || "No description provided."}
                    </p>
                    <dl className="grid grid-cols-2 gap-3 rounded-xl bg-muted/40 p-3">
                      <div>
                        <dt className="text-xs text-muted-foreground">
                          Registered consultations
                        </dt>
                        <dd className="mt-1 font-semibold">
                          {expert.consultations ?? 0}
                        </dd>
                      </div>
                      <div className="min-w-0">
                        <dt className="text-xs text-muted-foreground">
                          Knowledge file
                        </dt>
                        <dd className="mt-1 break-all text-sm">
                          {expert.file || "—"}
                        </dd>
                      </div>
                    </dl>
                    <div className="mt-auto flex items-center justify-between gap-3 border-t pt-3">
                      <span className="text-xs text-muted-foreground">
                        Updated at {formatDate(expert.updated_at)}
                      </span>
                      <Link
                        to="/projects/$projectId/experts/$id"
                        params={{ projectId, id: expert.id }}
                        className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-primary/50 px-3 text-sm transition-colors hover:bg-primary hover:text-foreground"
                      >
                        Details <ArrowUpRight className="size-4" />
                      </Link>
                    </div>
                  </Card>
                ))}
              </div>
            )}
            {!isLoading && !error && filteredExperts.length > 0 && (
              <p className="text-xs text-muted-foreground">
                Showing {filteredExperts.length} de {experts.length} experts.
              </p>
            )}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
