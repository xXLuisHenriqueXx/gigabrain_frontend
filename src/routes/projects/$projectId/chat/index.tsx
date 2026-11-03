import { createFileRoute } from "@tanstack/react-router";
import { ValidationPanel } from "@/components/ValidationPanel";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  CircleAlert,
  LoaderCircle,
  MessageSquare,
  RotateCcw,
  Send,
  XCircle,
} from "lucide-react";

import { Typography } from "@/components/ui/typography";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChatService } from "@/services/chat.service";
import { getApiErrorMessage } from "@/services/api";
import type {
  BehindTheScenesEvent,
  ConversationAction,
  ProposedRequirement,
  TwinAnswer,
} from "@/services/api.types";
import { getWelcomeMessage } from "@/utils/getWelcomeMessage";
import { AppSidebar } from "@/components/AppSidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { notifyConversationsUpdated } from "@/services/history.service";

export const Route = createFileRoute("/projects/$projectId/chat/")({
  component: Chat,
});

type ChatMessage = {
  id: string;
  author: "po" | "twin";
  text: string;
  action?: ConversationAction;
  requirements?: ProposedRequirement[];
  events?: BehindTheScenesEvent[];
  saved?: string[];
};

function getMessageId() {
  return globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random()}`;
}

function Chat() {
  const { projectId } = Route.useParams();
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isOpening, setIsOpening] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [isConversationActive, setIsConversationActive] = useState(true);
  const [hasPendingProposal, setHasPendingProposal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const openingRef = useRef(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);

  const openConversation = useCallback(async () => {
    if (openingRef.current) return;

    openingRef.current = true;
    setIsOpening(true);
    setError(null);
    setNotice(null);

    try {
      const response = await ChatService.openChat(projectId);
      if (typeof response.id !== "string" || !response.id) {
        throw new Error("A API não retornou um ID de conversa válido.");
      }

      setConversationId(response.id);
      setIsConversationActive(response.active);
      setMessages([]);
      setHasPendingProposal(false);
      notifyConversationsUpdated();
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          "Não foi possível iniciar a conversa. Tente novamente.",
        ),
      );
      openingRef.current = false;
    } finally {
      openingRef.current = false;
      setIsOpening(false);
    }
  }, [projectId]);

  useEffect(() => {
    void openConversation();
  }, [openConversation]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isSending, isApproving, notice, error]);

  const appendAnswer = (answer: TwinAnswer) => {
    setMessages((current) => [
      ...current,
      {
        id: getMessageId(),
        author: "twin",
        text: answer.message,
        action: answer.action,
        requirements: answer.proposed_requirements ?? [],
        events: answer.behind_the_scenes ?? [],
        saved: answer.saved ?? [],
      },
    ]);
    setHasPendingProposal(answer.pending_proposal);
    setIsConversationActive(answer.conversation_active);

    if (answer.action === "approved") {
      setNotice(
        answer.saved?.length
          ? `Requisitos aprovados e salvos: ${answer.saved.join(", ")}.`
          : "A aprovação foi confirmada pela API.",
      );
    } else {
      setNotice(null);
    }
  };

  const submit = async () => {
    const text = message.trim();
    if (
      !text ||
      !conversationId ||
      isSending ||
      isApproving ||
      !isConversationActive
    ) {
      return;
    }

    const optimisticId = getMessageId();
    setMessages((current) => [
      ...current,
      { id: optimisticId, author: "po", text },
    ]);
    setMessage("");
    setIsSending(true);
    setError(null);
    setNotice(null);

    try {
      const answer = await ChatService.sendMessage(projectId, conversationId, text);
      appendAnswer(answer);
      notifyConversationsUpdated();
    } catch (requestError) {
      setMessages((current) =>
        current.filter((item) => item.id !== optimisticId),
      );
      setMessage(text);
      setError(
        getApiErrorMessage(
          requestError,
          "Não foi possível enviar a mensagem. Tente novamente.",
        ),
      );
    } finally {
      setIsSending(false);
      composerRef.current?.focus();
    }
  };

  const approveProposal = async () => {
    if (!conversationId || !hasPendingProposal || isApproving || isSending)
      return;

    setIsApproving(true);
    setError(null);
    setNotice(null);

    try {
      const answer = await ChatService.approve(projectId, conversationId);
      appendAnswer(answer);
      if (answer.action !== "approved") {
        setNotice(
          "A API respondeu à solicitação, mas não confirmou a aprovação. Confira a resposta antes de continuar.",
        );
      }
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          "Não foi possível aprovar a proposta. Nenhuma aprovação será presumida.",
        ),
      );
    } finally {
      setIsApproving(false);
    }
  };

  const closeConversation = async () => {
    if (
      !conversationId ||
      !isConversationActive ||
      isClosing ||
      isSending ||
      isApproving
    )
      return;
    if (
      !window.confirm("Encerrar esta conversa sem aprovar a proposta pendente?")
    )
      return;

    setIsClosing(true);
    setError(null);
    setNotice(null);

    try {
      await ChatService.close(projectId, conversationId);
      setIsConversationActive(false);
      setHasPendingProposal(false);
      setNotice("Conversa encerrada. Nenhum requisito pendente foi aprovado.");
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          "Não foi possível encerrar a conversa. Tente novamente.",
        ),
      );
    } finally {
      setIsClosing(false);
    }
  };

  const isBusy = isOpening || isSending || isApproving || isClosing;

  return (
    <main className="flex h-dvh min-h-140 w-full flex-col">
      <AppSidebar />
      <header className="border-b px-4 py-4 sm:px-8">
        <div className="mx-auto flex w-full max-w-4xl items-start gap-3">
          <SidebarTrigger className="mt-1 shrink-0" />
          <div className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
            <MessageSquare className="size-5" />
          </div>
          <div className="min-w-0 flex-1">
            <Typography as="h1" className="text-xl font-semibold">
              {getWelcomeMessage()}
            </Typography>
            <Typography as="p" className="mt-1">
              Converse com o Digital Twin para definir e refinar os requisitos
              do projeto.
            </Typography>
            {conversationId && (
              <p
                className="mt-2 truncate text-xs text-muted-foreground"
                title={conversationId}
              >
                Conversa: {conversationId}
              </p>
            )}
          </div>
          {isConversationActive && conversationId && (
            <Button
              variant="ghost"
              className="h-9 rounded-xl px-3 text-muted-foreground"
              disabled={isBusy}
              onClick={() => void closeConversation()}
            >
              <XCircle />
              <span className="hidden sm:inline">Encerrar</span>
            </Button>
          )}
        </div>
      </header>

      <section
        aria-label="Histórico da conversa"
        aria-live="polite"
        className="min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8"
      >
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
          {isOpening && (
            <div
              role="status"
              className="flex items-center gap-3 text-sm text-muted-foreground"
            >
              <LoaderCircle className="size-4 animate-spin" />
              Iniciando conversa com o Digital Twin...
            </div>
          )}

          {!isOpening && messages.length === 0 && !error && (
            <div className="mx-auto my-auto flex max-w-lg flex-col items-center gap-3 py-16 text-center">
              <div className="flex size-14 items-center justify-center rounded-2xl border bg-muted/40">
                <MessageSquare className="size-6 text-muted-foreground" />
              </div>
              <Typography as="h2" className="text-lg font-semibold">
                Por onde começamos?
              </Typography>
              <Typography as="p">
                Descreva o problema que o sistema deve resolver, quem vai
                utilizá-lo ou uma necessidade inicial. O Twin fará perguntas
                para esclarecer os requisitos.
              </Typography>
            </div>
          )}

          {messages.map((item) => (
            <article
              key={item.id}
              className={`flex w-full ${item.author === "po" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`flex max-w-full flex-col gap-2 sm:max-w-[88%] ${item.author === "po" ? "items-end" : "items-start"}`}
              >
                <span className="px-1 text-xs font-medium text-muted-foreground">
                  {item.author === "po"
                    ? "Você · Product Owner"
                    : "GigaBrain · Digital Twin"}
                </span>
                <div
                  className={`whitespace-pre-wrap wrap-break-word rounded-2xl px-4 py-3 text-sm leading-6 ${item.author === "po" ? "rounded-br-md bg-primary text-primary-foreground" : "rounded-bl-md border bg-card"}`}
                >
                  {item.text}
                </div>

                {item.requirements && item.requirements.length > 0 && (
                  <div className="flex w-full flex-col gap-3 pt-1">
                    <Typography as="h3" className="font-semibold">
                      Requisitos propostos ({item.requirements.length})
                    </Typography>
                    {item.requirements.map((requirement, index) => (
                      <RequirementProposal
                        key={requirement.id ?? `${requirement.title}-${index}`}
                        requirement={requirement}
                      />
                    ))}
                  </div>
                )}

                {item.action === "propose" &&
                hasPendingProposal &&
                item.requirements?.length ? (
                  <div className="flex flex-wrap gap-2 pt-1">
                    <Button
                      onClick={() => void approveProposal()}
                      disabled={isBusy}
                      loading={isApproving}
                    >
                      <CheckCircle2 />
                      Aprovar proposta
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => composerRef.current?.focus()}
                      disabled={isBusy}
                    >
                      Solicitar ajustes
                    </Button>
                  </div>
                ) : null}

                {item.saved && item.saved.length > 0 && (
                  <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                    {item.saved.map((id) => (
                      <span
                        key={id}
                        className="rounded-full border px-2.5 py-1"
                      >
                        {id}
                      </span>
                    ))}
                  </div>
                )}

                {item.events && item.events.length > 0 && (
                  <details className="w-full rounded-xl border px-3 py-2 text-sm">
                    <summary className="cursor-pointer font-medium text-muted-foreground">
                      Etapas internas ({item.events.length})
                    </summary>
                    <ol className="mt-3 flex flex-col gap-3">
                      {item.events.map((event, index) => (
                        <li
                          key={`${event.id ?? "event"}-${index}`}
                          className="border-l-2 pl-3"
                        >
                          <p className="font-medium">
                            {event.sender} → {event.recipient}
                          </p>
                          <p className="text-muted-foreground">
                            {event.summary}
                          </p>
                        </li>
                      ))}
                    </ol>
                  </details>
                )}
              </div>
            </article>
          ))}

          {isSending && (
            <div
              role="status"
              className="flex items-center gap-3 text-sm text-muted-foreground"
            >
              <LoaderCircle className="size-4 animate-spin" />O Digital Twin
              está analisando sua mensagem. Isso pode levar até um minuto.
            </div>
          )}

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
            >
              <CircleAlert className="mt-0.5 size-4 shrink-0" />
              <div className="min-w-0 flex-1">{error}</div>
              {!conversationId && (
                <Button
                  variant="outline"
                  className="h-8 rounded-lg"
                  onClick={() => void openConversation()}
                  disabled={isOpening}
                >
                  <RotateCcw /> Tentar novamente
                </Button>
              )}
            </div>
          )}

          {notice && (
            <div
              role="status"
              className="flex items-start gap-2 rounded-xl border border-border bg-muted/40 p-3 text-sm"
            >
              <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
              <span>{notice}</span>
            </div>
          )}

          {!isConversationActive && conversationId && (
            <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed p-5 text-center">
              <Typography as="h3" className="font-semibold">
                Conversa encerrada
              </Typography>
              <Typography as="p">
                Inicie uma nova conversa para continuar refinando os requisitos.
              </Typography>
              <Button
                variant="outline"
                onClick={() => void openConversation()}
                disabled={isBusy}
              >
                <RotateCcw /> Nova conversa
              </Button>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </section>

      <footer className="border-t px-4 py-4 sm:px-8">
        <form
          className="mx-auto flex w-full max-w-4xl items-end gap-2"
          onSubmit={(event) => {
            event.preventDefault();
            void submit();
          }}
        >
          <Textarea
            ref={composerRef}
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey &&
                !event.nativeEvent.isComposing
              ) {
                event.preventDefault();
                void submit();
              }
            }}
            className="max-h-40 min-h-12 flex-1 resize-y rounded-2xl"
            disabled={isBusy || !conversationId || !isConversationActive}
            placeholder={
              isOpening
                ? "Iniciando conversa..."
                : !isConversationActive
                  ? "Esta conversa foi encerrada"
                  : "Descreva uma necessidade ou responda à pergunta do Twin..."
            }
            aria-label="Mensagem para o Digital Twin"
          />
          <Button
            type="submit"
            size="icon"
            className="rounded-2xl"
            loading={isSending}
            disabled={
              isBusy ||
              !conversationId ||
              !isConversationActive ||
              !message.trim()
            }
            aria-label="Enviar mensagem"
          >
            <Send />
          </Button>
        </form>
        <p className="mx-auto mt-2 w-full max-w-4xl text-xs text-muted-foreground">
          Enter envia · Shift + Enter quebra a linha. A aprovação é necessária
          para salvar requisitos.
        </p>
      </footer>
    </main>
  );
}

function RequirementProposal({
  requirement,
}: {
  requirement: ProposedRequirement;
}) {
  return (
    <Card className="gap-3 rounded-2xl bg-card p-4">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border px-2 py-0.5 text-xs font-semibold">
          {requirement.class}
        </span>
        {requirement.subtype && (
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
            {requirement.subtype}
          </span>
        )}
        {requirement.topics?.map((topic) => (
          <span
            key={topic}
            className="rounded-full bg-primary/10 px-2 py-0.5 text-xs"
          >
            {topic}
          </span>
        ))}
      </div>
      <Typography as="h4" className="text-base font-semibold">
        {requirement.title}
      </Typography>
      <p className="whitespace-pre-wrap text-sm leading-6">
        {requirement.statement}
      </p>

      {requirement.story && (
        <div className="rounded-xl bg-muted/40 p-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            História de usuário
          </p>
          <p className="text-sm">
            Como {requirement.story.role}, quero {requirement.story.goal}, para{" "}
            {requirement.story.benefit}.
          </p>
        </div>
      )}

      {requirement.acceptance_criteria?.length > 0 && (
        <div className="flex flex-col gap-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Critérios de aceitação
          </p>
          {requirement.acceptance_criteria.map((criterion, index) => (
            <div
              key={`${criterion.scenario}-${index}`}
              className="rounded-xl border p-3 text-sm"
            >
              <p className="mb-2 font-medium">{criterion.scenario}</p>
              <p>
                <span className="font-medium">Dado que</span> {criterion.given}
              </p>
              <p>
                <span className="font-medium">Quando</span> {criterion.when}
              </p>
              <p>
                <span className="font-medium">Então</span> {criterion.then}
              </p>
            </div>
          ))}
        </div>
      )}

      <ValidationPanel validation={requirement.validation} />

      {requirement.quality && (
        <details className="rounded-xl border px-3 py-2">
          <summary className="cursor-pointer text-sm font-medium">
            Verificações de qualidade
          </summary>
          <dl className="mt-3 grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
            <QualityItem
              label="Formato EARS"
              valid={requirement.quality.ears}
            />
            <QualityItem
              label="História completa"
              valid={requirement.quality.story_complete}
            />
            <QualityItem
              label="Critérios Gherkin"
              valid={requirement.quality.criteria_gherkin}
            />
            <div className="rounded-lg bg-muted/40 p-2">
              <dt className="text-muted-foreground">Quantidade de critérios</dt>
              <dd className="font-medium">
                {requirement.quality.criteria_count}
              </dd>
            </div>
            {requirement.quality.vague_terms?.length > 0 && (
              <div className="rounded-lg bg-destructive/5 p-2 sm:col-span-2">
                <dt className="text-muted-foreground">
                  Termos vagos identificados
                </dt>
                <dd className="font-medium">
                  {requirement.quality.vague_terms.join(", ")}
                </dd>
              </div>
            )}
          </dl>
        </details>
      )}
    </Card>
  );
}

function QualityItem({ label, valid }: { label: string; valid: boolean }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-muted/40 p-2">
      {valid ? (
        <CheckCircle2 className="size-4 text-emerald-600" />
      ) : (
        <CircleAlert className="size-4 text-amber-600" />
      )}
      <span>{label}</span>
      <span className="ml-auto text-xs text-muted-foreground">
        {valid ? "OK" : "Revisar"}
      </span>
    </div>
  );
}
