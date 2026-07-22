# elliot-os MCP server

Structured, first-party access to Elliot's work for agents — so an agent
evaluating him can query the sources directly instead of scraping HTML.

Zero dependencies: it speaks JSON-RPC 2.0 over the MCP stdio transport,
implemented by hand. It reads the same files the site reads (`public/llms.txt`,
`content/now.md`, `content/next.md`, `data/spend.json`), so it never drifts from
what's published.

## Tools

| tool | returns |
|------|---------|
| `get_profile` | the canonical machine-readable summary (`llms.txt`) |
| `get_projects` | featured repos + a best-effort live GitHub repo list |
| `get_now` | this week's shipping log |
| `get_roadmap` | the public roadmap |
| `get_spend` | the agent inference ledger |
| `get_fit` | compose a critical hiring briefing for a pasted `job_spec` |

## Run

```bash
node mcp/server.mjs
```

It communicates over stdio. Wire it into any MCP client. For Claude Desktop,
add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "elliot-os": {
      "command": "node",
      "args": ["/absolute/path/to/elliot-os/mcp/server.mjs"]
    }
  }
}
```

## Smoke test

```bash
printf '%s\n' \
  '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{}}}' \
  '{"jsonrpc":"2.0","id":2,"method":"tools/list"}' \
  '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"get_fit","arguments":{"job_spec":"Senior PM, AI"}}}' \
  | node mcp/server.mjs
```
