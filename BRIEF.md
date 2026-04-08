# Cypher Keep — Project Brief

## What it is
A browser-local cryptographic content authentication tool. Users can hash, timestamp, encrypt, verify, and permanently archive any file or piece of content. Nothing leaves the browser unencrypted or unhashed. No server, no account required.

## Core ethos
Cypherpunk. Open source. User is sovereign. No lock-in — ever. No liability on the developer — it's a local tool, we touch nothing. Built for the age of deepfakes and AI-generated content.

## License
MIT — free to use, fork, modify, and build on. See LICENSE file.

## Tech stack
- Single HTML file (index.html), hosted on GitHub Pages
- SHA-256 via browser-native Web Crypto API
- OpenTimestamps for Bitcoin timestamping (public calendars, no permission needed)
- Nostr for identity and censorship-resistant metadata posting (Phase 2 — complete)
- NIP-07 browser extension signing (Alby, nos2x)
- NIP-46 remote signer / nsecBunker (pubkey connection complete; event signing in progress)
- age encryption format via Typage (age-encryption v0.2.4, BSD-3-Clause, by Filippo Valsorda) — inlined, fully offline
- Arweave for permanent archival (Phase 3 — planned)

## Design
- Colors: deep blue-black background (~#05070f), purple brand (#7c3aed), Bitcoin orange (#f7931a) as action accent, blue (#3b82f6) atmospheric
- Fonts: Oxanium (display/headings) + JetBrains Mono (body/code)
- Tone: serious, trustworthy, cypherpunk — not a game, not a startup
- Dark theme only

## Build phases
- **Phase 1 (DONE):** File upload, SHA-256 hash, OpenTimestamps Bitcoin timestamp, .ots proof download, metadata JSON, copy summary, verify stamp, verify hash, encrypt/decrypt (age format)
- **Phase 2 (DONE):** Nostr login (extension + bunker modal), post stamp as Kind 1 Nostr event, My Stamps history via relay query, live post preview with controls
- **Phase 2 — In progress:** NIP-46 full event signing for bunker-connected users
- **Phase 3 (Planned):** Arweave archival of content + OTS proof, transaction ID recorded in Nostr event
- **Phase 4 (Planned):** Confirm stamp on Nostr — when .ots upgrades to confirmed block, reply to original stamp note with block number and explorer link

## Encryption: age format
Phase 1 originally shipped with a proprietary .ckenc format (AES-256-GCM + PBKDF2, 600,000 iterations). Replaced in v0.2.1 with the age open standard:
- .ckenc required Cypher Keep to decrypt — created tool dependency
- age is a documented open standard with implementations in Go, Rust, Python, JavaScript, and more
- Files encrypted with CK are decryptable with any age-compatible tool, forever, independent of Cypher Keep
- Backwards compatibility preserved — .ckenc files still decrypt via legacy path
- age library (Typage v0.2.4) inlined directly into index.html — no CDN dependency, fully offline, works with Brave Shields up

## Nostr integration (Phase 2)
- Login modal with two explicit options: Browser Extension (NIP-07) and Nsec Bunker / Remote Signer (NIP-46)
- NIP-07: window.nostr signing, fully working
- NIP-46: bunker:// and nostrconnect:// URI parsing, pubkey retrieval works, event signing via encrypted relay messages in progress
- Kind 1 events with tags: t:cypherkeep, t:timestamp, t:sha256, sha256:<hash>, filename:<name>
- OTS proof embedded as base64 in event content — labeled as pending at time of posting
- Posting to Nostr is always optional — stamp flow unaffected
- Privacy warning shown before publishing — hash becomes public
- Post controls: toggle CK header, toggle message position (top or end), live preview
- Preview integrity note: stamp data is fixed, only the public message field is editable
- Default relays: wss://relay.damus.io, wss://nos.lol, wss://relay.nostr.band, wss://relay.primal.net
- Advanced settings: toggle individual relays, add/remove custom relays, preferences saved to localStorage
- Per-relay publish status shown after posting
- My Stamps: queries relays for Kind 1 events from logged-in pubkey tagged cypherkeep
- Identity hover card: display name, NIP-05, connection method, active relays, npub (click to copy), disconnect
- Verify links in post body: CK verify page + opentimestamps.org

## Verify tab
- **Verify a Stamp** — original file or hash + .ots proof → confirmed pass/fail result
- **Verify a Hash** — drop any file → SHA-256 computed → optional expected hash comparison → instant match/mismatch. Useful for verifying software downloads, document integrity, or any file received from a third party.

## Confirm stamp on Nostr (Phase 4 — planned)
When a user's .ots proof upgrades from pending to Bitcoin-confirmed, they can optionally announce this on Nostr:
- In the Verify tab, after a stamp verifies against a confirmed block, an "Announce confirmation" button appears (if Nostr is connected)
- CK queries relays for the original stamp note by SHA-256 tag
- If found, composes a reply Kind 1: confirmed block number, block explorer link, original note reference
- Manual nevent input as fallback if relay query finds nothing
- Relay querying by SHA-256 tag is more reliable than OTS proof matching (proof changes between pending/confirmed)

## Three core user journeys
1. **The Creator** — stamps original work to prove authorship and date before publishing
2. **The Witness** — stamps received or captured content to preserve evidence, unaltered
3. **The Sender** — encrypts a file with age, shares it; recipient decrypts with CK or any age-compatible tool

## Key product decisions
- Verification is a core feature, not an afterthought — non-technical users must be able to verify easily
- Manual hash input supported alongside file upload (developers, advanced users)
- User is fully responsible for their keys and proof files — stern warning in UI, no key management, no recovery
- No anonymous/guest Nostr posting — Nostr is for Nostr users, everyone else keeps their .ots file
- No lock-in anywhere — age for encryption, OTS for timestamps, Nostr for identity, Arweave for archival — all open standards with independent tooling
- No CDN dependencies for core crypto — age library inlined, SHA-256 via Web Crypto API
- Batch timestamping is a future consideration — OTS already batches natively via Merkle tree

## Monetization (planned)
Core tool stays free and open forever. Revenue from convenience and infrastructure:
- **Arweave fee pass-through** — Lightning payment for archival fees + margin. Free path (own AR wallet) always available.
- **CK Relay premium tier** — free relay with basic retention; paid tier for extended retention
- **API access** — pay-per-stamp or monthly via Lightning for developers and organizations
- Payment rail: Lightning throughout. No accounts, no credit cards, no KYC.

## Attribution
Built by Keith Meola — Bitcoin educator, privacy advocate, open-source supporter
- Website: keithmeola.com
- Nostr: npub1ygzsm5m9ndtgch9n22cwsx2clwvxhk2pqvdfp36t5lmdyjqvz84qkca2m5
- Lightning: keith@getalby.com
- PGP: DB31 D0E3 FDAC A0A8 BF61 950E 53AE 9EF6 09AF EAD7

## Links
- Live URL: https://keithmeola.github.io/cypher-keep/
- GitHub: https://github.com/keithmeola/cypher-keep

## Files
- `index.html` — the entire application
- `BRIEF.md` — this document
- `README.md` — project README for GitHub
- `LICENSE` — MIT License

## Version history
- v0.1.0 — Phase 1 complete: hash, stamp, encrypt, verify
- v0.2.0 — Nostr integration
- v0.2.1 — age encryption replaces .ckenc
- v0.2.2 — age library inlined, Nostr UX, password eye toggle, hover card fix
- v0.2.3 — Nostr login modal, NIP-46 bunker UI, post controls, footer attribution
- v0.2.4 — Verify Hash tab, MIT license, relay.primal.net, custom relay checkbox fix
- v1.0.0 — target: NIP-46 signing complete, Arweave archival, public announcement on Nostr
