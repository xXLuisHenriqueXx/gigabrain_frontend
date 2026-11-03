import { CheckCircle2, CircleAlert } from "lucide-react";

import type { ValidationReport } from "@/services/api.types";

const label = (text: string) => text.replaceAll("_", " ");

function Score({ name, score, ok }: { name: string; score: number; ok: boolean }) {
  return (
    <div className="flex items-center gap-2 rounded-lg bg-muted/40 p-2 text-sm">
      {ok ? (
        <CheckCircle2 className="size-4 text-emerald-600" />
      ) : (
        <CircleAlert className="size-4 text-amber-600" />
      )}
      <span className="capitalize">{label(name)}</span>
      <span className="ml-auto text-xs text-muted-foreground">{score.toFixed(2)}</span>
    </div>
  );
}

/** The Critic's scores (0 to 1) per competency, plus its findings. */
export function ValidationPanel({ validation }: { validation?: ValidationReport | null }) {
  if (!validation) return null;

  const failed = validation.failed_dimensions ?? [];
  const items = Object.entries(validation.scores ?? {});
  const document = Object.entries(validation.document ?? {}).filter(([, x]) => x.assessed);
  const findings = validation.findings ?? [];

  return (
    <details className="rounded-xl border px-3 py-2" open={failed.length > 0}>
      <summary className="cursor-pointer text-sm font-medium">
        Critic validation · <span className="capitalize">{label(validation.verdict)}</span>
      </summary>
      <div className="mt-3 flex flex-col gap-3">
        {items.length > 0 && (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {items.map(([name, score]) => (
              <Score key={name} name={name} score={score} ok={!failed.includes(name)} />
            ))}
          </div>
        )}
        {document.length > 0 && (
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {document.map(([name, x]) => (
              <Score key={name} name={name} score={x.score} ok={x.passed} />
            ))}
          </div>
        )}
        {findings.length > 0 && (
          <ul className="flex flex-col gap-2 text-sm">
            {findings.map((finding, index) => (
              <li key={index} className="rounded-lg border p-2">
                <span className="mr-2 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs">
                  {finding.severity}
                </span>
                {finding.message}
                {finding.suggestion && (
                  <p className="mt-1 text-xs text-muted-foreground">{finding.suggestion}</p>
                )}
              </li>
            ))}
          </ul>
        )}
        {validation.saved_with && (
          <p className="text-xs text-muted-foreground">
            Saved with report {validation.saved_with.report_id}
            {validation.saved_with.verdict ? ` (${label(validation.saved_with.verdict)})` : ""}.
          </p>
        )}
      </div>
    </details>
  );
}
