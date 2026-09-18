# FAFB v783

Canonical real-fly dataset target for Fly Brain Lab.

- Release: FlyWire FAFB v783
- Neurons: 139,255
- Connectivity: full adult female brain
- Runtime model target: leaky integrate-and-fire, connectivity + neurotransmitter identity
- Raw connectivity is not committed to Git. It is converted into compact versioned runtime assets.

Primary scientific references:
- Dorkenwald et al., Nature 2024, Neuronal wiring diagram of an adult brain.
- Schlegel et al., Nature 2024, Whole-brain annotation and multi-connectome cell typing of Drosophila.
- Shiu et al., Nature 2024, A Drosophila computational brain model reveals sensorimotor processing.

Data sources: FlyWire/Codex and the v783 connectivity artefacts linked by the publications.

## Integrity rule

The fixed mode never mutates canonical connectome weights. Plastic experiments store learned deltas separately from the anatomical graph.
