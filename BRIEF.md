# Cypher Keep — Project Brief

## What it is
A browser-local cryptographic content authentication tool. Users can hash, timestamp, encrypt, verify, and permanently archive any file or piece of content. Nothing leaves the browser unencrypted or unhashed. No server, no account required.

## Core ethos
Cypherpunk. Open source. User is sovereign. No lock-in — ever. No liability on the developer — it's a local tool, we touch nothing. Built for the age of deepfakes and AI-generated content.

## License
MIT — free to use, fork, modify, and build on. See LICENSE file.

## Live URLs
- https://cypherkeep.net (primary, domain pending)
- https://keithmeola.github.io/cypher-keep/ (GitHub Pages, always current)
- GitHub: https://github.com/keithmeola/cypher-keep

## Tech stack
- Single HTML file (index.html), hosted on GitHub Pages
- SHA-256 via browser-native Web Crypto API — no libraries
- OpenTimestamps for Bitcoin timestamping (public calendars, no permission needed)
- Nostr for identity and censorship-resistant metadata posting (Phase 2 — complete)
- NIP-07 browser extension signing (Alby, nos2x)
- NIP-46 remote signer / nsecBunker — pubkey connection works, full event signing in progress
- age encryption format via Typage (v0.2.4, BSD-3-Clause, by Filippo Valsorda) — inlined, fully offline, works with Brave Shields
- Arweave for permanent archival (Phase 3 — planned)

## Design
- Colors: deep blue-black background (#0f1117), purple brand (#7c3aed), Bitcoin orange (#f7931a) as action accent, blue (#3b82f6) for info/local badge
- Fonts: Oxanium (display/headings) + JetBrains Mono (body/code)
- Tone: serious, trustworthy, cypherpunk — not a game, not a startup
- Dark theme only

## Build phases
- **Phase 1 (DONE):** File upload, SHA-256 hash, OpenTimestamps Bitcoin timestamp, .ots proof download, metadata JSON, copy summary, verify stamp, verify hash, age encrypt/decrypt
- **Phase 2 (DONE):** Nostr login modal (NIP-07 + NIP-46 UI), post stamp as Kind 1 Nostr event, stamp history via relay query, live post preview with controls, relay management
- **Phase 2.5 (In progress):** NIP-46 full event signing, Bitcoin block confirmation in Verify tab, Nostr reply on confirmation, confirm stamp on Nostr
- **Phase 3 (Planned):** Arweave archival of content + OTS proof, transaction ID in Nostr event

## Encryption: age format
Replaced proprietary .ckenc format in v0.2.1 with the age open standard:
- age is decryptable with any age-compatible tool forever, independent of CK
- Backwards compatibility: .ckenc files still decrypt via legacy path
- Library (Typage v0.2.4) inlined directly into index.html — no CDN, fully offline
- Output: `filename.ext.age` — filename visible in plaintext (disclose in UI, user responsibility)

## Nostr integration (Phase 2)
- Login modal: Browser Extension (NIP-07) or Nsec Bunker (NIP-46)
- NIP-07: window.nostr signing, fully working
- NIP-46: bunker:// and nostrconnect:// URI parsing, pubkey retrieval works, full event signing (secp256k1 ECDH + NIP-04) in progress — needs @noble/secp256k1 or equivalent inlined
- Kind 1 events, tags: t:cypherkeep, t:timestamp, t:sha256, sha256:<hash>, filename:<name>
- OTS proof embedded base64 in event content as pending
- Post controls: toggle CK header (🔑💾), toggle message position (top/bottom), live preview
- Preview integrity note: stamp data fixed, only public message is editable
- Default relays: wss://relay.damus.io, wss://nos.lol, wss://relay.nostr.band, wss://relay.primal.net
- Relay prefs saved to localStorage; per-relay publish status shown after posting
- My Stamps: queries ALL active relays in parallel, deduplicates by sha256 tag, shows per-stamp relay sources
- Identity hover card: display name, NIP-05, connection method, active relays, npub (click to copy), disconnect
- After post: "Copy nevent" and "Download updated metadata JSON" buttons
- Verify links in post: CK verify page + opentimestamps.org

## Verify tab
- **Verify a Stamp** — file/hash + .ots → hash match check → Bitcoin confirmation check via calendar upgrade endpoint → block height + mempool.space link. If confirmed and Nostr connected, "Announce confirmation" button appears. Manual nevent/event ID input for cross-session replies.
- **Verify a Hash** — drop any file → SHA-256 computed → optional expected hash comparison → instant MATCH/MISMATCH. Useful for software downloads, document integrity, etc.

## Bitcoin confirmation flow
1. User drops file + .ots in Verify → Stamp tab
2. CK checks hash match (local, instant)
3. CK parses .ots binary op-tree, executes operations (append/prepend/sha256) to compute intermediate hash submitted to calendar
4. CK calls `{calendar}/timestamp/{intermediateHex}` GET endpoint
5. If confirmed: parses Bitcoin attestation tag (0x0588960d73d71901), extracts block height, shows BITCOIN CONFIRMED with mempool.space link
6. If CORS blocked (file:// origin): shows informative message directing to HTTPS version
7. If pending: shows BITCOIN CONFIRMATION PENDING with OTS fallback link
- Note: Calendar servers block CORS from file:// origins. Works from HTTPS (GitHub Pages / cypherkeep.net). May need javascript-opentimestamps library inlined for full browser compatibility — Phase 2.5 work.

## Confirm stamp on Nostr
After Bitcoin confirmation verified in CK:
- If Nostr connected + prior stamp event in session: "Announce confirmation on Nostr" appears automatically
- If different session: paste nevent1... or hex event ID into manual input field
- CK signs and publishes a Kind 1 reply to original stamp note with block number + mempool.space link

## Post-stamp flow
After stamping, a blue "WHAT HAPPENS NEXT" panel explains:
1. Wait 1-2 hours for block confirmation
2. Return to Verify → Verify a Stamp with file + .ots to check confirmation
3. If Nostr was used: after confirmation, announce reply to original note

## UI decisions
- All confirmation headings in ALL CAPS: HASH MATCH, HASH MISMATCH, PROOF VERIFIED, VERIFICATION FAILED, BITCOIN CONFIRMED, TIMESTAMP SUBMITTED, PUBLISHED TO NOSTR
- Enter key works on all text inputs (manual hash, verify hash, expected hash, bunker input, custom relay)
- Font sizes +2px across the board (base 16px body)
- Local · No server badge: blue, hover reveals tooltip explaining what stays local
- Footer: "⚡ Value-for-Value" (lightning:keith@getalby.com), "Built by Keith Meola" (njump link)
- Footer tags: OTS blue, Bitcoin orange, Nostr purple
- Stamp button: orange (#f7931a), "Stamp with OpenTimestamps"
- Nostr post emoji: 🔑💾

## Metadata JSON
- Version: 0.2.5
- Includes: tool, version, phase, file info, sha256, timestamp, ots_file, calendar (actual URL used), note, nostr_event_id, nostr_relays, arweave_id
- Calendar field uses actual calendar URL (e.g., alice.btc.calendar.opentimestamps.org) not generic string
- Updated after Nostr post with event ID and relay list

## Key product decisions
- No lock-in anywhere — age, OTS, Nostr, Arweave all open standards
- No CDN dependencies for core crypto — all inlined
- User fully responsible for keys and proof files — no recovery
- No anonymous Nostr posting — Nostr is for Nostr users
- Batch timestamping future consideration — OTS batches natively via Merkle tree

## Monetization (planned)
Core tool stays free and open forever:
- Arweave fee pass-through via Lightning — free path (own AR wallet) always available
- CK Relay premium tier — extended retention
- API access — pay-per-stamp or monthly via Lightning
- No accounts, no credit cards, no KYC

## Attribution
Built by Keith Meola — Bitcoin educator, privacy advocate, open-source supporter
- Website: keithmeola.com
- Nostr: npub1ygzsm5m9ndtgch9n22cwsx2clwvxhk2pqvdfp36t5lmdyjqvz84qkca2m5
- Lightning: keith@getalby.com
- PGP: DB31 D0E3 FDAC A0A8 BF61 950E 53AE 9EF6 09AF EAD7

## Version history
- v0.1.0 — Phase 1: hash, stamp, encrypt, verify
- v0.2.0 — Nostr integration
- v0.2.1 — age encryption replaces .ckenc
- v0.2.2 — age library inlined, Nostr UX, password eye toggle, hover card fix
- v0.2.3 — Nostr login modal, NIP-46 bunker UI, post controls, footer attribution
- v0.2.4 — Verify Hash tab, MIT license, relay.primal.net, custom relay checkbox fix
- v0.2.5 — Font scaling, UI polish, Bitcoin confirmation in Verify, My Stamps relay sources, post-stamp flow, calendar name in metadata, nevent copy, updated metadata JSON after post
- v1.0.0 — target: NIP-46 signing complete, Arweave archival, public announcement on Nostr
