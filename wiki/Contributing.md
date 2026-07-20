# Contributing

## Overview

We welcome contributions! TokenPrint is an ambitious project that requires expertise in React, WebGL, Python, and Deep Learning. 

## How to get started

1. **Read the Docs:** Familiarize yourself with the [Architecture](Architecture) and [Code Style](Developer-Guide-Code-Style).
2. **Check the Ideas List:** Look at `docs/contributing-ideas.md` in the repository. It contains a curated list of tasks sorted by difficulty, complete with file pointers and verification steps.
3. **Pick an Issue:** Comment on an open issue on GitHub so others know you are working on it.

## Core Rules for PRs

- **No Fabricated Data:** You cannot use `Math.random()` or hardcode synthetic tensors to make a UI look nice. Your feature must read from the backend or the GGUF file.
- **Pass the CI:** Your code must pass `black` formatting for Python, Prettier/TypeScript checks for the frontend, and the `trace_diff.py` regression tests.
- **Update Documentation:** If you add a new API endpoint or a new geometric shape, you must update the relevant Markdown files in this Wiki and the `docs/` folder.

## Reporting Bugs

- **Wrong Numbers:** If you spot a number in the UI that contradicts the real model (e.g., the formula says LayerNorm but the model is Llama), this is a top-priority bug. Open an issue immediately.
- **Security:** If you find a security vulnerability (e.g., path traversal in the GGUF parser), do not open a public issue. See `SECURITY.md` for private reporting instructions.

## Code of Conduct

Please adhere to the `CODE_OF_CONDUCT.md` found in the root of the repository. Be respectful, constructive, and scientifically rigorous.

## Navigation
| Previous | Home | Next |
| --- | --- | --- |
| [FAQ](FAQ) | [Home](Home) | None |
