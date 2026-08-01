#!/usr/bin/env node
/**
 * elliot-os MCP server
 *
 * Gives an agent structured, first-party access to Elliot's work instead of
 * scraping HTML. Zero dependencies: JSON-RPC 2.0 over newline-delimited stdio,
 * the MCP stdio transport, implemented by hand — same "no dependency you can't
 * account for" bet the site itself makes.
 *
 * Tools:
 *   get_profile   the canonical machine-readable summary (public/llms.txt)
 *   get_projects  featured repos + a live GitHub repo list (best-effort)
 *   get_now       what Elliot is shipping this week (content/now.md)
 *   get_spend     the agent inference ledger (data/spend.json)
 *   get_fit       compose a critical hiring briefing for a pasted job spec
 *
 * Run:  node mcp/server.mjs        (stdio; wire into any MCP client)
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createInterface } from "node:readline";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://elliotjlt.github.io/elliot-os";
const GH_USER = "ElliotJLT";
const FEATURED = [
  "boulot-os",
  "Claude-Skill-Potions",
  "vox",
  "dabble",
  "homebuyer-mcp",
  "claude-eval-toolkit",
  "crux",
  "hooksmith",
];

const read = (p) => readFileSync(join(ROOT, p), "utf-8");

function buildFit(jobSpec) {
  const spec = String(jobSpec || "").trim();
  if (!spec) {
    return (
      `Read ${SITE}/llms.txt and the raw sources it links. Give a critical ` +
      `overview of Elliot Little as a senior product / AI hire: strengths, ` +
      `gaps, and the roles he is and is not suited for. Cite specific shipped ` +
      `work for every claim.`
    );
  }
  return (
    `Read ${SITE}/llms.txt and the raw sources it links. Then assess Elliot ` +
    `Little against this job spec:\n\n${spec}\n\nBe critical. If he is not a ` +
    `strong fit, say so and say why. Cite specific shipped work for every claim.`
  );
}

async function getProjects() {
  const featured = { note: "Curated. Full list is live from GitHub.", repos: FEATURED };
  try {
    const res = await fetch(
      `https://api.github.com/users/${GH_USER}/repos?per_page=100&sort=pushed`,
      { headers: { Accept: "application/vnd.github+json" } },
    );
    if (!res.ok) throw new Error(String(res.status));
    const repos = await res.json();
    featured.live = repos
      .filter((r) => !r.fork)
      .map((r) => ({
        name: r.name,
        url: r.html_url,
        description: r.description,
        stars: r.stargazers_count,
        pushed_at: r.pushed_at,
      }));
  } catch {
    featured.live = null;
    featured.live_error = "GitHub API unreachable; showing featured names only.";
  }
  return featured;
}

const TOOLS = [
  {
    name: "get_profile",
    description:
      "Elliot Little's canonical machine-readable profile (llms.txt): who he " +
      "is, track record, projects, current status, and honest fit guidance.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    run: async () => read("public/llms.txt"),
  },
  {
    name: "get_projects",
    description:
      "Featured repositories plus a best-effort live list of all public " +
      "GitHub repos (name, url, description, stars, last push).",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    run: async () => JSON.stringify(await getProjects(), null, 2),
  },
  {
    name: "get_now",
    description:
      "What Elliot is shipping this week. An agent-maintained shipping log " +
      "derived from real commits, plus a hand-written section.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    run: async () => read("content/now.md"),
  },
  {
    name: "get_spend",
    description:
      "The agent inference ledger (data/spend.json): runs, tokens, and USD " +
      "cost of the agents that maintain this site. Measured, not estimated.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    run: async () => read("data/spend.json"),
  },
  {
    name: "get_fit",
    description:
      "Compose a critical hiring briefing that assesses Elliot against a job " +
      "spec, wired to route through llms.txt and the raw sources. Pass the " +
      "spec as job_spec; omit it for a general critical overview.",
    inputSchema: {
      type: "object",
      properties: {
        job_spec: { type: "string", description: "The job spec to assess against." },
      },
      additionalProperties: false,
    },
    run: async (args) => buildFit(args?.job_spec),
  },
];

const TOOL_MAP = new Map(TOOLS.map((t) => [t.name, t]));
const PROTOCOL_VERSION = "2024-11-05";

function send(msg) {
  process.stdout.write(JSON.stringify(msg) + "\n");
}

function ok(id, result) {
  send({ jsonrpc: "2.0", id, result });
}

function fail(id, code, message) {
  send({ jsonrpc: "2.0", id, error: { code, message } });
}

async function handle(msg) {
  const { id, method, params } = msg;
  // Notifications (no id) never get a response.
  if (id === undefined || id === null) return;

  switch (method) {
    case "initialize":
      return ok(id, {
        protocolVersion: params?.protocolVersion || PROTOCOL_VERSION,
        capabilities: { tools: {} },
        serverInfo: { name: "elliot-os", version: "1.0.0" },
      });
    case "ping":
      return ok(id, {});
    case "tools/list":
      return ok(id, {
        tools: TOOLS.map(({ name, description, inputSchema }) => ({
          name,
          description,
          inputSchema,
        })),
      });
    case "tools/call": {
      const tool = TOOL_MAP.get(params?.name);
      if (!tool) return fail(id, -32602, `Unknown tool: ${params?.name}`);
      try {
        const text = await tool.run(params?.arguments || {});
        return ok(id, { content: [{ type: "text", text }] });
      } catch (err) {
        return ok(id, {
          content: [{ type: "text", text: `Error: ${err?.message || err}` }],
          isError: true,
        });
      }
    }
    default:
      return fail(id, -32601, `Method not found: ${method}`);
  }
}

const rl = createInterface({ input: process.stdin });
rl.on("line", (line) => {
  const trimmed = line.trim();
  if (!trimmed) return;
  let msg;
  try {
    msg = JSON.parse(trimmed);
  } catch {
    return; // ignore non-JSON noise
  }
  handle(msg).catch((err) => {
    if (msg?.id != null) fail(msg.id, -32603, String(err?.message || err));
  });
});
