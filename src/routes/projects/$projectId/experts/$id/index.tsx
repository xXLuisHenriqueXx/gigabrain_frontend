import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertCircle, ArrowLeft, BrainCircuit, Clock3, FileText, LoaderCircle, RefreshCw } from "lucide-react";

import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Typography } from "@/components/ui/typography";
import { getApiErrorMessage } from "@/services/api";
import { HistoryService } from "@/services/history.service";
import type { ExpertDetails } from "@/services/api.types";

export const Route = createFileRoute("/projects/$projectId/experts/$id/")({ component: ExpertDetailsPage });

function formatDate(value: unknown): string {
  if (typeof value !== "string" || !value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium", timeStyle: "short" }).format(date);
}

function stringifyValue(value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") return String(value);
  try { return JSON.stringify(value, null, 2); } catch { return String(value); }
}

function ExpertDetailsPage() {
  const { projectId, id } = Route.useParams();
  const [expert, setExpert] = useState<ExpertDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadExpert = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setExpert(await HistoryService.getExpertById(projectId, id));
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Não foi possível carregar os detalhes do especialista."));
    } finally {
      setIsLoading(false);
    }
  }, [projectId, id]);

  useEffect(() => { void loadExpert(); }, [loadExpert]);

  return (
    <main className="flex h-dvh min-h-[560px] w-full flex-col overflow-hidden">
      <AppSidebar />
      <header className="flex items-start gap-3 border-b px-4 py-4 sm:px-8">
        <SidebarTrigger className="mt-1 shrink-0" />
        <div className="min-w-0 flex-1"><Typography as="h1" className="text-xl font-semibold">Detalhes do especialista</Typography><Typography as="p" className="mt-1">Área de atuação, base de conhecimento e histórico de versões.</Typography></div>
        <Button variant="outline" className="h-9 px-3" onClick={() => void loadExpert()} disabled={isLoading}><RefreshCw className={isLoading ? "animate-spin" : ""} /><span className="hidden sm:inline">Atualizar</span></Button>
      </header>
      <section className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8"><div className="mx-auto flex w-full max-w-5xl flex-col gap-5">
        <Link to="/projects/$projectId/experts" params={{ projectId }} className="inline-flex w-fit items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" /> Voltar para especialistas</Link>
        {isLoading && <div role="status" className="flex items-center gap-2 py-12 text-sm text-muted-foreground"><LoaderCircle className="size-4 animate-spin" /> Carregando especialista...</div>}
        {error && !isLoading && <Card role="alert" className="gap-3"><div className="flex items-start gap-2 text-destructive"><AlertCircle className="mt-0.5 size-4 shrink-0" /><p className="text-sm">{error}</p></div><Button variant="outline" onClick={() => void loadExpert()}><RefreshCw /> Tentar novamente</Button></Card>}
        {!isLoading && !error && expert && <>
          <Card className="gap-4"><div className="flex items-start gap-3"><div className="rounded-xl bg-muted p-3"><BrainCircuit className="size-6" /></div><div className="min-w-0 flex-1"><Typography as="h2" className="text-lg font-semibold">{expert.topic || "Especialista sem tópico"}</Typography><p className="mt-1 break-all text-xs text-muted-foreground">ID: {expert.id}</p></div><span className="shrink-0 rounded-full border px-2 py-1 text-xs">Versão {expert.knowledge_version}</span></div><p className="whitespace-pre-wrap text-sm leading-6">{expert.description || "Sem descrição cadastrada."}</p><div className="grid gap-3 sm:grid-cols-3"><div className="rounded-xl bg-muted/40 p-3"><p className="text-xs text-muted-foreground">Consultas</p><p className="mt-1 text-xl font-semibold">{expert.consultations ?? 0}</p></div><div className="rounded-xl bg-muted/40 p-3"><p className="text-xs text-muted-foreground">Criado em</p><p className="mt-1 text-sm font-medium">{formatDate(expert.created_at)}</p></div><div className="rounded-xl bg-muted/40 p-3"><p className="text-xs text-muted-foreground">Atualizado em</p><p className="mt-1 text-sm font-medium">{formatDate(expert.updated_at)}</p></div></div></Card>

          <Card className="gap-3"><div className="flex items-center gap-2"><FileText className="size-4" /><Typography as="h2" className="font-semibold">Base de conhecimento</Typography></div><p className="text-xs text-muted-foreground">Arquivo de origem: {expert.file || "não informado"}</p>{expert.knowledge?.trim() ? <pre className="max-h-[560px] overflow-auto whitespace-pre-wrap break-words rounded-xl border bg-muted/20 p-4 font-sans text-sm leading-6">{expert.knowledge}</pre> : <p className="text-sm text-muted-foreground">A API não retornou o conteúdo da base de conhecimento.</p>}</Card>

          <Card className="gap-3"><div className="flex items-center gap-2"><Clock3 className="size-4" /><Typography as="h2" className="font-semibold">Histórico de versões</Typography></div>{expert.versions?.length ? <ol className="flex flex-col gap-3">{expert.versions.map((version, index) => <li key={String(version.id ?? version.version ?? index)} className="rounded-xl border p-3"><div className="mb-2 flex flex-wrap items-center justify-between gap-2"><span className="font-medium">Versão {String(version.version ?? version.number ?? index + 1)}</span><span className="text-xs text-muted-foreground">{formatDate(version.created_at ?? version.updated_at)}</span></div><pre className="overflow-auto whitespace-pre-wrap break-words text-xs leading-5">{stringifyValue(version)}</pre></li>)}</ol> : <p className="text-sm text-muted-foreground">Nenhuma versão anterior foi retornada pela API.</p>}</Card>
        </>}
      </div></section>
    </main>
  );
}
