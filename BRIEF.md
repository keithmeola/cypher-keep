# Cypher Keep — Project Brief

## What it is
A browser-local cryptographic tool for timestamping, verification, and encryption. Designed for the average person — not just developers. Nothing leaves the browser unencrypted or unhashed. No server, no account required. Free, open source, MIT licensed.

## Core ethos
Cypherpunk. Open source. User is sovereign. No liability on the developer — it's a local tool, we touch nothing. Built for the age of deepfakes, AI-generated content, and institutional distrust. The underlying principle: don't trust — verify.

## Mission
Make cryptographic tools accessible to everyone. Timestamping, authentication, and encryption have historically required technical expertise most people don't have. Cypher Keep changes that.

## Tech stack
- Single HTML file (index.html), hosted on GitHub Pages
- SHA-256 via browser-native Web Crypto API
- OpenTimestamps for Bitcoin timestamping (public calendars, no permission needed)
- age encryption format (ChaCha20-Poly1305 + scrypt) for password encryption — all browser-native, compatible with any age tool
- Nostr via NIP-07 browser extension — NIP-44 encryption, kind:1 event posting
- noble-secp256k1 v1.7.0 inlined for NIP-46 and Schnorr signing
- age encryption inlined for future npub-based encryption
- NIP-46 implementation complete (code in place, UI deferred post-launch)

## Design
- Colors: deep blue-black background (~#05070f), purple brand (#7c3aed), Bitcoin orange (#f7931a) as action accent, blue (#3b82f6) atmospheric
- Fonts: Inter (body) + JetBrains Mono (code/mono)
- Tone: serious, trustworthy, cypherpunk — not a game, not a startup
- Dark theme only

## Roadmap

### Phase 1 — Core ✅ Complete
File upload, SHA-256 hash, OpenTimestamps Bitcoin timestamp, .ots proof download, metadata JSON download, copy summary, verify proof, encrypt/decrypt file with password (age format), How To page, self-integrity hash in footer.

### Phase 2 — Nostr ✅ Complete
Nostr login via NIP-07 browser extension (Alby, nos2x), post stamps as signed Nostr events (kind:1), stamp history via My Stamps (relay query), Bitcoin confirmation announcements.

### Phase 3 — Signing 🔨 Next
NIP-46 remote signer support — Nsec Bunker, Amber, any NIP-46 compatible signer. Code complete, UI deferred for post-launch testing. Mobile-optimized layout.

### Phase 4 — npub Encryption 📋 Planned
Encrypt any file directly to a Nostr public key using the age encryption format. No shared password — only the recipient's nsec can decrypt it. PGP-style encryption using the Nostr identity layer. Building blocks already in the codebase.

### Phase 5 — Infrastructure 📋 Planned
Dedicated Cypher Keep Nostr relay — domain-restricted, only accepts CK attestation event kinds, zero content moderation burden. Premium retention tier.

### Phase 6 — Permanence 📋 Planned
Permanent archival of content and proofs via Arweave permaweb. Hosted convenience tier. CID recorded in Nostr event.

### Phase 7 — Scale (Internal, not public)
API for developers and organizations. White-label and enterprise consulting.

## Three core user journeys
1. **The Creator** — stamps original work to prove authorship and date
2. **The Witness** — stamps received/captured content to preserve evidence
3. **The Sender** — encrypts a file, sends it, recipient decrypts via the same tool

## Key product decisions
- Verification is a core feature, not an afterthought — non-technical users must be able to verify easily
- Manual hash input supported alongside file upload (for developers/advanced users)
- User is fully responsible for their keys and proof files — stern warning in UI, no key management
- File name is included in Nostr metadata (minor privacy note in UI is sufficient)
- No anonymous/guest Nostr posting — Nostr is for Nostr users, everyone else keeps their .ots file
- Batch timestamping is a future consideration (OTS already batches natively via Merkle tree)
- Organizations/institutional use is a future phase, not MVP scope
- License: MIT — full cypherpunk, V4V model, service monetization via hosted tiers

## Monetization
Open core model. The tool itself is free and MIT licensed — anyone can fork and run it. Revenue comes from hosted services that are non-trivial to self-host:
- Dedicated Cypher Keep Nostr relay (premium retention tier)
- Arweave archival convenience (hosted fiat → AR passthrough)
- API access for developers and enterprise (Phase 6)
- White-label/consulting for organizations (Phase 6)

MIT does not prevent service monetization. The code is free; the infrastructure is not.

## Links
- Live URL: https://cypherkeep.net
- GitHub: https://github.com/keithmeola/cypher-keep

## Files
- `index.html` — the entire application (single file)
- `BRIEF.md` — this document
- `README.md` — project README for GitHub
- `LICENSE` — MIT license
