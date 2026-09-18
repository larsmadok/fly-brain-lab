# Runtime asset hosting

FAFB graph.bin is a derived 64 MB FBL1 asset and is intentionally excluded from Git.

For the current static-site phase it is uploaded as a GitHub Release asset or object-storage object and copied to public/data/fafb-v783 during build. The public manifest remains versioned.

Required integrity metadata:
- dataset FAFB
- release v783
- neurons 139255
- edges 5342446
- synapses 50666648
- format FBL1

Do not expose FAFB mode as READY unless the browser loader validates these values against the binary header.
