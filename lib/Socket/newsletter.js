"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeNewsletterSocket = void 0;

const WABinary_1 = require("../WABinary");
const generics_1 = require("../Utils/generics");

const makeNewsletterSocket = (config) => {
    return (sock) => {
        
        /**
         * Follow/Subscribe to a newsletter
         */
        const newsletterFollow = async (jid) => {
            const result = await sock.query({
                tag: 'iq',
                attrs: {
                    id: (0, generics_1.generateMessageID)(),
                    type: 'set',
                    xmlns: 'newsletter',
                    to: '@newsletter'
                },
                content: [
                    {
                        tag: 'follow',
                        attrs: {
                            key: (0, WABinary_1.jidDecode)(jid)?.user || jid.split('@')[0]
                        }
                    }
                ]
            });
            return result;
        };

        /**
         * Unfollow/Unsubscribe from a newsletter
         */
        const newsletterUnfollow = async (jid) => {
            const result = await sock.query({
                tag: 'iq',
                attrs: {
                    id: (0, generics_1.generateMessageID)(),
                    type: 'set',
                    xmlns: 'newsletter',
                    to: '@newsletter'
                },
                content: [
                    {
                        tag: 'unfollow',
                        attrs: {
                            key: (0, WABinary_1.jidDecode)(jid)?.user || jid.split('@')[0]
                        }
                    }
                ]
            });
            return result;
        };

        /**
         * Get newsletter metadata
         */
        const newsletterMetadata = async (type, key, role) => {
            const result = await sock.query({
                tag: 'iq',
                attrs: {
                    id: (0, generics_1.generateMessageID)(),
                    type: 'get',
                    xmlns: 'newsletter',
                    to: '@newsletter'
                },
                content: [
                    {
                        tag: 'metadata',
                        attrs: {
                            type,
                            key,
                            ...(role && { role })
                        }
                    }
                ]
            });

            const metadata = (0, WABinary_1.getBinaryNodeChild)(result, 'metadata');
            return {
                id: metadata?.attrs?.id || key,
                name: metadata?.attrs?.name,
                description: metadata?.attrs?.description,
                subscriberCount: parseInt(metadata?.attrs?.subscriber_count || '0'),
                createdAt: parseInt(metadata?.attrs?.created_at || '0'),
                picture: metadata?.attrs?.picture
            };
        };

        /**
         * Create a new newsletter
         */
        const newsletterCreate = async (name, description, picture) => {
            const attrs = { name };
            if (description) attrs.description = description;
            if (picture) attrs.picture = picture.toString('base64');

            const result = await sock.query({
                tag: 'iq',
                attrs: {
                    id: (0, generics_1.generateMessageID)(),
                    type: 'set',
                    xmlns: 'newsletter',
                    to: '@newsletter'
                },
                content: [
                    {
                        tag: 'create',
                        attrs
                    }
                ]
            });
            return result;
        };

        /**
         * Delete a newsletter
         */
        const newsletterDelete = async (jid) => {
            const result = await sock.query({
                tag: 'iq',
                attrs: {
                    id: (0, generics_1.generateMessageID)(),
                    type: 'set',
                    xmlns: 'newsletter',
                    to: '@newsletter'
                },
                content: [
                    {
                        tag: 'delete',
                        attrs: {
                            key: (0, WABinary_1.jidDecode)(jid)?.user || jid.split('@')[0]
                        }
                    }
                ]
            });
            return result;
        };

        /**
         * React to a newsletter message
         */
        const newsletterReactMessage = async (jid, serverId, emoji) => {
            const result = await sock.sendMessage(jid, {
                react: {
                    text: emoji,
                    key: {
                        remoteJid: jid,
                        fromMe: false,
                        id: serverId
                    }
                }
            });
            return result;
        };

        /**
         * Mute a newsletter
         */
        const newsletterMute = async (jid) => {
            return await newsletterAction(jid, 'mute');
        };

        /**
         * Unmute a newsletter
         */
        const newsletterUnmute = async (jid) => {
            return await newsletterAction(jid, 'unmute');
        };

        /**
         * Generic newsletter action
         */
        const newsletterAction = async (jid, action) => {
            const result = await sock.query({
                tag: 'iq',
                attrs: {
                    id: (0, generics_1.generateMessageID)(),
                    type: 'set',
                    xmlns: 'newsletter',
                    to: jid
                },
                content: [
                    {
                        tag: action,
                        attrs: {}
                    }
                ]
            });
            return result;
        };

        /**
         * Update newsletter name
         */
        const newsletterUpdateName = async (jid, name) => {
            const result = await sock.query({
                tag: 'iq',
                attrs: {
                    id: (0, generics_1.generateMessageID)(),
                    type: 'set',
                    xmlns: 'newsletter',
                    to: jid
                },
                content: [
                    {
                        tag: 'newsletter_update',
                        attrs: { name }
                    }
                ]
            });
            return result;
        };

        /**
         * Update newsletter description
         */
        const newsletterUpdateDescription = async (jid, description) => {
            const result = await sock.query({
                tag: 'iq',
                attrs: {
                    id: (0, generics_1.generateMessageID)(),
                    type: 'set',
                    xmlns: 'newsletter',
                    to: jid
                },
                content: [
                    {
                        tag: 'newsletter_update',
                        attrs: { description }
                    }
                ]
            });
            return result;
        };

        /**
         * Fetch newsletter messages
         */
        const newsletterFetchMessages = async (type, key, count = 25, after) => {
            const attrs = {
                type,
                key,
                count: count.toString()
            };
            if (after) attrs.after = after.toString();

            const result = await sock.query({
                tag: 'iq',
                attrs: {
                    id: (0, generics_1.generateMessageID)(),
                    type: 'get',
                    xmlns: 'newsletter',
                    to: '@newsletter'
                },
                content: [
                    {
                        tag: 'messages',
                        attrs
                    }
                ]
            });
            return result;
        };

        /**
         * Update newsletter reaction mode
         */
        const newsletterReactionMode = async (jid, mode) => {
            const result = await sock.query({
                tag: 'iq',
                attrs: {
                    id: (0, generics_1.generateMessageID)(),
                    type: 'set',
                    xmlns: 'newsletter',
                    to: jid
                },
                content: [
                    {
                        tag: 'settings',
                        attrs: {
                            reaction_codes: mode
                        }
                    }
                ]
            });
            return result;
        };

        return {
            newsletterFollow,
            newsletterUnfollow,
            newsletterMetadata,
            newsletterCreate,
            newsletterDelete,
            newsletterReactMessage,
            newsletterMute,
            newsletterUnmute,
            newsletterAction,
            newsletterUpdateName,
            newsletterUpdateDescription,
            newsletterFetchMessages,
            newsletterReactionMode
        };
    };
};

exports.makeNewsletterSocket = makeNewsletterSocket;
