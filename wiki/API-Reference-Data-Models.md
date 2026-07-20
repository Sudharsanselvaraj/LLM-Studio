# Data Models

## Overview

To ensure the Frontend and Backend agree on the shape of data, TokenPrint defines explicit Pydantic schemas in `backend/app/schemas.py`. These map directly to TypeScript interfaces in the frontend.

## Core Schemas

### `ArchitectureResponse`
Used by `GET /architecture`.
```json
{
  "source": "model",
  "model": "Qwen/Qwen2.5-0.5B-Instruct",
  "device": "mps",
  "metadata": {
    "architecture": "qwen2",
    "total_params": 494032768,
    "num_layers": 24,
    "hidden_size": 896,
    "num_heads": 14,
    "num_kv_heads": 2,
    "head_dim": 64,
    "ffn_size": 4864,
    "vocab_size": 151936
  },
  "tensor_count": 290,
  "tensors": [
    {
      "name": "model.embed_tokens.weight",
      "shape": [151936, 896],
      "dtype": "float32",
      "n_params": 136134656
    }
  ]
}
```

### `AnalyzeResponse`
Used by `POST /analyze`.
```json
{
  "sentence": "Hello",
  "tokens": [
    { "index": 0, "text": "Hello", "id": 15496 }
  ],
  "attention": [
    // 4D Array: [layer][head][from_seq][to_seq]
  ],
  "hidden_states_3d": {
    "0": [[0.5, -0.2, 0.8]], // PCA projected coords per layer
    "1": [[0.4, -0.1, 0.7]]
  },
  "logit_lens": {
    "0": [
      { "id": 45, "text": "The", "prob": 0.05, "logit": 12.4 }
    ]
  }
}
```

## TypeScript Counterparts

In the frontend, these schemas are mapped to strict interfaces (e.g., `ArchitectureData`, `TensorInfo`). Avoid using `any` when parsing these responses.

## Related pages
- [Tensor Format](API-Reference-Tensor-Format)
- [REST API](API-Reference-REST-API)

## Further reading
- [Backend Code: schemas.py](https://github.com/Sudharsanselvaraj/Token-Print/blob/main/backend/app/schemas.py)

## Navigation
| Previous | Home | Next |
| --- | --- | --- |
| [WebSocket Events](API-Reference-WebSocket-Events) | [Home](Home) | [Tensor Format](API-Reference-Tensor-Format) |
