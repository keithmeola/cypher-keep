#!/usr/bin/env node
/**
 * Cypher Keep test suite.
 * Reads functions directly out of ../index.html — nothing to keep in sync.
 *
 *   node run.js            crypto tests only (no dependencies)
 *   npm install && node run.js   adds full verification tests
 */
'use strict';
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { webcrypto } = require('crypto');
if (!global.crypto) global.crypto = webcrypto;

const HTML = path.join(__dirname, '..', 'index.html');
const src = fs.readFileSync(HTML, 'utf8');

let pass = 0, fail = 0, skip = 0;
const failures = [];

function ok(name, cond, detail) {
  if (cond) { pass++; console.log('  \x1b[32m✓\x1b[0m ' + name); }
  else { fail++; failures.push(name + (detail ? ' — ' + detail : ''));
         console.log('  \x1b[31m✗\x1b[0m ' + name + (detail ? '\n      ' + detail : '')); }
}
function skipped(name, why) {
  skip++; console.log('  \x1b[33m○\x1b[0m ' + name + ' \x1b[2m(skipped: ' + why + ')\x1b[0m');
}
function section(t) { console.log('\n\x1b[1m' + t + '\x1b[0m'); }

/** Pull a span of source out of index.html by start/end markers. */
function extract(startMarker, endMarker) {
  const s = src.indexOf(startMarker);
  if (s === -1) throw new Error('marker not found in index.html: ' + startMarker);
  const e = src.indexOf(endMarker, s);
  if (e === -1) throw new Error('end marker not found: ' + endMarker);
  return src.slice(s, e);
}

const HEX_HELPER = '\nfunction hexToBytes(hex){const b=new Uint8Array(hex.length/2);' +
  'for(let i=0;i<hex.length;i+=2)b[i/2]=parseInt(hex.substr(i,2),16);return b;}\n';

console.log('\x1b[1mCypher Keep — test suite\x1b[0m');
console.log('\x1b[2mreading ' + path.relative(process.cwd(), HTML) + '\x1b[0m');

// ═══════════════════════════════════════════════════════════
section('Version consistency');
// ═══════════════════════════════════════════════════════════
{
  const defs = src.match(/const CK_VERSION\s*=\s*'([^']+)'/);
  ok('CK_VERSION is defined exactly once',
     defs && src.match(/const CK_VERSION\s*=/g).length === 1);
  const hardcoded = src.match(/version:\s*'[0-9]+\.[0-9]+/g) || [];
  ok('no hardcoded version strings remain in metadata', hardcoded.length === 0,
     hardcoded.length ? 'found: ' + hardcoded.join(', ') : '');
  const uses = (src.match(/version:\s*CK_VERSION/g) || []).length;
  ok('all 3 metadata exports use CK_VERSION', uses === 3, 'found ' + uses);
  if (defs) console.log('    \x1b[2mversion: ' + defs[1] + '\x1b[0m');
}

// ═══════════════════════════════════════════════════════════
section('Verification — fail-closed guarantees');
// ═══════════════════════════════════════════════════════════
{
  ok('byte-scan fallback is absent', !src.includes('extractBitcoinAttestation'),
     'extractBitcoinAttestation must never be reintroduced');
  ok('fixed-offset hash shortcut is absent', !src.includes('slice(33,65)'),
     'hash binding must come from the parsed proof, not a byte offset');

  let OTS = null;
  try { OTS = require('javascript-opentimestamps'); } catch (_) {}

  if (!OTS) {
    skipped('spliced proof is not confirmed', 'run npm install');
    skipped('hash mismatch fails', 'run npm install');
    skipped('malformed proof fails', 'run npm install');
  } else {
    global.OpenTimestamps = OTS;
    global.window = global.window || {};
    global.verifyOTS = null; global.otsBytes = null;

    const logic = extract('function bytesToHexStr(u8)', 'function pendingCheckHTML()');
    const mod = {};
    new Function('module', 'exports', 'OpenTimestamps', 'window', 'verifyOTS', 'otsBytes',
      logic + HEX_HELPER + 'module.exports={verifyOTSProof};'
    )(mod, mod.exports = {}, OTS, global.window, null, null);
    const { verifyOTSProof } = mod.exports;

    // Build a realistic multi-branch proof, then splice it.
    const realHash = crypto.createHash('sha256').update('the genuine document').digest();
    const dtf = OTS.DetachedTimestampFile.fromHash(new OTS.Ops.OpSHA256(), Array.from(realHash));
    const branch = (root, depth, att) => {
      let ts = root, msg = root.msg;
      for (let i = 0; i < depth; i++) {
        const a = new OTS.Ops.OpAppend(Array.from(crypto.randomBytes(16)));
        const m2 = a.call(msg), t2 = new OTS.Timestamp(m2); ts.ops.set(a, t2);
        const s2 = new OTS.Ops.OpSHA256();
        const m3 = s2.call(m2), t3 = new OTS.Timestamp(m3); t2.ops.set(s2, t3);
        ts = t3; msg = m3;
      }
      ts.attestations.push(att);
    };
    branch(dtf.timestamp, 2, new OTS.Notary.BitcoinBlockHeaderAttestation(944542));
    branch(dtf.timestamp, 3, new OTS.Notary.PendingAttestation('https://bob.btc.calendar.opentimestamps.org'));

    const genuine = Buffer.from(dtf.serializeToBytes());
    const forgedHash = crypto.createHash('sha256').update('backdated document').digest();
    const spliced = Buffer.from(genuine); forgedHash.copy(spliced, 33);

    return (async () => {
      // THE regression test for the v0.3.2 vulnerability
      const r1 = await verifyOTSProof(forgedHash.toString('hex'), new Uint8Array(spliced));
      ok('spliced proof is NOT confirmed', r1.status !== 'confirmed',
         'got status=' + r1.status);
      ok('spliced proof surfaces the unverified claim',
         r1.status === 'unverified' && r1.claimedHeight === 944542,
         'status=' + r1.status + ' claimedHeight=' + r1.claimedHeight);

      // Genuine proof, wrong content
      const r2 = await verifyOTSProof(forgedHash.toString('hex'), new Uint8Array(genuine));
      ok('hash mismatch fails', r2.status === 'failed' && r2.reason === 'hash-mismatch',
         'got status=' + r2.status + ' reason=' + r2.reason);

      // Garbage input
      const r3 = await verifyOTSProof(realHash.toString('hex'), new Uint8Array(crypto.randomBytes(200)));
      ok('malformed proof fails', r3.status === 'failed',
         'got status=' + r3.status);

      // Library unavailable must never confirm
      const saved = global.OpenTimestamps;
      global.OpenTimestamps = undefined;
      const mod2 = {};
      new Function('module', 'exports',
        logic + HEX_HELPER + 'module.exports={verifyOTSProof};')(mod2, mod2.exports = {});
      const r4 = await mod2.exports.verifyOTSProof(realHash.toString('hex'), new Uint8Array(genuine));
      global.OpenTimestamps = saved;
      ok('missing library never confirms', r4.status !== 'confirmed',
         'got status=' + r4.status);

      await cryptoTests();
      finish();
    })();
  }
}

cryptoTests().then(finish);

// ═══════════════════════════════════════════════════════════
async function cryptoTests() {
// ═══════════════════════════════════════════════════════════
section('NIP-44 — official spec vectors');
{
  const nip44 = extract('async function nip44GetConversationKey', 'async function nip46Decrypt');
  const mod = {};
  new Function('module', 'exports', 'crypto',
    nip44 + 'module.exports={nip44DeriveMessageKeys,nip44Pad,nip44Unpad,chacha20,hmacSha256,hkdfExpand};'
  )(mod, mod.exports = {}, global.crypto);
  const M = mod.exports;

  const ck = Buffer.from('c41c775356fd92eadc63ff5a0dc1da211b268cbea22316767095b2871ea1412d', 'hex');
  const nonce = Buffer.from('0000000000000000000000000000000000000000000000000000000000000001', 'hex');
  const EXPECTED = 'AgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABee0G5VSK0/9YypIObAtDKfYEAjD35uVkHyB0F4DwrcNaCXlCWZKaArsGrY6M9wnuTMxWfp1RTN9Xga8no+kF5Vsb';

  const keys = await M.nip44DeriveMessageKeys(new Uint8Array(ck), new Uint8Array(nonce));
  ok('message key derivation matches vector',
     Buffer.from(keys.chachaKey).toString('hex') ===
     '63e64ca552c6a0664d4f6402c033fd698f43d531520e177d7c5c84357feafd1a');

  const padded = M.nip44Pad('a');
  const ct = M.chacha20(keys.chachaKey, keys.chachaNonce, padded);
  const macData = new Uint8Array(32 + ct.length); macData.set(nonce); macData.set(ct, 32);
  const mac = await M.hmacSha256(keys.hmacKey, macData);
  const payload = new Uint8Array(1 + 32 + ct.length + 32);
  payload[0] = 2; payload.set(nonce, 1); payload.set(ct, 33); payload.set(mac, 33 + ct.length);
  ok('full encrypt payload matches vector',
     Buffer.from(payload).toString('base64') === EXPECTED);

  ok('pad/unpad round-trips',
     M.nip44Unpad(M.chacha20(keys.chachaKey, keys.chachaNonce, ct)) === 'a');

  const specPad = u => { if (u <= 32) return 32;
    const n = 1 << (Math.floor(Math.log2(u - 1)) + 1);
    const c = n <= 256 ? 32 : n / 8;
    return c * (Math.floor((u - 1) / c) + 1); };
  let padOk = true;
  for (const u of [1,32,33,64,65,100,128,129,256,257,320,512,1000,65535])
    if (M.nip44Pad('x'.repeat(u)).length - 2 !== specPad(u)) padOk = false;
  ok('padding table matches spec at all boundaries', padOk);

  section('ChaCha20 — cross-checked against Node');
  let ccOk = true, badLen = null;
  const key = crypto.randomBytes(32), n12 = crypto.randomBytes(12);
  for (const len of [1,63,64,65,127,128,129,255,256,500,1024,4096]) {
    const data = crypto.randomBytes(len);
    const mine = Buffer.from(M.chacha20(new Uint8Array(key), new Uint8Array(n12), new Uint8Array(data)));
    const c = crypto.createCipheriv('chacha20', key, Buffer.concat([Buffer.alloc(4), n12]));
    if (!mine.equals(Buffer.concat([c.update(data), c.final()]))) { ccOk = false; badLen = len; break; }
  }
  ok('matches native cipher across block boundaries', ccOk,
     badLen ? 'first mismatch at ' + badLen + ' bytes' : '');
}

section('bech32 — NIP-19 encoding');
{
  const bech = extract('function pubkeyToNpub(hexPubkey)', 'function bech32Decode(str)');
  const nev = extract('function eventIdToNevent(hexId)', '\n}\n', );
  const mod = {};
  new Function('module', 'exports',
    HEX_HELPER + bech + src.slice(src.indexOf('function eventIdToNevent(hexId)')).split('\n}\n')[0] + '\n}\n' +
    'module.exports={pubkeyToNpub,eventIdToNevent};')(mod, mod.exports = {});
  const B = mod.exports;

  const CH = 'qpzry9x8gf2tvdw0s3jn54khce6mua7l';
  const GEN = [0x3b6a57b2,0x26508e6d,0x1ea119fa,0x3d4233dd,0x2a1462b3];
  const pm = v => { let c = 1; for (const x of v) { const t = c >>> 25; c = ((c & 0x1ffffff) << 5) ^ x;
    for (let i = 0; i < 5; i++) if ((t >> i) & 1) c ^= GEN[i]; } return c; };
  const he = h => { const r = []; for (let i = 0; i < h.length; i++) r.push(h.charCodeAt(i) >> 5);
    r.push(0); for (let i = 0; i < h.length; i++) r.push(h.charCodeAt(i) & 31); return r; };
  const cb = (d,f,t) => { let a=0,b=0; const r=[], mx=(1<<t)-1;
    for (const v of d) { a=(a<<f)|v; b+=f; while(b>=t){b-=t; r.push((a>>b)&mx);} }
    if (b>0) r.push((a<<(t-b))&mx); return r; };
  const ref = (hrp, d8) => { const d5 = cb(d8,8,5);
    const p = pm(he(hrp).concat(d5).concat([0,0,0,0,0,0])) ^ 1; const cs = [];
    for (let i=0;i<6;i++) cs.push((p>>5*(5-i))&31);
    return hrp+'1'+d5.concat(cs).map(i=>CH[i]).join(''); };

  const pk = 'b'.repeat(64);
  const pkb = pk.match(/.{2}/g).map(x => parseInt(x,16));
  ok('npub matches reference implementation', B.pubkeyToNpub(pk) === ref('npub', pkb));

  const id = 'a'.repeat(64);
  const idb = id.match(/.{2}/g).map(x => parseInt(x,16));
  ok('nevent TLV is [type=0, len=32, value] per NIP-19',
     B.eventIdToNevent(id) === ref('nevent', [0, 32, ...idb]),
     'got ' + B.eventIdToNevent(id));
}
}

function finish() {
  console.log('\n' + '─'.repeat(52));
  console.log('\x1b[32m' + pass + ' passed\x1b[0m' +
    (fail ? '  \x1b[31m' + fail + ' failed\x1b[0m' : '') +
    (skip ? '  \x1b[33m' + skip + ' skipped\x1b[0m' : ''));
  if (fail) {
    console.log('\n\x1b[31mFailures:\x1b[0m');
    failures.forEach(f => console.log('  • ' + f));
    process.exit(1);
  }
  console.log('');
}
