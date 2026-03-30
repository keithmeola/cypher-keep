# Cypher Keep — Project Brief

## What it is
A browser-local cryptographic content authentication tool. Users can hash, timestamp, encrypt, verify, and permanently archive any file or piece of content. Nothing leaves the browser unencrypted or unhashed. No server, no account required.

## Core ethos
Cypherpunk. Open source. User is sovereign. No liability on the developer — it's a local tool, we touch nothing. Built for the age of deepfakes and AI-generated content. No lock-in — ever.

## Tech stack
- Single HTML file (index.html), hosted on GitHub Pages
- SHA-256 via browser-native Web Crypto API
- OpenTimestamps for Bitcoin timestamping (public calendars, no permission needed)
- Nostr for identity and censorship-resistant metadata posting (Phase 2 — complete)
- age encryption format via Typage (age-encryption v0.2.4, BSD-3-Clause, by Filippo Valsorda) — passphrase mode, scrypt + ChaCha20-Poly1305
- Arweave for permanent archival (Phase 3)
- WebLN / Lightning for payments (Phase 4)

## Design
- Colors: deep blue-black background (~#0f1117), purple brand (#7c3aed), Bitcoin orange (#f7931a) as action accent, blue (#3b82f6) atmospheric
- Fonts: Inter (UI) + JetBrains Mono (hashes, code)
- Tone: serious, trustworthy, cypherpunk — not a game, not a startup
- Dark theme only

## Build phases
- **Phase 1 (DONE):** File upload, SHA-256 hash, OpenTimestamps Bitcoin timestamp, .ots proof download, metadata JSON download, copy summary, verify proof, encrypt/decrypt file with password (age format)
- **Phase 2 (DONE):** Nostr login via browser extension (NIP-07), post stamp as Kind 1 Nostr event, My Stamps history via relay query
- **Phase 3:** Arweave archival of content + OTS proof, transaction ID recorded in Nostr event
- **Phase 4:** Lightning-native monetization — Arweave fee pass-through, relay premium tier

## Encryption: age format (decision log)
Phase 1 originally shipped with a proprietary `.ckenc` format (AES-256-GCM + PBKDF2, 600,000 iterations). This was replaced in v0.2.1 with the age open standard for the following reasons:

- `.ckenc` required Cypher Keep to decrypt — created tool dependency and user lock-in
- age is a documented open standard with implementations in Go, Rust, Python, JavaScript, Swift, and more
- Files encrypted with CK are now decryptable with any age-compatible tool, forever, independent of this project
- Encryption strength is equivalent — age uses scrypt + ChaCha20-Poly1305
- Backwards compatibility preserved — `.ckenc` files still decrypt via legacy path in the Decrypt tab

Filename handling: output is `originalname.ext.age`. The filename is visible in plaintext. Users who need filename privacy are advised to rename before encrypting. This is disclosed in the UI.

## Nostr integration (Phase 2 decisions)
- NIP-07 browser extension signing (window.nostr) — Alby, nos2x compatible
- Kind 1 events with tags: `t:cypherkeep`, `t:timestamp`, `t:sha256`, `sha256:<hash>`, `filename:<name>`
- OTS proof embedded as base64 in event content — labeled as pending at time of posting
- Posting to Nostr is always optional — Phase 1 flow unaffected if user skips
- Privacy note shown before publishing — hash becomes public, anyone with the original file can confirm the stamp
- Default relays: wss://relay.damus.io, wss://nos.lol, wss://relay.nostr.band
- My Stamps: queries relays for Kind 1 events from logged-in pubkey tagged `cypherkeep`, deduplicates by sha256 tag, links to njump

## Three core user journeys
1. **The Creator** — stamps original work to prove authorship and date
2. **The Witness** — stamps received/captured content to preserve evidence
3. **The Sender** — encrypts a file with age, sends it, recipient decrypts with CK or any age tool

## Key product decisions
- Verification is a core feature, not an afterthought — non-technical users must be able to verify easily
- Manual hash input supported alongside file upload (for developers/advanced users)
- User is fully responsible for their keys and proof files — stern warning in UI, no key management
- File name is included in Nostr metadata (minor privacy note in UI)
- No anonymous/guest Nostr posting — Nostr is for Nostr users, everyone else keeps their .ots file
- No lock-in anywhere — age for encryption, OTS for timestamps, Nostr for identity, Arweave for archival — all open standards
- Batch timestamping is a future consideration (OTS already batches natively via Merkle tree)
- Organizations/institutional use is a future phase, not current scope

## Monetization (planned)
Core tool stays free and open forever. Revenue from convenience and infrastructure:

- **Arweave fee pass-through** (Phase 3) — accept Lightning payment for Arweave archival fees + small margin. User pays in sats, CK handles AR token complexity. Free path (bring your own AR wallet) always available.
- **CK Relay premium tier** — free relay with basic retention; paid tier (Lightning) for extended/indefinite retention and higher rate limits
- **Verified stamp certificate** (future) — human-readable PDF countersigned by CK-operated key, for legal/professional use. Generated locally free; countersigned version paid via Lightning.
- **API access** (future) — pay-per-stamp or monthly subscription via Lightning for developers and small organizations
- **CK Pro hosted tier** (future) — batch stamping, team accounts, stamp history dashboard, email confirmations. Free tool always complete and unaffected.

Payment rail: WebLN / Lightning throughout. No accounts, no credit cards, no KYC. Alby users (already connected for Nostr) have Lightning available in the same extension.

## Competitive positioning
- Simple Proof: enterprise B2B, government contracts, requires account, server touches data flow. Not the same audience.
- CK: individual sovereignty, zero trust, no account, open source, cypherpunk community. Structurally cannot be replicated by a corporate product.
- Differentiation moat: culture + community + open standards stack (Bitcoin + Nostr + Arweave + age + Lightning) — not just features.

## Links
- Live URL: https://keithmeola.github.io/cypher-keep/
- GitHub: https://github.com/keithmeola/cypher-keep

## Files
- `index.html` — the entire application (single file)
- `BRIEF.md` — this document
- `README.md` — project README for GitHub

## Versioning
- v0.1.0 — Phase 1 complete
- v0.2.0 — Nostr integration
- v0.2.1 — age encryption replaces .ckenc
- v1.0.0 — target: Phase 3 complete, fully stable, public announcement
