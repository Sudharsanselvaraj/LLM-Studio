#!/usr/bin/env python3
"""Trace-diff CLI — gate CI on structural trace changes.

Usage:
    python scripts/trace_diff.py baseline.json head.json --tolerance 0.05
    python scripts/trace_diff.py baseline.json head.json --tolerance 0.05 --fail-on-diff
"""

import argparse
import json
import sys


def trace_diff(baseline_path: str, head_path: str, tolerance: float = 0.05):
    """Compare two trace files and yield (type, description) tuples."""
    with open(baseline_path) as f:
        base = json.load(f)
    with open(head_path) as f:
        head = json.load(f)

    frames_b = base.get("frames", [])
    frames_h = head.get("frames", [])

    if len(frames_b) != len(frames_h):
        yield "count", f"Frame count: baseline={len(frames_b)} head={len(frames_h)}"

    for i, (fb, fh) in enumerate(zip(frames_b, frames_h)):
        if fb.get("chosen", {}).get("id") != fh.get("chosen", {}).get("id"):
            yield "token", (
                f"Token {i}: baseline={fb.get('chosen')} head={fh.get('chosen')}"
            )

        if fb.get("eos") != fh.get("eos"):
            yield "eos", f"Token {i}: baseline.eos={fb.get('eos')} head.eos={fh.get('eos')}"

        tk_b = {c["id"]: c["prob"] for c in fb.get("topk", [])}
        tk_h = {c["id"]: c["prob"] for c in fh.get("topk", [])}
        all_ids = set(tk_b) | set(tk_h)
        for tid in sorted(all_ids):
            pb = tk_b.get(tid, 0)
            ph = tk_h.get(tid, 0)
            if abs(pb - ph) > tolerance:
                yield "prob", f"Token {i}, id {tid}: baseline={pb:.4f} head={ph:.4f}"

        ls_b = fb.get("layer_stats", [])
        ls_h = fh.get("layer_stats", [])
        if ls_b and ls_h:
            for li, (lb, lh) in enumerate(zip(ls_b, ls_h)):
                if abs(lb - lh) > tolerance:
                    yield "layer_stat", (
                        f"Layer {li} @ token {i}: baseline={lb:.4f} head={lh:.4f}"
                    )


def main():
    parser = argparse.ArgumentParser(description="Trace-diff CI gate")
    parser.add_argument("baseline", help="Baseline trace JSON")
    parser.add_argument("head", help="Head (candidate) trace JSON")
    parser.add_argument("--tolerance", type=float, default=0.05, help="Tolerance per diff")
    parser.add_argument("--fail-on-diff", action="store_true", help="Exit non-zero on diff")
    args = parser.parse_args()

    diffs = list(trace_diff(args.baseline, args.head, args.tolerance))
    if not diffs:
        print("✓ Traces are identical within tolerance.")
        sys.exit(0)

    print(f"Found {len(diffs)} diff(s):")
    for kind, msg in diffs:
        print(f"  [{kind}] {msg}")

    if args.fail_on_diff:
        sys.exit(1)


if __name__ == "__main__":
    main()
