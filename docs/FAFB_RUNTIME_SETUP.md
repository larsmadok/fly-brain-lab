# FAFB v783 runtime setup

The UI pipeline is implemented as Synthetic 96 → FAFB Fixed → FAFB Plastic.

## Required source data

Download FlyWire/Codex FAFB release 783 and place the files in a local directory. Minimum:
- neurons.csv.gz
- connections_princeton.csv.gz

The official Shiu reference repository also provides Connectivity_783.parquet and Completeness_783.csv and documents v783 support.

## Build compact graph

Windows PowerShell:

```powershell
python tools/build_fafb_runtime.py --input "$HOME\FlyWire-FAFB-v783"
```

Expected canonical counts are validated after build before a graph is accepted by the runtime.

## Scientific separation

FAFB Fixed uses the anatomical graph without learned weight changes.
FAFB Plastic keeps anatomical weights immutable and stores learned deltas separately.
Synthetic 96 remains the control.

Do not label a run as FAFB until the manifest and graph have been built from the real dataset and validated.
