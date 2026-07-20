"""Trace format: serialize a full generation session to a single JSON file.

A trace captures everything needed to replay a generation in the UI without
a running backend — prompt, model metadata, per-token frames, op catalog,
and timing.  The schema is versioned from day one (``trace_version: 1``)
so the frontend can validate and migrate if the format ever changes.

Usage (backend):
    recorder = TraceRecorder(meta_frame)
    recorder.add_frame(token_frame)
    recorder.finalize(done_frame)
    trace = recorder.build()
    json_bytes = serialize_trace(trace)
"""

from __future__ import annotations

import json
import time
from typing import Any

TRACE_VERSION = 1


def _now_iso() -> str:
    """UTC ISO-8601 timestamp."""
    return time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())


class TraceRecorder:
    """Accumulates frames from a ``generate_steps`` session into a trace dict."""

    def __init__(self, meta: dict[str, Any]):
        self._meta = meta
        self._frames: list[dict[str, Any]] = []
        self._done: dict[str, Any] | None = None

    def add_frame(self, frame: dict[str, Any]) -> None:
        """Append a token frame (``type: "token"``)."""
        if frame.get("type") == "token":
            self._frames.append(frame)

    def finalize(self, done: dict[str, Any]) -> None:
        """Set the done frame (``type: "done"``)."""
        self._done = done

    @property
    def prompt(self) -> str:
        return str(self._meta.get("prompt", ""))

    @property
    def model(self) -> str:
        return str(self._meta.get("model", ""))

    def build(self) -> dict[str, Any]:
        """Return the complete trace dictionary."""
        return {
            "trace_version": TRACE_VERSION,
            "created_at": _now_iso(),
            "model": self.model,
            "meta": self._meta,
            "frames": self._frames,
            "done": self._done,
        }


def serialize_trace(trace: dict[str, Any]) -> bytes:
    """Encode a trace dict to compact UTF-8 JSON bytes."""
    return json.dumps(trace, ensure_ascii=False, separators=(",", ":")).encode()


def parse_trace(raw: dict[str, Any]) -> dict[str, Any]:
    """Validate and normalize a trace loaded from JSON.

    Raises ``ValueError`` if the version is unsupported.
    """
    version = raw.get("trace_version")
    if version is None:
        raise ValueError("Missing trace_version field")
    if not isinstance(version, int) or version < 1:
        raise ValueError(f"Unsupported trace_version: {version}")

    # Ensure required top-level keys exist.
    for key in ("meta", "frames", "done"):
        if key not in raw:
            raise ValueError(f"Missing required field: {key}")

    return raw


def download_filename(trace: dict[str, Any]) -> str:
    """Suggest a filename for a trace download, e.g. ``tokenprint-abc123.json``."""
    prompt = trace.get("meta", {}).get("prompt_tokens", [])
    slug = "".join(prompt)[:32].replace(" ", "-").lower() or "trace"
    return f"tokenprint-{slug}.json"
