# Cypher Keep — Project Brief

## What it is
A browser-local cryptographic content authentication tool. Users can hash, timestamp, encrypt, verify, and permanently archive any file or piece of content. Nothing leaves the browser unencrypted or unhashed. No server, no account required.

## Core ethos
Cypherpunk. Open source. User is sovereign. No liability on the developer — it's a local tool, we touch nothing. Built for the age of deepfakes and AI-generated content.

## Tech stack
- Single HTML file (index.html), hosted on GitHub Pages
- SHA-256 via browser-native Web Crypto API
- OpenTimestamps for Bitcoin timestamping (public calendars, no permission needed)
- Nostr for identity and censorship-resistant metadata posting (Phase 2)
- AES-256-GCM + PBKDF2 (600,000 iterations) for password encryption — all browser-native
- NIP-44 for Nostr key-based encryption (Phase 3)
- Arweave for permanent archival (Phase 4)

## Design
- Colors: deep blue-black background (~#05070f), purple brand (#7c3aed), Bitcoin orange (#f7931a) as action accent, blue (#3b82f6) atmospheric
- Fonts: Oxanium (display/headings) + JetBrains Mono (body/code)
- Tone: serious, trustworthy, cypherpunk — not a game, not a startup
- Dark theme only

## Build phases
- **Phase 1 (DONE):** File upload, SHA-256 hash, OpenTimestamps Bitcoin timestamp, .ots proof download, metadata JSON download, copy summary, verify proof, encrypt/decrypt file with password (AES-256-GCM)
- **Phase 2:** Nostr login via browser extension (Alby/nos2x), post metadata as Nostr event, stamp history via relay query
- **Phase 3:** Arweave archival of encrypted content + OTS proof, CID recorded in Nostr event

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
- Cypher Keep relay: domain-restricted, only accepts Cypher Keep attestation event kinds — zero content moderation burden
- Organizations/institutional use is a future phase, not MVP scope
- License: undecided between MIT and AGPL — decide before first public release

## Monetization (future)
- Hosted convenience tier handling Arweave fees (fiat payment, AR token pass-through)
- API for developers and enterprise
- White-label/consulting for organizations
- Cypher Keep Nostr relay with premium retention tier

## Links
- Live URL: https://keithmeola.github.io/cypher-keep/
- GitHub: https://github.com/keithmeola/cypher-keep

## Files
- `index.html` — the entire application (single file)
- `BRIEF.md` — this document
- `README.md` — project README for GitHub

## Build phases (updated)
- Phase 1: Complete ✓
- Phase 2: Nostr integration
- Phase 3: Arweave archival
Nostr integration:
1. Detect Nostr browser extension (window.nostr — Alby, nos2x, etc.)
2. Login button — calls window.nostr.getPublicKey()
3. Display truncated npub in header when logged in
4. After successful stamp, offer "Post to Nostr" button
5. Construct and sign a Nostr event (kind: 1 or custom kind) containing:
   - file name
   - SHA-256 hash
   - OTS proof (base64 encoded)
   - optional note
   - tags: ["cypherkeep", "timestamp", "sha256"]
6. Publish to default relays (wss://relay.damus.io, wss://nos.lol, wss://relay.nostr.band)
7. "My Stamps" view: query relay for all events from logged-in pubkey with cypherkeep tag
