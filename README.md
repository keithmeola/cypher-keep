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
Upload an original file (or paste its hash) alongside an `.ots` proof file to confirm the content is unaltered and the timestamp is valid. Designed for non-technical users — clear pass or fail, no jargon.

### Encrypt
Encrypt any file with a password using the age encryption format (ChaCha20-Poly1305 with scrypt key derivation) — an open standard decryptable with any age-compatible tool, independent of Cypher Keep. The encrypted file can be shared freely — only someone with the password can decrypt it. Decrypt included.

### Nostr
Connect a Nostr browser extension (Alby, nos2x, or any NIP-07 compatible signer) to publish your stamps as signed Nostr events. Browse your full stamp history in My Stamps. Announce Bitcoin confirmations back to your original post.

---

## How it works

- **SHA-256** via the browser-native Web Crypto API — no libraries
- **OpenTimestamps** — open protocol, public calendar servers, Bitcoin anchored
- **age encryption format** — ChaCha20-Poly1305 with scrypt key derivation, browser-native, decryptable with any age-compatible tool
- **Nostr** — NIP-07 browser extension signing, NIP-44 encryption
- Single HTML file — download it and run it locally with no internet required (except for OTS submission and Nostr)

---

## Core principles

- **Nothing leaves your browser unencrypted or unhashed.** Your files are never transmitted anywhere.
- **No account. No server. No tracking.**
- **You are responsible for your keys and your proof files.** There is no recovery, no reset, no backdoor. This is a feature.
- **Open source.** Inspect every line. Run it locally. Fork it. Audit it.

---

## Roadmap

| Phase | Status | Description |
|-------|--------|-------------|
| 1 — Core | ✅ Complete | SHA-256, OpenTimestamps, age encryption/decrypt, verify |
| 2 — Nostr | ✅ Complete | Browser extension login, post stamps, stamp history, confirmation announcements |
| 3 — Signing | 🔨 Next | NIP-46 remote signer support (Nsec Bunker, Amber), mobile layout |
| 4 — Infrastructure | 📋 Planned | Dedicated Cypher Keep Nostr relay |
| 5 — Permanence | 📋 Planned | Permanent archival of content and proofs via Arweave |

---

## Use cases

- **Creators** — prove authorship and timestamp original work before publishing
- **Journalists** — preserve evidence of what you received or witnessed, unaltered and timestamped
- **Witnesses** — document something that happened, in a form no one can dispute later
- **Senders** — encrypt a file and share it privately; recipient decrypts with the same tool

---

## Running locally

No build step. No dependencies. No install.

Download `index.html` and open it in any modern browser. That's it.

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
