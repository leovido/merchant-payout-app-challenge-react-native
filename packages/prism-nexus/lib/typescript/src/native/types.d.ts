import type { HydrationErrorCode } from '../errors.js';
import type { SealAndStorePayloadInput } from './storePayload.js';
import type { HydrationWirePayload, NativeHydratorConfigureOptions } from './wirePayload.js';
/** Trigger names shared between JS orchestration and the native bridge. */
export type NativeHydrationTrigger = 'appLaunch' | 'appStateActive' | 'manual';
/** Unencrypted header claims returned by the native decrypt/reassembly path. */
export interface NativeHydrationClaims {
    v: number;
    ts: number;
    ctx: string;
    kid: string;
}
/** Decrypted payload envelope handed from native to the JS pipeline. */
export interface NativeHydrationEnvelope {
    reqId: string;
    claims: NativeHydrationClaims;
    state: unknown;
}
/** Snapshot of entries held in native ephemeral storage. */
export interface NativeStorageSnapshot {
    stored: string[];
    cached: number;
}
/** Shape of coded errors thrown by Expo native functions. */
export interface NativeHydrationErrorPayload {
    code: string;
    message?: string;
    details?: Readonly<Record<string, unknown>>;
}
/** Native module contract implemented by Swift/Kotlin Expo modules. */
export interface PrismNexusHydratorNativeSpec {
    isAvailable(): boolean;
    extractReqId(url: string): string | null;
    configure(options: NativeHydratorConfigureOptions): Promise<void>;
    storePayload(payload: HydrationWirePayload): Promise<void>;
    sealAndStorePayload(input: SealAndStorePayloadInput): Promise<HydrationWirePayload>;
    resolveEnvelope(trigger: NativeHydrationTrigger): Promise<NativeHydrationEnvelope | null>;
    purgeExpired(): Promise<number>;
    inspectStorage(): Promise<NativeStorageSnapshot>;
}
/** Maps a native error code string to a stable {@link HydrationErrorCode}. */
export declare const NATIVE_ERROR_CODE_MAP: Readonly<Record<string, HydrationErrorCode>>;
//# sourceMappingURL=types.d.ts.map