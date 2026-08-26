export type TrackId = "intro" | "web" | "java-map" | "reading" | "trace" | "troubleshoot" | "scenario";

export type CalloutKind = "tip" | "note" | "warn" | "trap";

export type WidgetName = "explorer" | "flow" | "stack" | "http";

export type DiagramName =
  | "http-roundtrip"
  | "url-parts"
  | "request-params"
  | "get-post"
  | "status-codes"
  | "page-assets"
  | "html-json"
  | "session"
  | "layers"
  | "filters"
  | "mapping"
  | "read-entry"
  | "call-chain"
  | "value-origin"
  | "service-fork"
  | "stack-own"
  | "stack-line"
  | "not-found"
  | "env-diff"
  | "cause-sides"
  | "divide"
  | "n-plus-one"
  | "view-file"
  | "log-where"
  | "log-line"
  | "arch-roles"
  | "arch-patterns"
  | "front-back"
  | "cross-cut"
  | "debug-two"
  | "protocol-stack"
  | "template-rendered"
  | "sql-to-source";

export type Block =
  | { type: "p"; text: string; link?: { label: string; to: string } }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "code"; lang?: string; title?: string; code: string }
  | { type: "callout"; kind: CalloutKind; title: string; text: string }
  | { type: "quiz"; id: string }
  | { type: "widget"; name: WidgetName }
  | { type: "diagram"; name: DiagramName; caption?: string }
  | { type: "figure"; src: string; alt: string; caption?: string; kind?: "photo" | "screen" }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "steps"; items: { title: string; text: string }[] };

export type Lesson = {
  id: string;
  title: string;
  minutes: number;
  blocks: Block[];
};

export type Track = {
  id: TrackId;
  no: string;
  title: string;
  kicker: string;
  description: string;
  accent: string;
  lessons: Lesson[];
};

export type Quiz = {
  id: string;
  question: string;
  choices: string[];
  answer: number;
  explanation: string;
};
