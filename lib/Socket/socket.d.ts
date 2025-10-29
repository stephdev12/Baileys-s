import { Boom } from '@hapi/boom';
import type { SocketConfig } from '../Types/index.js';
import { type BinaryNode } from '../WABinary/index.js';
import { BinaryInfo } from '../WAM/BinaryInfo.js';
import { USyncQuery } from '../WAUSync/index.js';
import { WebSocketClient } from './Client/index.js';
import { NewsletterMetadata } from './newsletter.js';
import { ButtonsContent, InteractiveContent, ListContent, CarouselContent } from './messages-send.js';
/**
 * Connects to WA servers and performs:
 * - simple queries (no retry mechanism, wait for connection establishment)
 * - listen to messages and emit events
 * - query phone connection
 */
export declare const makeSocket: (config: SocketConfig) => {
    type: "md";
    ws: WebSocketClient;
    ev: import("../Types/index.js").BaileysEventEmitter & {
        process(handler: (events: Partial<import("../Types/index.js").BaileysEventMap>) => void | Promise<void>): () => void;
        buffer(): void;
        createBufferedFunction<A extends any[], T>(work: (...args: A) => Promise<T>): (...args: A) => Promise<T>;
        flush(): boolean;
        isBuffering(): boolean;
    };
    authState: {
        creds: import("../Types/index.js").AuthenticationCreds;
        keys: import("../Types/index.js").SignalKeyStoreWithTransaction;
    };
    signalRepository: import("../Types/index.js").SignalRepositoryWithLIDStore;
    readonly user: import("../Types/index.js").Contact | undefined;
    generateMessageTag: () => string;
    query: (node: BinaryNode, timeoutMs?: number) => Promise<any>;
    waitForMessage: <T>(msgId: string, timeoutMs?: number | undefined) => Promise<T | undefined>;
    waitForSocketOpen: () => Promise<void>;
    sendRawMessage: (data: Uint8Array | Buffer) => Promise<void>;
    sendNode: (frame: BinaryNode) => Promise<void>;
    logout: (msg?: string) => Promise<void>;
    end: (error: Error | undefined) => void;
    onUnexpectedError: (err: Error | Boom, msg: string) => void;
    uploadPreKeys: (count?: number, retryCount?: number) => Promise<void>;
    uploadPreKeysToServerIfRequired: () => Promise<void>;
    requestPairingCode: (phoneNumber: string, customPairingCode?: string) => Promise<string>;
    wamBuffer: BinaryInfo;
    /** Waits for the connection to WA to reach a state */
    waitForConnectionUpdate: (check: (u: Partial<import("../Types/index.js").ConnectionState>) => Promise<boolean | undefined>, timeoutMs?: number) => Promise<void>;
    sendWAMBuffer: (wamBuffer: Buffer) => Promise<any>;
    executeUSyncQuery: (usyncQuery: USyncQuery) => Promise<import("../index.js").USyncQueryResult | undefined>;
    onWhatsApp: (...phoneNumber: string[]) => Promise<{
        jid: string;
        exists: boolean;
    }[] | undefined>;
     newsletterFollow: (jid: string) => Promise<any>;
    newsletterUnfollow: (jid: string) => Promise<any>;
    newsletterMetadata: (type: 'invite' | 'direct', key: string, role?: string) => Promise<NewsletterMetadata>;
    newsletterCreate: (name: string, description?: string, picture?: Buffer) => Promise<any>;
    newsletterDelete: (jid: string) => Promise<any>;
    newsletterReactMessage: (jid: string, serverId: string, emoji: string) => Promise<any>;
    newsletterMute: (jid: string) => Promise<any>;
    newsletterUnmute: (jid: string) => Promise<any>;
    newsletterAction: (jid: string, action: 'mute' | 'unmute' | 'follow' | 'unfollow') => Promise<any>;
    newsletterUpdateName: (jid: string, name: string) => Promise<any>;
    newsletterUpdateDescription: (jid: string, description: string) => Promise<any>;
    newsletterUpdatePicture: (jid: string, content: Buffer) => Promise<any>;
    newsletterRemovePicture: (jid: string) => Promise<any>;
    newsletterFetchMessages: (type: 'invite' | 'direct', key: string, count?: number, after?: number) => Promise<any>;
    newsletterFetchUpdates: (jid: string, count?: number, after?: number, since?: number) => Promise<any>;
    newsletterReactionMode: (jid: string, mode: 'all' | 'basic' | 'none' | 'blocklist') => Promise<any>;
    newsletterAdminCount: (jid: string) => Promise<any>;
    
    // Buttons
    sendButtonsMessage: (jid: string, content: ButtonsContent, options?: any) => Promise<any>;
    sendInteractiveMessage: (jid: string, content: InteractiveContent, options?: any) => Promise<any>;
    sendListMessage: (jid: string, content: ListContent, options?: any) => Promise<any>;
    sendCarouselMessage: (jid: string, content: CarouselContent, options?: any) => Promise<any>;
};
//# sourceMappingURL=socket.d.ts.map
