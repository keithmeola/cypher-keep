# Cypher Keep tests

Cypher Keep itself has **no build step and no dependencies** — `index.html` is
the whole application. These tests are a separate, optional layer. They read
functions directly out of `../index.html`, so there is nothing to keep in sync
and no bundling involved.

## Running

```bash
cd test
node run.js
```

The cryptography tests (NIP-44, ChaCha20, bech32) run with **zero setup**.

The verification tests need the real OpenTimestamps library:

```bash
npm install
node run.js
```

Without it, those tests are skipped and clearly reported as skipped — never as
passing.

## What is covered

| Test | Why it exists |
|---|---|
| Spliced proof is rejected | A forged `.ots` (32 bytes overwritten at offset 33) must never report BITCOIN CONFIRMED. This was a real vulnerability in v0.3.2, fixed in v0.3.3. |
| Hash mismatch fails | A proof for other content must fail loudly. |
| Malformed proof fails | Unparseable input must fail, not fall through. |
| Missing library never confirms | If OpenTimestamps cannot load, nothing may be reported as verified. |
| NIP-44 spec vectors | Conversation key, message keys, and full payload must match the official NIP-44 vectors byte for byte. |
| ChaCha20 cross-check | Verified against Node's native cipher across block boundaries. |
| bech32 npub / nevent | Checked against an independent reference implementation. |

## The rule these tests enforce

**Fail closed.** Any uncertainty — network failure, unparseable proof, missing
library, unexpected library response — must resolve to *not confirmed*. There is
no code path that reports success on a guess. If you are changing verification
and a test fails, the test is probably right.
