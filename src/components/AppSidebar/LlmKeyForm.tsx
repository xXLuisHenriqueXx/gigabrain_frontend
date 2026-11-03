import { useState } from "react";
import { KeyRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getLlmKey, setLlmKey } from "@/services/llmKey";

/** Where the user types the DeepSeek key. It stays in this browser and goes to the API only as a header. */
export function LlmKeyForm() {
  const [value, setValue] = useState("");
  const [saved, setSaved] = useState(() => Boolean(getLlmKey()));

  const save = () => {
    setLlmKey(value);
    setSaved(Boolean(value.trim()));
    setValue("");
  };

  return (
    <div className="flex flex-col gap-2 px-2 pb-2">
      <label htmlFor="llm-key" className="flex items-center gap-2 text-xs font-medium">
        <KeyRound className="size-3.5" /> Chave do DeepSeek
        {saved && <span className="ml-auto text-emerald-600">salva</span>}
      </label>
      <Input
        id="llm-key"
        type="password"
        autoComplete="off"
        className="h-9 rounded-lg px-3 py-1"
        placeholder={saved ? "•••••••• (digite para trocar)" : "sk-..."}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <div className="flex gap-2">
        <Button className="h-8 flex-1 text-xs" disabled={!value.trim()} onClick={save}>
          Salvar
        </Button>
        {saved && (
          <Button
            variant="ghost"
            className="h-8 text-xs"
            onClick={() => {
              setLlmKey("");
              setSaved(false);
            }}
          >
            Remover
          </Button>
        )}
      </div>
      <p className="text-[11px] leading-snug text-muted-foreground">
        Fica só neste navegador e vale para as próximas conversas.
      </p>
    </div>
  );
}
