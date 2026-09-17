# Fly Brain Lab — experiment roadmap

## Scientific rule
Rooms expose observations and accept actions. They never encode the correct action into the brain input. Every run records dataset, model parameters, room version, seed, observations, spikes/readouts, actions and score.

## Brain sets
1. Synthetic-96 — deterministic control network.
2. FAFB v783 — primary real adult female brain connectome.
3. BANC v888 — female brain + nerve cord; preferred future embodied-control dataset.
4. MCNS v0.9 — male CNS; later cross-dataset comparison.

Raw third-party datasets are not committed to Git. Importers create reproducible local/cache artifacts and preserve source/version/checksum metadata.

## Experiment rooms
### R01 Station Control
Closed-loop regulation: temperature, energy, water and failures. Baseline engineering task.

### R02 2D Navigation
Agent receives directional sensory fields, must locate food/water and avoid hazards. No target coordinates are sent to the brain.

### R03 Reflex Bench
Controlled stimuli (sugar, bitter, looming, touch, heat, humidity, light). Measures downstream motor/descending activity. This is the calibration room before games.

### R04 Learning Arena
Repeated trials with reward/punishment signals. Compare fixed-connectome behavior against explicitly enabled plasticity layers. Plasticity must be reported separately; the anatomical FlyWire weights are not silently trained.

### R05 3D Arena
Three.js/WebGL body in a 3D world. Sensors are rendered from the agent's pose and converted to biologically meaningful channels; descending/motor readouts control movement. Physics and brain simulation are separate modules.

### R06 Game One — Fly Pong
First learnable game. The fly controls a paddle using left/right motor readouts. Visual input encodes ball/paddle motion. Reward on return, negative outcome on miss. Start with synthetic brain, then FAFB visual/descending circuits, then optional plasticity.

## 3D principles
- World coordinates never enter the brain directly.
- Vision is egocentric, not an omniscient game-state vector.
- Same brain adapter must run in multiple rooms.
- Replay is deterministic where possible.
- Every experiment has a control condition.
- Separate claims: connectome-driven response, hand-written adapter, and learned/plastic component.
