# Security

Cypher Keep is a tool people use to prove things. If it reports something as
verified when it is not, that is the most serious kind of bug this project can
have. Reports of that kind are welcome and will be acted on quickly.

## Reporting

Please report privately first, rather than opening a public issue.

- **Email** `keith@keithmeola.com`
- **Nostr DM:** `npub1ygzsm5m9ndtgch9n22cwsx2clwvxhk2pqvdfp36t5lmdyjqvz84qkca2m5`
- **PGP:** `DB31 D0E3 FDAC A0A8 BF61  950E 53AE 9EF6 09AF EAD7`
  — [fetch key](https://keys.openpgp.org/search?q=53AE9EF609AFEAD7)

Include what you did, what you expected, and what happened. A proof-of-concept
file is ideal if you have one.

## Scope

Most valuable:

- Anything that makes verification report success on a proof that is not valid
- Anything that causes script execution in the page — it runs alongside your
  Nostr signer and any file you have decrypted
- Anything that transmits file contents, hashes, or keys off the device
- Errors in the cryptography: SHA-256, age encryption, NIP-44, bech32

Out of scope: the security of OpenTimestamps calendars, Nostr relays, browser
extensions, or Bitcoin itself. Cypher Keep depends on those but does not control
them.

## Verifying what you are running

Every release publishes the SHA-256 of `index.html`. The footer of the running
page shows the hash of the file your browser actually loaded. If those two
values match, you are running the published code.

```bash
curl -s https://cypherkeep.net | sha256sum
```

## Disclosure

Fixes ship first, then the details are published in the release notes —
including what was wrong, how it could be exploited, and the test that now
prevents it recurring. Silent patches are not the practice here. A tool built
on "don't trust, verify" does not get to hide its own failures.

## Known past issues

| Version | Issue |
|---|---|
| ≤ 0.3.2 | Verification accepted forged proofs. A `.ots` file with 32 bytes overwritten could report BITCOIN CONFIRMED for arbitrary content. Fixed in 0.3.3. |
