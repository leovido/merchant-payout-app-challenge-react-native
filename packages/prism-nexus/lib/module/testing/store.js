"use strict";

/**
 * In-memory stand-in for the native secure store, used under `testMode`. It
 * lets tests seed payloads, inspect what is held, and simulate TTL expiry
 * without touching the native bridge, Keychain, or Keystore.
 */
export class TestHydrationStore {
  entries = new Map();
  errors = [];
  put(envelope, createdAt = Date.now()) {
    this.entries.set(envelope.reqId, {
      reqId: envelope.reqId,
      envelope,
      createdAt,
      expired: false
    });
  }
  recordError(error) {
    this.errors.push(error);
  }

  /** Return and consume the oldest live entry, or `null` if none remain. */
  takeNextLive() {
    for (const entry of this.entries.values()) {
      if (!entry.expired) {
        this.entries.delete(entry.reqId);
        return entry.envelope;
      }
    }
    return null;
  }

  /** Mark every held entry expired, mirroring a TTL sweep. */
  expireAll() {
    for (const entry of this.entries.values()) {
      entry.expired = true;
    }
  }
  inspect() {
    const stored = [];
    let cached = 0;
    for (const entry of this.entries.values()) {
      stored.push(entry.reqId);
      if (!entry.expired) {
        cached += 1;
      }
    }
    return {
      stored,
      cached,
      errors: [...this.errors]
    };
  }
  reset() {
    this.entries.clear();
    this.errors.length = 0;
  }
}
//# sourceMappingURL=store.js.map