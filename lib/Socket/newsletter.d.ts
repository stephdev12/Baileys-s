import { SocketConfig, WASocket } from '../Types/index.js';

export interface NewsletterMetadata {
    id: string;
    name?: string;
    description?: string;
    subscriberCount: number;
    createdAt?: number;
    picture?: string;
}

export declare const makeNewsletterSocket: (config: SocketConfig) => (sock: WASocket) => {
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
};
