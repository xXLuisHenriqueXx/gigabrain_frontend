import { Typography } from "@/components/ui/typography";

type Variant = "human" | "agent" | "data" | "critic";

const BOX: Record<Variant, string> = {
  human: "fill-background stroke-foreground",
  agent: "fill-background stroke-foreground",
  data: "fill-muted/60 stroke-foreground",
  critic: "fill-primary/10 stroke-primary",
};

function Box({
  x,
  y,
  w,
  h,
  title,
  sub,
  variant = "agent",
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  sub?: string;
  variant?: Variant;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={variant === "data" ? 4 : 10}
        strokeWidth={1.5}
        className={BOX[variant]}
      />
      <text
        x={x + w / 2}
        y={sub ? y + h / 2 - 3 : y + h / 2 + 5}
        textAnchor="middle"
        className="fill-foreground text-[15px] font-semibold"
      >
        {title}
      </text>
      {sub && (
        <text
          x={x + w / 2}
          y={y + h / 2 + 16}
          textAnchor="middle"
          className="fill-muted-foreground text-[12px]"
        >
          {sub}
        </text>
      )}
    </g>
  );
}

function Container({
  x,
  y,
  w,
  h,
  title,
  sub,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  title: string;
  sub: string;
}) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={16}
        strokeWidth={1.25}
        strokeDasharray="3 6"
        className="fill-none stroke-muted-foreground"
      />
      <text x={x + 18} y={y + 24} className="fill-foreground text-[12px] font-bold tracking-wider">
        {title}
      </text>
      <text x={x + 18} y={y + 41} className="fill-muted-foreground text-[11px] italic">
        {sub}
      </text>
    </g>
  );
}

function Label({
  x,
  y,
  children,
  anchor = "start",
}: {
  x: number;
  y: number;
  children: string;
  anchor?: "start" | "middle" | "end";
}) {
  return (
    <text x={x} y={y} textAnchor={anchor} className="fill-muted-foreground text-[11px] italic">
      {children}
    </text>
  );
}

const line = "fill-none stroke-foreground";
const dotted = "fill-none stroke-muted-foreground";

function Architecture() {
  return (
    <section id="architecture" className="px-4 py-24">
      <div className="mx-auto w-full max-w-5xl space-y-12">
        <div className="max-w-2xl space-y-4">
          <Typography as="span" className="text-sm font-medium text-primary">
            ARCHITECTURE
          </Typography>

          <Typography as="h2" className="text-4xl">
            Two councils, one critic and{" "}
            <span className="text-primary">your final say</span>.
          </Typography>

          <Typography as="p">
            The agents are split by what they do: some talk to you, some know a
            topic, and one only scores what the others write.
          </Typography>
        </div>

        <figure className="space-y-4">
          <div className="overflow-x-auto rounded-xl border bg-background p-2">
            <svg
              viewBox="0 0 1000 590"
              role="img"
              aria-label="GigaBrain architecture. The Product Owner talks to the Digital Twin in the deliberative council. The Twin consults the Leader of the consultative council, who routes each question to the expert of the topic. The Critic scores each proposal and sends back what does not pass. Approved requirements go to the requirements repository. All agents call the language model."
              className="min-w-[760px] w-full"
            >
              <defs>
                <marker id="arch-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" className="fill-foreground" />
                </marker>
                <marker id="arch-arrow-muted" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" className="fill-muted-foreground" />
                </marker>
                <marker id="arch-arrow-primary" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse">
                  <path d="M0,0 L10,5 L0,10 z" className="fill-primary" />
                </marker>
              </defs>

              {/* Deliberative council */}
              <Container x={40} y={30} w={560} h={150} title="DELIBERATIVE COUNCIL" sub="decides what the requirement is" />
              <Box x={70} y={78} w={160} h={70} title="Product Owner" sub="human" variant="human" />
              <Box x={390} y={78} w={190} h={70} title="Digital Twin" sub="talks, proposes, saves" />
              <path d="M230,100 H388" className={line} strokeWidth={1.5} markerEnd="url(#arch-arrow)" />
              <path d="M388,128 H232" className={line} strokeWidth={1.5} markerEnd="url(#arch-arrow)" />
              <Label x={309} y={93} anchor="middle">requests, answers</Label>
              <Label x={309} y={144} anchor="middle">questions, proposals</Label>

              {/* Repository */}
              <Box x={720} y={78} w={240} h={70} title="Requirements Repository" sub="versions · links · trace" variant="data" />
              <path d="M580,113 H718" className={line} strokeWidth={1.5} markerEnd="url(#arch-arrow)" />
              <Label x={649} y={106} anchor="middle">saved when</Label>
              <Label x={649} y={132} anchor="middle">the PO approves</Label>

              {/* Consultative council */}
              <Container x={40} y={250} w={560} h={250} title="CONSULTATIVE COUNCIL" sub="knows each topic, only recommends" />
              <Box x={250} y={285} w={200} h={60} title="Leader" sub="routes and consolidates" />
              <Box x={65} y={410} w={150} h={64} title="Expert · Payments" sub="knowledge file" />
              <Box x={245} y={410} w={150} h={64} title="Expert · Search" sub="knowledge file" />
              <Box x={425} y={410} w={150} h={64} title="Expert · Quality" sub="always present" />
              <path d="M350,345 L140,408" className={line} strokeWidth={1.25} markerEnd="url(#arch-arrow)" />
              <path d="M350,345 L320,408" className={line} strokeWidth={1.25} markerEnd="url(#arch-arrow)" />
              <path d="M350,345 L500,408" className={line} strokeWidth={1.25} markerEnd="url(#arch-arrow)" />
              <Label x={350} y={380} anchor="middle">creates a new expert when a topic is new</Label>

              {/* Twin <-> Leader */}
              <path d="M405,148 V283" className={line} strokeWidth={1.5} markerEnd="url(#arch-arrow)" />
              <path d="M435,283 V150" className={line} strokeWidth={1.5} markerEnd="url(#arch-arrow)" />
              <Label x={397} y={225} anchor="end">question</Label>
              <Label x={443} y={225}>recommendation</Label>

              {/* Critic */}
              <Box x={720} y={250} w={240} h={110} title="Critic" sub="scores, never writes" variant="critic" />
              <text x={840} y={331} textAnchor="middle" className="fill-primary text-[11px]">
                ambiguity · completeness · verifiability …
              </text>
              <path d="M520,148 V200 H780 V248" className="fill-none stroke-primary" strokeWidth={1.5} markerEnd="url(#arch-arrow-primary)" />
              <path d="M740,250 V228 H555 V150" className="fill-none stroke-primary" strokeWidth={1.5} markerEnd="url(#arch-arrow-primary)" />
              <Label x={650} y={194} anchor="middle">proposal</Label>
              <Label x={648} y={243} anchor="middle">report · sends back what fails</Label>
              <path d="M900,150 V248" className={dotted} strokeWidth={1.25} strokeDasharray="4 4" markerEnd="url(#arch-arrow-muted)" />
              <Label x={892} y={190} anchor="end">compared with</Label>
              <Label x={892} y={205} anchor="end">saved requirements</Label>

              {/* LLM */}
              <Box x={40} y={530} w={920} h={44} title="Language model (DeepSeek) · called by the Twin, the Leader and the experts" variant="data" />
              <path d="M470,148 V168 H20 V552 H38" className={dotted} strokeWidth={1.25} strokeDasharray="4 4" markerEnd="url(#arch-arrow-muted)" />
              <path d="M250,315 H20" className={dotted} strokeWidth={1.25} strokeDasharray="4 4" />
              <path d="M140,476 V528" className={dotted} strokeWidth={1.25} strokeDasharray="4 4" markerEnd="url(#arch-arrow-muted)" />
              <path d="M320,476 V528" className={dotted} strokeWidth={1.25} strokeDasharray="4 4" markerEnd="url(#arch-arrow-muted)" />
              <path d="M500,476 V528" className={dotted} strokeWidth={1.25} strokeDasharray="4 4" markerEnd="url(#arch-arrow-muted)" />
            </svg>
          </div>

          <figcaption className="grid gap-6 text-sm md:grid-cols-3">
            <div className="space-y-1">
              <Typography as="h3" className="font-semibold">Deliberative council</Typography>
              <Typography as="p">
                You and the Digital Twin talk until the requirement is clear.
                Nothing is saved without your explicit approval.
              </Typography>
            </div>
            <div className="space-y-1">
              <Typography as="h3" className="font-semibold">Consultative council</Typography>
              <Typography as="p">
                The Leader sends each question to the expert of that topic.
                Experts keep what they know in a file and only recommend.
              </Typography>
            </div>
            <div className="space-y-1">
              <Typography as="h3" className="font-semibold">Critic</Typography>
              <Typography as="p">
                Scores every proposal without calling a model, compares it with
                what is already saved and sends back what does not pass. It
                informs; it does not decide.
              </Typography>
            </div>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}

export default Architecture;
