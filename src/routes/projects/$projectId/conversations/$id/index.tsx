import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  LoaderCircle,
  MessageSquare,
  RefreshCw,
} from "lucide-react";

import { AppSidebar } from "@/components/AppSidebar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Typography } from "@/components/ui/typography";
import { getApiErrorMessage } from "@/services/api";
import { HistoryService } from "@/services/history.service";
import type {
  ConversationDetails,
  ConversationMessage,
} from "@/services/api.types";

export const Route = createFileRoute("/projects/$projectId/conversations/$id/")({
  component: ConversationDetailsPage,
});

function formatTimestamp(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function getAuthorLabel(message: ConversationMessage): string {
  if (message.author === "po") return "Product Owner";
  if (message.author === "twin") return "Digital Twin";
  return message.author;
}

function ConversationDetailsPage() {
  const { projectId, id } = Route.useParams();
  const [conversation, setConversation] = useState<ConversationDetails | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConversation = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setConversation(await HistoryService.getChatById(projectId, id));
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          "Não foi possível carregar esta conversa.",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }, [projectId, id]);

  useEffect(() => {
    void loadConversation();
  }, [loadConversation]);

  const title = conversation?.title?.trim() || `Conversa ${id.slice(0, 8)}`;

  return (
    <main className="flex h-dvh min-h-140 w-full flex-col overflow-hidden">
      <AppSidebar />
      <header className="flex items-start gap-3 border-b px-4 py-4 sm:px-8">
        <SidebarTrigger className="mt-1 shrink-0" />
        <div className="min-w-0 flex-1">
          <Typography as="h1" className="text-xl font-semibold">
            {title}
          </Typography>
          <Typography as="p" className="mt-1">
            Histórico da conversa com o Digital Twin
          </Typography>
          {conversation && (
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1">
                <Clock3 className="size-3.5" /> Iniciada em{" "}
                {formatTimestamp(conversation.started_at)}
              </span>
              <span className="rounded-full border px-2 py-0.5">
                {conversation.status}
              </span>
              {conversation.pending_proposal && (
                <span className="rounded-full border border-amber-500/40 px-2 py-0.5 text-amber-700">
                  Proposta pendente
                </span>
              )}
            </div>
          )}
        </div>
        <Button
          variant="outline"
          className="h-9 px-3"
          onClick={() => void loadConversation()}
          disabled={isLoading}
        >
          <RefreshCw className={isLoading ? "animate-spin" : ""} />
          <span className="hidden sm:inline">Atualizar</span>
        </Button>
      </header>

      <section
        aria-label="Mensagens da conversa"
        className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8"
      >
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
          {isLoading && (
            <div
              role="status"
              className="flex items-center gap-2 py-8 text-sm text-muted-foreground"
            >
              <LoaderCircle className="size-4 animate-spin" /> Carregando
              mensagens da conversa...
            </div>
          )}

          {error && !isLoading && (
            <Card className="gap-3 rounded-2xl p-5" role="alert">
              <div className="flex items-start gap-2 text-destructive">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => void loadConversation()}>
                  <RefreshCw /> Tentar novamente
                </Button>
                <Link to="/projects/$projectId/chat" params={{ projectId }}>
                  <Button variant="outline">
                    <ArrowLeft /> Nova conversa
                  </Button>
                </Link>
              </div>
            </Card>
          )}

          {!isLoading &&
            !error &&
            conversation &&
            conversation.messages.length === 0 && (
              <div className="flex flex-col items-center gap-3 py-16 text-center">
                <MessageSquare className="size-8 text-muted-foreground" />
                <Typography as="h2" className="text-lg font-semibold">
                  Esta conversa ainda não tem mensagens
                </Typography>
                <Typography as="p">
                  Você pode iniciar uma nova conversa enquanto o histórico
                  permanece disponível.
                </Typography>
                <Link to="/projects/$projectId/chat" params={{ projectId }}>
                  <Button>Nova conversa</Button>
                </Link>
              </div>
            )}

          {!isLoading &&
            !error &&
            conversation?.messages.map((message) => (
              <article
                key={message.id}
                className={`flex w-full ${message.author === "po" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex max-w-full flex-col gap-2 sm:max-w-[88%] ${message.author === "po" ? "items-end" : "items-start"}`}
                >
                  <span className="px-1 text-xs font-medium text-muted-foreground">
                    {getAuthorLabel(message)}
                    {message.timestamp
                      ? ` · ${formatTimestamp(message.timestamp)}`
                      : ""}
                  </span>
                  <div
                    className={`whitespace-pre-wrap wrap-break-word rounded-2xl px-4 py-3 text-sm leading-6 ${message.author === "po" ? "rounded-br-md bg-primary text-primary-foreground" : "rounded-bl-md border bg-card"}`}
                  >
                    {message.text}
                  </div>
                  {(message.proposed_requirements?.length ?? 0) > 0 && (
                    <div className="w-full rounded-xl border p-3">
                      <Typography as="h3" className="mb-2 font-semibold">
                        Requisitos propostos (
                        {message.proposed_requirements.length})
                      </Typography>
                      <ul className="flex flex-col gap-2">
                        {message.proposed_requirements.map(
                          (requirement, index) => (
                            <li
                              key={
                                requirement.id ??
                                `${requirement.title}-${index}`
                              }
                              className="rounded-lg bg-muted/40 p-3"
                            >
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="rounded-full border px-2 py-0.5 text-xs">
                                  {requirement.class}
                                </span>
                                <span className="font-medium text-sm">
                                  {requirement.title}
                                </span>
                              </div>
                              <p className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">
                                {requirement.statement}
                              </p>
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  )}
                  {(message.saved?.length ?? 0) > 0 && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <CheckCircle2 className="size-3.5" /> Requisitos salvos:{" "}
                      {message.saved.join(", ")}
                    </div>
                  )}
                </div>
              </article>
            ))}

          {!isLoading &&
            !error &&
            conversation &&
            conversation.saved_requirements.length > 0 && (
              <Card className="gap-2 rounded-2xl p-4">
                <Typography as="h3" className="font-semibold">
                  Requisitos persistidos
                </Typography>
                <div className="flex flex-wrap gap-2">
                  {conversation.saved_requirements.map((requirementId) => (
                    <span
                      key={requirementId}
                      className="rounded-full border px-2.5 py-1 text-xs"
                    >
                      {requirementId}
                    </span>
                  ))}
                </div>
              </Card>
            )}

          {conversation && !conversation.active && !isLoading && !error && (
            <p className="rounded-xl border border-dashed p-3 text-center text-sm text-muted-foreground">
              Esta conversa está encerrada. O histórico permanece disponível
              para consulta.
            </p>
          )}
        </div>
      </section>
    </main>
  );
}
