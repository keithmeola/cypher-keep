# Cypher Keep

**Timestamping, verification, and encryption for everyone.**

We live in a time when lying and gaslighting by institutions and governments has become the norm. The ability to prove that something existed — in a specific form, at a specific moment — has never been more necessary. At the same time, surveillance is expanding and privacy is eroding. Cryptography is the answer to both problems, but the tools have historically required technical expertise most people don't have.

Cypher Keep was built to change that. Free, open source, and built on cypherpunk values — designed for the average person, not just developers.

🔗 **[Live Tool — Cypherkeep.net](https://www.cypherkeep.net)**

---

## What it does

### Stamp
Upload any file or paste a SHA-256 hash. Cypher Keep computes the hash locally and submits it to the OpenTimestamps network, which aggregates it into a Merkle tree and anchors the root to the Bitcoin blockchain. You receive a `.ots` proof file — a tamper-evident receipt that proves your content existed at that moment in time, verifiable by anyone, forever, without trusting Cypher Keep or any third party.

### Verify
Upload an original file (or paste its hash) alongside an `.ots` proof file to confirm the content is unaltered and the timestamp is valid. Verification is performed by the OpenTimestamps library itself and fails closed — anything that cannot be fully verified is reported as unverified, never as confirmed.

### Encrypt
Encrypt any file with a password using the age encryption format (ChaCha20-Poly1305 with scrypt key derivation) — an open standard decryptable with any age-compatible tool, independent of Cypher Keep. The encrypted file can be shared freely — only someone with the password can decrypt it. Decrypt included.

### Nostr
Connect a Nostr browser extension (Alby, nos2x, or any NIP-07 compatible signer) to publish your stamps as signed Nostr events. Browse your full stamp history in My Stamps. Announce Bitcoin confirmations back to your original post. Every event returned by a relay has its signature verified before it is displayed.

---

## How it works

- **SHA-256** via the browser-native Web Crypto API
- **OpenTimestamps** — open protocol, public calendar servers, Bitcoin anchored
- **age encryption format** — ChaCha20-Poly1305 with scrypt key derivation, browser-native, decryptable with any age-compatible tool
- **Nostr** — NIP-07 browser extension signing, NIP-44 encryption, signature verification on all inbound events
- **No third-party requests.** Every script, style and font is served from this origin. Nothing is loaded from a CDN.

---

## Core principles

- **Nothing leaves your browser unencrypted or unhashed.** Your files are never transmitted anywhere.
- **No account. No server. No tracking.**
- **You are responsible for your keys and your proof files.** There is no recovery, no reset, no backdoor. This is a feature.
- **Open source.** Inspect every line. Run it locally. Fork it. Audit it.
- **Fail closed.** If something cannot be verified, Cypher Keep says so. It never reports success on a guess.

---

## What needs an internet connection

Cypher Keep runs entirely in your browser. Some features talk to open protocols — never to Cypher Keep.

| | Works offline | Needs a connection |
|---|---|---|
| Hashing a file | ✅ | |
| Encrypt / Decrypt | ✅ | |
| Timestamping | | OpenTimestamps calendars |
| Verifying a proof | | Bitcoin block explorer |
| Nostr | | Nostr relays |

Timestamping and verification are anchored to Bitcoin, so they require reaching the network — that is inherent to the protocol, not a limitation of this tool.

What you never need is **cypherkeep.net**. Download the files and the tool talks directly to the calendars, explorers and relays. If this site disappears, your copy keeps working.

---

## Running locally

No build step. No install. No dependencies to fetch.

Download the repository (**Code → Download ZIP**), unzip it, and open `index.html` in any modern browser.

```
index.html      the application
ots.min.js      OpenTimestamps library (required for verifying)
fonts/          self-hosted fonts (optional — falls back to system fonts)
```

`index.html` on its own will hash, encrypt and decrypt. Verifying proofs and checking Bitcoin confirmations need `ots.min.js` in the same folder; Cypher Keep will tell you if it is missing rather than failing silently.

---

## Verifying what you are running

Every release publishes the SHA-256 of `index.html`. The page footer shows the hash of the file your browser actually loaded. If they match, you are running the published code.

```bash
curl -s https://cypherkeep.net | sha256sum
```

### Vendored library

`ots.min.js` is [javascript-opentimestamps](https://github.com/opentimestamps/javascript-opentimestamps) **v0.4.9**, unmodified, as published at `opentimestamps.org`.

```
SHA-256: f6181ae00cce58773f8710894c99d0656058f6a1e08c57360b263cd46c54fbf2
```

It is vendored rather than loaded from a CDN so that no third party can change the code running in your browser. Anyone can confirm this copy matches the official build.

---

## Tests

```bash
cd test
node run.js
```

The cryptography tests run with no setup. `npm install` adds the full verification suite. Tests read functions directly out of `index.html` — there is nothing to keep in sync.

---

## Roadmap

| Phase | Status | Description |
|-------|--------|-------------|
| 1 — Core | ✅ Complete | SHA-256, OpenTimestamps, age encryption/decrypt, verify |
| 2 — Nostr | ✅ Complete | Browser extension login, post stamps, stamp history, confirmation announcements |
| 3 — Signing | 🔨 Next | NIP-46 remote signer support (Nsec Bunker, Amber), mobile layout |
| 4 — npub Encryption | 📋 Planned | Encrypt files to any Nostr public key — no shared password needed |
| 5 — Infrastructure | 📋 Planned | Dedicated Cypher Keep Nostr relay |
| 6 — Permanence | 📋 Planned | Permanent archival of content and proofs via Arweave |

---

## Use cases

- **Creators** — prove authorship and timestamp original work before publishing
- **Journalists** — preserve evidence of what you received or witnessed, unaltered and timestamped
- **Witnesses** — document something that happened, in a form no one can dispute later
- **Senders** — encrypt a file and share it privately; recipient decrypts with the same tool

---

## Security

Found something? See [SECURITY.md](SECURITY.md). Reports about verification reporting false success are the highest priority.

---

## About

Built by [Keith Meola](https://primal.net/keithmeola) — Bitcoin educator, privacy advocate, and open-source supporter.

Website: [keithmeola.com](https://keithmeola.com)
Nostr: `npub1ygzsm5m9ndtgch9n22cwsx2clwvxhk2pqvdfp36t5lmdyjqvz84qkca2m5`
PGP: `DB31 D0E3 FDAC A0A8 BF61  950E 53AE 9EF6 09AF EAD7` — [fetch key](https://keys.openpgp.org/search?q=53AE9EF609AFEAD7)

---

## License

MIT — free to use, fork, and build on.

---

*Cypherpunks write code.*
