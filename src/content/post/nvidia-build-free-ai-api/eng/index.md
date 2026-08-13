---
title: "NVIDIA Build: A Complete Guide to Free API Access for 100+ AI Models"
description: "Get a free NVIDIA API key and connect it to Cursor, Cline, Open Code, Open WebUI, and VS Code extensions — a step-by-step setup guide plus the real credit and rate limits."
post_id: "nvidia-build-free-ai-api"
publishDate: "13 Aug 2026"
tags: ["NVIDIA", "AI", "API", "Coding Tools"]
eng: true
---

# Stop Paying for AI: How to Plug 100+ Free Models Into Cursor, Cline, Roo Code & Open WebUI

![alt text](img.png)


🚨 If you've been staring at your Cursor bill or rationing your Claude API calls, there's a service quietly sitting under a lot of developers' radar: **NVIDIA Build**. It hands out a real API key, backed by more than a hundred hosted models, on NVIDIA's own GPU cloud — no credit card required. This guide walks through exactly what it is, how to get set up, and how to wire it into the coding tools you already use.

## What Exactly Is NVIDIA Build?

NVIDIA Build (at [build.nvidia.com](https://build.nvidia.com)) is the public front door to **NIM** — NVIDIA Inference Microservices. NIM started life as an enterprise product: prepackaged containers that run large language models efficiently on NVIDIA GPUs using TensorRT-LLM optimization, sold for on-premise deployment. At some point NVIDIA opened a hosted version of that same catalog to anyone with a free developer account, running on their own DGX Cloud infrastructure.

The catalog now covers 100+ models, and it's not just NVIDIA's own work — it's a genuinely broad snapshot of the open-weight world:

- **DeepSeek** (V3.1/V4-class models, strong at reasoning and code)
- **Meta Llama** (8B through 405B, plus vision variants)
- **Qwen / QwQ** (Alibaba's coding and math specialists)
- **GLM** (Zhipu AI's agentic and multilingual coding models)
- **Kimi K2** (Moonshot AI, huge context windows for document work)
- **MiniMax**, **Mistral / Mixtral**, **GPT-OSS**, and NVIDIA's own **Nemotron** line
- Specialized models for vision, embeddings/retrieval, and speech

The part that actually matters for day-to-day use: every model sits behind the **exact same request format OpenAI uses**. That means anything that already knows how to talk to `api.openai.com` can talk to NVIDIA instead — you just swap two values.

## Why Bother?

- **No credit card, ever, for the free tier.** Just an email address.
- **One integration, dozens of models.** You're not learning a new SDK — it's the OpenAI wire format.
- **Free credits from the moment you sign up.** You can start firing requests within minutes.
- **Works with tools you already have installed** — Cursor, Cline, Roo Code, Open WebUI, Continue, and basically any client with an "OpenAI Compatible" provider option.

##  Step One: Create Your Account

1. Go to **[build.nvidia.com](https://build.nvidia.com)**.
2. Click **Create an Account** and sign up for the (free) **NVIDIA Developer Program** — a valid email and accepting the terms is all it takes. No ID check, no payment method.
3. Verify your email. You're in.

##  Step Two: Generate Your API Key

1. Once logged in, head to **build.nvidia.com/settings/api-keys**.
2. Click **Generate Key**.
3. Copy it immediately — it starts with `nvapi-` and NVIDIA only shows it to you **once**. Drop it in a password manager or an environment variable (`NVIDIA_API_KEY`) right away.

That's it — the key is live immediately and already has credits attached.

##  Step Three: Point Your Tools at It

Every single integration below relies on the same two facts:

```
Base URL:  https://integrate.api.nvidia.com/v1
API Key:   nvapi-xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

Model IDs follow a `provider/model-name` pattern, visible on each model's page in the catalog — for example `deepseek-ai/deepseek-v3.1`, `meta/llama-3.1-70b-instruct`, or `qwen/qwen3-coder-480b-a35b-instruct`.

### Quick test with curl or Python

Before wiring anything into an IDE, it's worth confirming the key works:

```python
from openai import OpenAI

client = OpenAI(
    base_url="https://integrate.api.nvidia.com/v1",
    api_key="nvapi-xxxxxxxxxxxxxxxxxxxxxxxxxxxx",
)

response = client.chat.completions.create(
    model="meta/llama-3.1-70b-instruct",
    messages=[{"role": "user", "content": "Say hello in five words."}],
)

print(response.choices[0].message.content)
```

If you get a reply back, the key is good and you're ready to connect it to a real tool.

### Setup by tool

| Tool | Where to configure | What to enter |
|---|---|---|
| **Cursor** | Settings → Models → Custom → "OpenAI Compatible" | Name it (e.g. "NVIDIA NIM"), paste the base URL, paste your key, then manually add model IDs you want in the list |
| **Cline** (VS Code extension) | Settings (⚙️) → API Provider → **OpenAI Compatible** | Base URL, API Key, and the exact model ID from the catalog |
| **Roo Code** (VS Code extension) | Settings panel → API Provider → **OpenAI Compatible** | Same three fields: Base URL, API Key, Model |
| **Open WebUI** | Admin Settings → Connections → **Add Connection** (OpenAI) | Base URL and API Key — Open WebUI will auto-detect the available models from `/v1/models` |
| **Continue** (VS Code extension) | Edit `~/.continue/config.yaml` | Add a model block with `provider: openai`, `apiBase`, `apiKey`, and `model` (see below) |

**Continue.dev config.yaml example:**

```yaml
models:
  - name: NVIDIA NIM - Llama 70B
    provider: openai
    model: meta/llama-3.1-70b-instruct
    apiBase: https://integrate.api.nvidia.com/v1
    apiKey: nvapi-xxxxxxxxxxxxxxxxxxxxxxxxxxxx
    roles:
      - chat
      - edit
```

The pattern repeats across almost any AI coding tool: look for **"OpenAI Compatible,"** **"Custom Provider,"** or a raw **`base_url` / `apiBase`** field, and you can drop NVIDIA's endpoint straight in.

## Understanding the Free Tier (So You Don't Get Surprised)

This is the part people gloss over, so here's the honest version:

- **Starting credits:** New accounts get roughly **1,000 free credits** the moment they sign up. Each request consumes a small, model-dependent amount of credit — lightweight models cost less per call, large flagship models cost more.
- **Getting more:** Through NVIDIA's developer forum or a request form, it's possible to push that up toward **5,000 total credits**.
- **Rate limit, not token limit:** Independent of credits, there's a cap of roughly **40 requests per minute per model**, applied at the account level — not a token-per-day ceiling. Send too many requests too fast and you'll get an HTTP 429 with a retry hint.
- **When credits run out:** Flagship/paid-tier models return an HTTP 402 once your balance is spent. Several smaller models remain usable afterward under a separate baseline quota.
- **This is a prototyping tier, not a production backend.** NVIDIA is explicit that the free hosted endpoints are meant for development, testing, and evaluation — not for serving real end-user traffic at scale. For that, NVIDIA points people toward on-prem NIM containers or paid DGX Cloud capacity.

One more honest note: these exact numbers have shifted before and could shift again — NVIDIA doesn't publish a single canonical figure for every model. If something looks off, check the numbers on your own **build.nvidia.com** account dashboard, since that's always the source of truth.

## What This Setup Is Actually Good For

- **Benchmarking models before committing to one** — swap the model string, run the same prompt set across five or six models, and compare quality and latency for free.
- **Prototyping agents and tool-calling flows** — Llama 3.1, Nemotron, and GLM all support OpenAI-style function calling.
- **Long-document work** — some catalog models offer very large context windows, handling long files without chunking.
- **Learning and coursework** — a fast way to get hands-on with frontier-class open models without owning a GPU cluster.

## A Few Things to Keep in Mind

- **Latency isn't Groq-tier.** DGX Cloud serves primarily from US data centers, so expect noticeably more delay than a purpose-built low-latency provider if you're calling from outside North America.
- **Not every model behaves identically once credits are tight.** A few catalog entries have been reported as flaky or limited on the free tier — if one model underperforms, try a different one from the same family.


## Quick Reference

```
Sign up:     https://build.nvidia.com
Get a key:   https://build.nvidia.com/settings/api-keys
Base URL:    https://integrate.api.nvidia.com/v1
Auth:        Bearer token (your nvapi- key)
Docs:        https://build.nvidia.com/models
```

For five minutes of setup, you end up with one API key that talks to dozens of serious open-weight models, using tooling you probably already have installed. It won't replace a paid production API, but for prototyping, learning, and everyday coding assistance, it's hard to beat the price.