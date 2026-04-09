# Cypher Keep

**Cryptographic content authentication — entirely in your browser.**

Hash any file with SHA-256, anchor it to the Bitcoin blockchain via OpenTimestamps, encrypt files with age, and verify proofs — all locally, with no server, no account, and nothing leaving your device.

🔗 **[cypherkeep.net](https://cypherkeep.net)** · [keithmeola.github.io/cypher-keep](https://keithmeola.github.io/cypher-keep/)

---

## Why

We are entering an age of deepfakes, AI-generated content, and institutional distrust. The ability to prove that something existed — in a specific form, at a specific moment — is becoming one of the most important capabilities an individual or organization can have.

Cypher Keep is a tool for that. A personal cryptographic notary. Use it when something matters enough to protect.

---

## What it does

### Stamp
Upload any file or paste a SHA-256 hash. Cypher Keep computes the hash locally and submits it to the OpenTimestamps network, which aggregates it into a Merkle tree and commits the root to the Bitcoin blockchain. You receive a `.ots` proof file — a tamper-evident receipt that proves your content existed at that moment in time, verifiable by anyone, forever, without trusting Cypher Keep or any third party.

### Verify
Two verification tools in one tab:

**Verify a Stamp** — Upload an original file (or paste its hash) alongside an `.ots` proof file to confirm the content is unaltered and check Bitcoin block confirmation status. CK contacts the OpenTimestamps calendar server to check whether your proof has been committed to a Bitcoin block, and displays the block number with a link to the block explorer.

**Verify a Hash** — Drop any file to compute its SHA-256 hash locally, then optionally compare it against an expected hash to confirm the file is unaltered. Useful for verifying software downloads, document integrity, or any file received from a third party.

### Encrypt
Encrypt any file with a password using the [age encryption format](https://age-encryption.org) — an open standard decryptable with any age-compatible tool, forever, independent of Cypher Keep. Encrypted `.age` files can be shared freely — only someone with the password can decrypt. Decrypt tab included. Legacy `.ckenc` files are also supported.

---

## How it works

- **SHA-256** via the browser-native Web Crypto API — no libraries
- **OpenTimestamps** — open protocol, public calendar servers, Bitcoin anchored
- **age encryption** (Typage v0.2.4 by Filippo Valsorda, BSD-3-Clause) — inlined directly, works fully offline and with browser shields up
- Single HTML file — download it and run it locally with no internet required (except for OTS submission and confirmation check)

---

## Core principles

- **Nothing leaves your browser unencrypted or unhashed.** Your files are never transmitted anywhere.
- **No account. No server. No tracking.**
- **No lock-in.** age for encryption, OTS for timestamps, Nostr for identity — all open standards with independent tooling.
- **You are responsible for your keys and your proof files.** There is no recovery, no reset, no backdoor. This is a feature.
- **Open source. MIT licensed.** Inspect every line. Run it locally. Fork it. Build on it.

---

## Roadmap

| Phase | Status | Description |
|-------|--------|-------------|
| 1 — Hash, Timestamp, Encrypt, Verify | ✅ Complete | SHA-256, OpenTimestamps, age encrypt/decrypt, verify stamp, verify hash |
| 2 — Nostr | ✅ Complete | Login with Nostr key (NIP-07 extension or NIP-46 bunker), post stamps as Nostr events, stamp history |
| 2.5 — Confirmation | 🔨 In progress | NIP-46 full event signing, Bitcoin block confirmation in Verify tab, Nostr reply on confirmation |
| 3 — Arweave | 📋 Planned | Permanent archival of content and proofs to the Arweave permaweb |

---

## Nostr integration

Connect with a browser extension (Alby, nos2x, any NIP-07 wallet) or an Nsec Bunker / remote signer via `bunker://` or `nostrconnect://`. After stamping, post your stamp as a public Nostr event with your hash, filename, and pending OTS proof embedded. When your timestamp is confirmed in a Bitcoin block, reply to your original note with the block confirmation.

---

## Use cases

- **Creators** — prove authorship and timestamp original work before publishing
- **Witnesses** — preserve evidence of something you received or captured, unaltered
- **Senders** — encrypt a file and share it privately; recipient decrypts with the same tool or any age-compatible client
- **Verifiers** — confirm a file's integrity or check a software download hash

---

## Running locally

No build step. No dependencies. No install.

Download `index.html` and open it in any modern browser. That's it.

Encryption, hashing, and verification work fully offline. OTS submission and confirmation checking require internet.

---

## About

Built by [Keith Meola](https://njump.me/npub1ygzsm5m9ndtgch9n22cwsx2clwvxhk2pqvdfp36t5lmdyjqvz84qkca2m5) — Bitcoin educator, privacy advocate, open-source supporter.

Website: [keithmeola.com](https://keithmeola.com)
Nostr: `npub1ygzsm5m9ndtgch9n22cwsx2clwvxhk2pqvdfp36t5lmdyjqvz84qkca2m5`
Lightning: `keith@getalby.com` ⚡
PGP: `DB31 D0E3 FDAC A0A8 BF61  950E 53AE 9EF6 09AF EAD7` — [fetch key](https://keys.openpgp.org/search?q=53AE9EF609AFEAD7)

---

## License

MIT — see [LICENSE](LICENSE) file.

---

*Cypherpunks write code.*
