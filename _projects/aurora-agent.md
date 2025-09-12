---
title: "New Agent Application Aurora"
date: 2025-08-26
categories: projects
---

Aurora is a modular, multi-node agent platform for building and running extensible AI assistants. It orchestrates language models and tool integrations to enable conversational, tool-enabled agents.

Key points:

- **Multi-node LangGraph architecture** (router, planner, executor, critic)
- **Built-in tools** for web search/browsing, crawling, time, file operations, and Gmail (OAuth)
- **CLI and Web UI** (FastAPI + Jinja / uvicorn)
- **Trace logging and persistence** (structured JSON-lines traces, conversation history saved under `Web/chats/`)
- **Configurable via `.env`** and compatible with OpenRouter/model gateways

[***Repo Link***](https://github.com/ZihaoFU245/Aurora)

## Status
Aurora is the successor to the earlier "Friday" project and is currently active and being developed. The new codebase focuses on a cleaner structure and a multi-node design that separates routing, planning, execution, and critique.

**Why this migration?**
- The previous project's structure was messy; after learning more about software engineering, I wanted a cleaner, more maintainable architecture.
- I shifted focus from building only tools to designing orchestration and agent flows, restoring alignment with the original goal.

## Motivation
**June 2025**: after finishing the Spring term, AI applications were rapidly advancing. I expected new model capabilities and agent integrations and wanted to explore practical agent architectures. Watching classic films like **Iron Man** reminded me of practical, tool-enabled assistants — that inspired deeper work in AI engineering and led to Aurora.

