---
title: "LM Studio Tool Bundle"
date: 2025-10-01
categories: projects
cover: "/assets/2025-10-01-resources/teaser.png"
status: archived
excerpt: "A collection of MCP tools built for local LLM workflows."
---

# Targeted for Local LLM Use: MCP Tools Collection

<div class="alert alert-red" role="alert">
  <div class="alert-icon" aria-hidden="true">
    ⚠
  </div>
  <div class="alert-content">
    <div class="alert-title">Warning</div>
    <div class="alert-text">
      This project is archived permanently.
    </div>
  </div>
</div>

<link rel="stylesheet" href="/projects/warning-banner.css">

> A collection of Model Context Protocol (MCP) tools, build for local LLMs. One venv, many options.

## Why it exists
The MCP server ecosystem is scattered. There is no simple tool pack, so we need to set it up per tool.
This tool pack is targeted for convenient local use. I will expand the collection over time.
Make local LLMs more powerful yet simpler.

## Features
- MCP json Configuration file generation: Run `main.py` and go through the wizard to complete the generation
- One venv for multiple MCP servers

## Repo Location
[**lmstudio-toolpack**](https://github.com/ZihaoFU245/lmstudio-toolpack)<br>
**Your support could make a huge difference.**

## MCP Servers
- [Web Search](/MCPs/WebSearch.py): Use duckduckgo as search engine, fetch and summarize top results
- [Python SandBox](/MCPs/python-sandbox.py): Allow Agents to run python, use numpy and sympy, good for math
- [Longterm-Memory](/MCPs/Memory.py): For Agents to memories things for longterm use.

## Notes
It is default using **stdio**
You can set it to http in `GlobalConfig`

## Requirements
- Python >= 3.13
- Managed with `uv`

## Install
Using uv:
```bash
uv sync
```

## Run the MCP Server
```powershell
python python-sandbox.py
```
The server communicates over stdio (FastMCP). Point your MCP-compatible client at the executable command above.

## Tool Usage Examples
Run `main.py` for json configuration auto generation.
And you will get something like this:
```json
{
  "mcpServers": {
    "memory": {
      "command": "E:\\LMStudio\\mcp\\lmstudio-toolpack\\.venv\\Scripts\\python.exe",
      "args": [
        "E:\\LMStudio\\mcp\\lmstudio-toolpack\\MCPs\\Memory.py"
      ]
    },
    "python-sandbox": {
      "command": "E:\\LMStudio\\mcp\\lmstudio-toolpack\\.venv\\Scripts\\python.exe",
      "args": [
        "E:\\LMStudio\\mcp\\lmstudio-toolpack\\MCPs\\python-sandbox.py"
      ]
    },
    "websearch": {
      "command": "E:\\LMStudio\\mcp\\lmstudio-toolpack\\.venv\\Scripts\\python.exe",
      "args": [
        "E:\\LMStudio\\mcp\\lmstudio-toolpack\\MCPs\\WebSearch.py"
      ]
    }
  }
}
```
Tweak the name, url, command, if you need.

## Another Idea
If you choose http, you can use 1mcp to unify them all
and run it on a remote server.
For example, connect a Raspberry Pi to Tailscale and set it up remotely.
