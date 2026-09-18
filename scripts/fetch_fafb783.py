#!/usr/bin/env python3
"""Fetch selected FlyWire FAFB v783 Codex exports into data/raw/fafb-783.
Raw data is intentionally gitignored. Verify FlyWire/Codex terms before redistribution.
"""
from pathlib import Path
from urllib.request import urlretrieve
import hashlib, json

BASE = "https://storage.googleapis.com/flywire-data/codex/data/fafb/783"
FILES = [
    "neurons.csv.gz",
    "classification.csv.gz",
    "consolidated_cell_types.csv.gz",
    "connections_princeton.csv.gz",
    "coordinates.csv.gz",
    "labels.csv.gz",
    "visual_neuron_types.csv.gz",
]
OUT = Path("data/raw/fafb-783")
OUT.mkdir(parents=True, exist_ok=True)
manifest = {}
for name in FILES:
    target = OUT / name
    if not target.exists():
        print("downloading", name)
        urlretrieve(f"{BASE}/{name}", target)
    h = hashlib.sha256(target.read_bytes()).hexdigest()
    manifest[name] = {"bytes": target.stat().st_size, "sha256": h}
(OUT / "manifest.local.json").write_text(json.dumps(manifest, indent=2))
print("FAFB v783 files ready in", OUT)
