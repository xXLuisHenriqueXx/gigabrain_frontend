import { useCallback, useEffect, useState } from "react";
import { ValidationPanel } from "@/components/ValidationPanel";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertCircle, ArrowLeft, Clock3, FileText, GitBranch, LoaderCircle, RefreshCw } from "lucide-react";

import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Typography } from "@/components/ui/typography";
import { getApiErrorMessage } from "@/services/api";
import { HistoryService } from "@/services/history.service";
import type { AcceptanceCriterion, RequirementDetails } from "@/services/api.types";

export const Route = createFileRoute("/projects/$projectId/requirements/$id/")({ component: RequirementDetailsPage });

function formatDate(value: unknown): string {
  if (typeof value !== "string") return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function readString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function RecordDetails({ value }: { value: Record<string, unknown> }) {
  const entries = Object.entries(value).filter(([key, item]) => !["content", "knowledge"].includes(key) && item !== null && item !== undefined && typeof item !== "object");
  if (!entries.length) return <p className="text-sm text-muted-foreground">No additional metadata.</p>;
  return <dl className="grid gap-3 sm:grid-cols-2">{entries.map(([key, item]) => <div key={key} className="min-w-0"><dt className="text-xs text-muted-foreground">{key.replaceAll("_", " ")}</dt><dd className="break-words text-sm">{String(item)}</dd></div>)}</dl>;
}

function RequirementDetailsPage() {
  const { projectId, id } = Route.useParams();
  const [requirement, setRequirement] = useState<RequirementDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRequirement = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try { setRequirement(await HistoryService.getRequirementById(projectId, id)); }
    catch (requestError) { setError(getApiErrorMessage(requestError, "Could not load the requirement details.")); }
    finally { setIsLoading(false); }
  }, [projectId, id]);

  useEffect(() => { void loadRequirement(); }, [loadRequirement]);

  const content = requirement?.content;
  const story = content?.story;
  const criteria = Array.isArray(content?.acceptance_criteria) ? content.acceptance_criteria as AcceptanceCriterion[] : [];
  const quality = requirement?.quality;
  const qualityItems = quality ? [
    ["EARS pattern", quality.ears ? "Met" : "Not met"],
    ["Complete story", quality.story_complete ? "Met" : "Not met"],
    ["Criteria in Gherkin", quality.criteria_gherkin ? "Met" : "Not met"],
    ["Number of criteria", String(quality.criteria_count)],
    ["Vague terms", quality.vague_terms?.length ? quality.vague_terms.join(", ") : "None found"],
  ] : [];

  return <main className="flex h-dvh min-h-[560px] w-full flex-col overflow-hidden">
    <AppSidebar />
    <header className="flex items-start gap-3 border-b px-4 py-4 sm:px-8">
      <SidebarTrigger className="mt-1 shrink-0" />
      <div className="min-w-0 flex-1"><Typography as="h1" className="text-xl font-semibold">{requirement?.title ?? "Requirement details"}</Typography><Typography as="p" className="mt-1">Details, quality, versions and traceability.</Typography></div>
      <Button variant="outline" className="h-9 px-3" onClick={() => void loadRequirement()} disabled={isLoading}><RefreshCw className={isLoading ? "animate-spin" : ""} /><span className="hidden sm:inline">Refresh</span></Button>
    </header>
    <section className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8"><div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <div><Link to="/projects/$projectId/requirements" params={{ projectId }} className="inline-flex h-9 items-center justify-center gap-2 rounded-full px-3 text-sm transition-colors hover:bg-primary/10"><ArrowLeft className="size-4" /> Back to requirements</Link></div>
      {isLoading && <div role="status" className="flex items-center gap-2 py-12 text-sm text-muted-foreground"><LoaderCircle className="size-4 animate-spin" /> Loading requirement...</div>}
      {error && !isLoading && <Card role="alert" className="gap-3"><div className="flex items-start gap-2 text-destructive"><AlertCircle className="mt-0.5 size-4 shrink-0" /><p className="text-sm">{error}</p></div><Button variant="outline" onClick={() => void loadRequirement()}><RefreshCw /> Try again</Button></Card>}
      {!isLoading && !error && requirement && <>
        <Card className="gap-4"><div className="flex flex-wrap items-center gap-2"><span className="rounded-full border px-2.5 py-1 text-xs">{content?.class === "FR" ? "Functional" : content?.class === "NFR" ? "Non-functional" : content?.class ?? "Classification not provided"}</span><span className="rounded-full border px-2.5 py-1 text-xs">{requirement.status}</span><span className="rounded-full border px-2.5 py-1 text-xs">Version {requirement.current_version}</span></div><Typography as="h2" className="text-lg font-semibold">Description</Typography><p className="whitespace-pre-wrap text-sm leading-6">{content?.statement ?? "No description available."}</p><div className="grid gap-3 border-t pt-4 sm:grid-cols-3"><div><span className="text-xs text-muted-foreground">ID</span><p className="break-all text-sm">{requirement.id}</p></div><div><span className="text-xs text-muted-foreground">Created on</span><p className="text-sm">{formatDate((requirement as Record<string, unknown>).created_at)}</p></div><div><span className="text-xs text-muted-foreground">Updated on</span><p className="text-sm">{formatDate((requirement as Record<string, unknown>).updated_at)}</p></div></div><div className="flex flex-wrap gap-1.5">{(content?.topics ?? []).map((topic) => <span key={topic} className="rounded-md bg-muted px-2 py-1 text-xs">{topic}</span>)}</div></Card>

        {story && <Card className="gap-3"><div className="flex items-center gap-2"><FileText className="size-4" /><Typography as="h2" className="font-semibold">User story</Typography></div><p className="text-sm leading-6">As <strong>{story.role}</strong>, I want <strong>{story.goal}</strong> so that <strong>{story.benefit}</strong>.</p></Card>}

        <Card className="gap-3"><Typography as="h2" className="font-semibold">Acceptance criteria</Typography>{criteria.length ? <ol className="flex flex-col gap-3">{criteria.map((criterion, index) => <li key={`${criterion.scenario}-${index}`} className="rounded-xl border p-3"><p className="font-medium text-sm">{criterion.scenario || `Criterion ${index + 1}`}</p><dl className="mt-2 grid gap-2 text-sm sm:grid-cols-3">{([["Dado", criterion.given], ["When", criterion.when], ["Then", criterion.then]] as const).map(([label, value]) => <div key={label}><dt className="text-xs text-muted-foreground">{label}</dt><dd className="whitespace-pre-wrap">{value || "—"}</dd></div>)}</dl></li>)}</ol> : <p className="text-sm text-muted-foreground">The API did not return structured acceptance criteria for this requirement.</p>}</Card>

        <ValidationPanel validation={requirement?.validation} /><Card className="gap-3"><Typography as="h2" className="font-semibold">Quality</Typography>{qualityItems.length ? <dl className="grid gap-3 sm:grid-cols-2">{qualityItems.map(([label, value]) => <div key={label} className="rounded-lg bg-muted/40 p-3"><dt className="text-xs text-muted-foreground">{label}</dt><dd className="mt-1 text-sm font-medium">{value}</dd></div>)}</dl> : <p className="text-sm text-muted-foreground">No quality results available.</p>}{quality?.ears_pattern && <div><span className="text-xs text-muted-foreground">EARS pattern</span><p className="mt-1 break-words text-sm">{quality.ears_pattern}</p></div>}</Card>

        <Card className="gap-3"><div className="flex items-center gap-2"><Clock3 className="size-4" /><Typography as="h2" className="font-semibold">Versions</Typography></div>{requirement.versions?.length ? <ol className="flex flex-col gap-2">{requirement.versions.map((version, index) => <li key={readString(version.id) ?? `${index}`} className="rounded-xl border p-3"><div className="mb-2 flex items-center justify-between gap-2"><span className="font-medium text-sm">Version {readString(version.version) ?? readString(version.number) ?? String(index + 1)}</span><span className="text-xs text-muted-foreground">{formatDate(version.created_at ?? version.updated_at)}</span></div><RecordDetails value={version} /></li>)}</ol> : <p className="text-sm text-muted-foreground">The version history was not returned by the API.</p>}</Card>

        <Card className="gap-3"><div className="flex items-center gap-2"><GitBranch className="size-4" /><Typography as="h2" className="font-semibold">Traceability and relationships</Typography></div>{requirement.links?.length ? <ul className="flex flex-col gap-2">{requirement.links.map((link) => { const relatedId = link.source_id === requirement.id ? link.target_id : link.source_id; return <li key={link.id} className="rounded-xl border p-3"><div className="flex flex-wrap items-center justify-between gap-2"><span className="text-sm font-medium">{link.kind.replaceAll("_", " ")}</span><Link to="/projects/$projectId/requirements/$id" params={{ projectId, id: relatedId }} className="text-sm underline underline-offset-4">{relatedId}</Link></div>{link.reason && <p className="mt-1 text-sm text-muted-foreground">{link.reason}</p>}<p className="mt-1 text-xs text-muted-foreground">Created on {formatDate(link.created_at)}</p></li>; })}</ul> : <p className="text-sm text-muted-foreground">No relationships were returned for this requirement.</p>}{requirement.trace?.length ? <div className="border-t pt-3"><Typography as="h3" className="mb-2 font-medium">Traceability records</Typography><ul className="flex flex-col gap-2">{requirement.trace.map((entry, index) => <li key={readString(entry.id) ?? String(index)} className="rounded-lg bg-muted/40 p-3"><RecordDetails value={entry} /></li>)}</ul></div> : null}</Card>
      </>}
    </div></section>
  </main>;
}
