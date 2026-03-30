# Cypher Keep

**Cryptographic content authentication — entirely in your browser.**

Hash any file with SHA-256, anchor it to the Bitcoin blockchain via OpenTimestamps, encrypt files with the age open standard, and verify proofs — all locally, with no server, no account, and nothing leaving your device.

🔗 **[Live Tool — keithmeola.github.io/cypher-keep](https://keithmeola.github.io/cypher-keep/)**

---

## Why

We are entering an age of deepfakes, AI-generated content, and institutional distrust. The ability to prove that something existed — in a specific form, at a specific moment — is becoming one of the most important capabilities an individual or organization can have.

Cypher Keep is a tool for that. A personal cryptographic notary. Use it when something matters enough to protect.

---

## What it does

### Stamp
Upload any file or paste a SHA-256 hash. Cypher Keep computes the hash locally and submits it to the OpenTimestamps network, which aggregates it into a Merkle tree and commits the root to the Bitcoin blockchain. You receive a `.ots` proof file — a tamper-evident receipt that proves your content existed at that moment in time, verifiable by anyone, forever, without trusting Cypher Keep or any third party.

### Verify
Upload an original file (or paste its hash) alongside an `.ots` proof file to confirm the content is unaltered and matches the proof. Designed to be usable by non-technical people — clear pass or fail, no jargon.

### Encrypt
Encrypt any file with a password using the [age encryption format](https://age-encryption.org) — an open standard with implementations in Go, Rust, Python, JavaScript, and more. The encrypted `.age` file can be shared freely — only someone with the password can decrypt it. Decryptable with any age-compatible tool, independent of Cypher Keep. Decrypt tab included.

### Nostr
Connect your Nostr identity via any NIP-07 browser extension (Alby, nos2x, or compatible). After stamping a file, optionally post your stamp as a public Kind 1 Nostr event — permanently recorded under your key, censorship-resistant, and queryable by anyone. A **My Stamps** tab queries your full stamp history from public relays.

---

## How it works

- **SHA-256** via the browser-native Web Crypto API — no libraries
- **OpenTimestamps** — open protocol, public calendar servers, Bitcoin anchored
- **age encryption** — open standard, passphrase mode, scrypt + ChaCha20-Poly1305, via [Typage](https://github.com/FiloSottile/typage) (BSD-3-Clause)
- **Nostr** — NIP-07 signing via browser extension, Kind 1 events, public relay publication
- Single HTML file — download it and run it locally with no internet required (except for OTS submission and Nostr relay publishing)

---

## Core principles

- **Nothing leaves your browser unencrypted or unhashed.** Your files are never transmitted anywhere.
- **No account. No server. No tracking.**
- **No lock-in.** Encrypted files use the open age standard — decryptable forever with any age-compatible tool. OTS proofs are verifiable with any Bitcoin node. Nostr events are permanent and relay-independent.
- **You are responsible for your keys and your proof files.** There is no recovery, no reset, no backdoor. This is a feature.
- **Open source.** Inspect every line. Run it locally. Fork it. Audit it.

---

## Roadmap

| Phase | Status | Description |
|-------|--------|-------------|
| 1 — Hash, Timestamp, Encrypt, Verify | ✅ Complete | SHA-256, OpenTimestamps, age encrypt/decrypt, verify |
| 2 — Nostr | ✅ Complete | NIP-07 login, post stamps as Nostr events, My Stamps history |
| 3 — Arweave | 🔨 Next | Permanent archival of content and proofs to the Arweave permaweb |
| 4 — Monetization | 📋 Planned | Lightning-native payments for Arweave fee pass-through and relay premium tier |

---

## Use cases

- **Creators** — prove authorship and timestamp original work before publishing
- **Witnesses** — preserve evidence of something you received or captured, unaltered
- **Senders** — encrypt a file with age and share it privately; recipient decrypts with any age-compatible tool
- **Nostr users** — anchor stamps to your sovereign identity, build a public attestation record
- **Organizations** — audit trails, document authenticity, timestamped records *(future)*

---

## Running locally

No build step. No dependencies. No install.

Download `index.html` and open it in any modern browser. That's it.

---

## About

Built by [Keith Meola](https://keithmeola.com) — Bitcoin educator, privacy advocate, and open-source supporter.

Website: [keithmeola.com](https://keithmeola.com)
Nostr: `npub1ygzsm5m9ndtgch9n22cwsx2clwvxhk2pqvdfp36t5lmdyjqvz84qkca2m5`
PGP: `DB31 D0E3 FDAC A0A8 BF61  950E 53AE 9EF6 09AF EAD7` — [fetch key](https://keys.openpgp.org/search?q=53AE9EF609AFEAD7)

---

## License

License TBD — deciding between MIT and AGPL. Will be added before first public announcement.

---

*Cypherpunks write code.*
