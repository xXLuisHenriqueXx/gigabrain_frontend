import { useCallback, useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  AlertCircle,
  BrainCircuit,
  FileText,
  LoaderCircle,
  MessageSquare,
  Plus,
  RefreshCw,
  Settings,
  User,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Typography } from "@/components/ui/typography";
import { getApiErrorMessage } from "@/services/api";
import {
  CONVERSATIONS_UPDATED_EVENT,
  HistoryService,
} from "@/services/history.service";
import type { ConversationSummary } from "@/services/api.types";

import { Logo } from "./Logo";

function getConversationLabel(conversation: ConversationSummary): string {
  if (conversation.title?.trim()) return conversation.title.trim();
  return `Conversa ${conversation.id.slice(0, 8)}`;
}

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  }).format(date);
}

export function AppSidebar() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  });

  const loadConversations = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await HistoryService.getChats();
      setConversations(result);
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          "Não foi possível carregar o histórico.",
        ),
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadConversations();
    window.addEventListener(CONVERSATIONS_UPDATED_EVENT, loadConversations);
    return () =>
      window.removeEventListener(
        CONVERSATIONS_UPDATED_EVENT,
        loadConversations,
      );
  }, [loadConversations]);

  return (
    <Sidebar>
      <SidebarHeader>
        <Logo />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={
                    <Link to="/project/new" activeOptions={{ exact: true }} />
                  }
                  isActive={pathname === "/project/new"}
                  tooltip="Nova conversa"
                >
                  <Plus />
                  <span>Nova conversa</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link to="/requirements" />}
                  isActive={
                    pathname === "/requirements" ||
                    pathname.startsWith("/requirements/")
                  }
                  tooltip="Requisitos"
                >
                  <FileText />
                  <span>Requisitos</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  render={<Link to="/experts" />}
                  isActive={
                    pathname === "/experts" || pathname.startsWith("/experts/")
                  }
                  tooltip="Especialistas"
                >
                  <BrainCircuit />
                  <span>Especialistas</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <div className="flex items-center justify-between gap-2 px-2">
            <SidebarGroupLabel className="px-0">
              Conversas recentes
            </SidebarGroupLabel>
            <Button
              variant="ghost"
              size="icon"
              className="size-7"
              aria-label="Atualizar conversas"
              onClick={() => void loadConversations()}
              disabled={isLoading}
            >
              {isLoading ? (
                <LoaderCircle className="size-3.5 animate-spin" />
              ) : (
                <RefreshCw className="size-3.5" />
              )}
            </Button>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {isLoading && conversations.length === 0 && (
                <SidebarMenuItem>
                  <div
                    role="status"
                    className="flex items-center gap-2 px-2 py-3 text-xs text-muted-foreground"
                  >
                    <LoaderCircle className="size-3.5 animate-spin" />{" "}
                    Carregando histórico...
                  </div>
                </SidebarMenuItem>
              )}

              {error && (
                <SidebarMenuItem>
                  <div
                    className="flex items-start gap-2 px-2 py-2 text-xs text-destructive"
                    role="alert"
                  >
                    <AlertCircle className="mt-0.5 size-3.5 shrink-0" />
                    <span className="min-w-0 flex-1">{error}</span>
                  </div>
                  <Button
                    variant="ghost"
                    className="ml-1 h-7 px-2 text-xs"
                    onClick={() => void loadConversations()}
                  >
                    Tentar novamente
                  </Button>
                </SidebarMenuItem>
              )}

              {!isLoading && !error && conversations.length === 0 && (
                <SidebarMenuItem>
                  <Typography as="p" className="px-2 py-3 text-xs">
                    Nenhuma conversa encontrada.
                  </Typography>
                </SidebarMenuItem>
              )}

              {conversations.map((conversation) => {
                const to = "/project/$id" as const;
                const active = pathname === `/project/${conversation.id}`;
                return (
                  <SidebarMenuItem key={conversation.id}>
                    <SidebarMenuButton
                      render={<Link to={to} params={{ id: conversation.id }} />}
                      isActive={active}
                      tooltip={getConversationLabel(conversation)}
                    >
                      <MessageSquare />
                      <span className="min-w-0 flex-1 truncate">
                        {getConversationLabel(conversation)}
                      </span>
                      <span className="shrink-0 text-[10px] text-muted-foreground">
                        {formatDate(conversation.started_at)}
                      </span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Configurações" disabled>
              <Settings />
              <span>Configurações</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Perfil" disabled>
              <User />
              <span>Perfil</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
