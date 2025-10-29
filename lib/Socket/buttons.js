import { proto } from '../../WAProto/index.js';
import { makeCommunitiesSocket } from './communities.js';

export const makeButtonsSocket = (config) => {
    const sock = makeCommunitiesSocket(config);
    const { logger } = sock;

    /**
     * IMPORTANT: Ne PAS utiliser relayMessage pour les boutons!
     * Utiliser directement sock.sendMessage qui est disponible depuis le parent
     */

    // ==========================================
    // MÉTHODE 1: Boutons simples (Format direct)
    // ==========================================
    const sendButtonMessage = async (jid, content, options = {}) => {
        const buttons = content.buttons.map((btn, index) => ({
            buttonId: btn.buttonId || `btn_${index}`,
            buttonText: {
                displayText: btn.displayText || btn.text || `Button ${index + 1}`
            },
            type: 1
        }));

        // Structure EXACTE pour les boutons simples
        const buttonMessage = {
            text: content.text || '',
            footer: content.footer || '',
            buttons: buttons,
            headerType: 1
        };

        // Si image fournie
        if (content.image) {
            buttonMessage.image = content.image;
            buttonMessage.caption = content.text || '';
            delete buttonMessage.text;
            buttonMessage.headerType = 4;
        }

        // Si video fournie
        if (content.video) {
            buttonMessage.video = content.video;
            buttonMessage.caption = content.text || '';
            delete buttonMessage.text;
            buttonMessage.headerType = 4;
        }

        logger?.debug('sending button message', buttonMessage);

        // UTILISER sendMessage au lieu de relayMessage!
        return await sock.sendMessage(jid, buttonMessage, options);
    };

    // ==========================================
    // MÉTHODE 2: Messages interactifs
    // ==========================================
    const sendInteractiveMessage = async (jid, content, options = {}) => {
        const interactiveButtons = content.interactiveButtons || content.buttons?.map((btn, index) => ({
            name: "quick_reply",
            buttonParamsJson: JSON.stringify({
                display_text: btn.displayText || btn.text || `Button ${index + 1}`,
                id: btn.buttonId || btn.id || `btn_${index}`
            })
        })) || [];

        const interactiveMessage = {
            text: content.text || '',
            title: content.title || '',
            footer: content.footer || '',
            interactiveButtons: interactiveButtons
        };

        // Si média fourni
        if (content.image) {
            interactiveMessage.image = content.image;
            interactiveMessage.caption = content.text || '';
            interactiveMessage.media = true;
            delete interactiveMessage.text;
        }

        if (content.video) {
            interactiveMessage.video = content.video;
            interactiveMessage.caption = content.text || '';
            interactiveMessage.media = true;
            delete interactiveMessage.text;
        }

        logger?.debug('sending interactive message', interactiveMessage);

        return await sock.sendMessage(jid, interactiveMessage, options);
    };

    // ==========================================
    // MÉTHODE 3: Template buttons
    // ==========================================
    const sendTemplateMessage = async (jid, content, options = {}) => {
        const templateButtons = content.buttons?.map((btn, index) => {
            if (btn.urlButton) {
                return {
                    index: index + 1,
                    urlButton: {
                        displayText: btn.urlButton.displayText,
                        url: btn.urlButton.url
                    }
                };
            }
            if (btn.callButton) {
                return {
                    index: index + 1,
                    callButton: {
                        displayText: btn.callButton.displayText,
                        phoneNumber: btn.callButton.phoneNumber
                    }
                };
            }
            return {
                index: index + 1,
                quickReplyButton: {
                    displayText: btn.displayText || btn.text || `Button ${index + 1}`,
                    id: btn.buttonId || btn.id || `btn_${index}`
                }
            };
        }) || [];

        const templateMessage = {
            text: content.text || '',
            footer: content.footer || '',
            templateButtons: templateButtons
        };

        if (content.image) {
            templateMessage.image = content.image;
        }
        if (content.video) {
            templateMessage.video = content.video;
        }

        logger?.debug('sending template message', templateMessage);

        return await sock.sendMessage(jid, templateMessage, options);
    };

    // ==========================================
    // MÉTHODE 4: List message
    // ==========================================
    const sendListMessage = async (jid, content, options = {}) => {
        const sections = content.sections?.map((section) => ({
            title: section.title,
            rows: section.rows?.map((row) => ({
                title: row.title,
                description: row.description || '',
                rowId: row.rowId || row.id || `row_${Math.random().toString(36).substr(2, 9)}`
            }))
        })) || [];

        const listMessage = {
            text: content.text || content.description || '',
            title: content.title || '',
            footer: content.footer || '',
            buttonText: content.buttonText || 'Select',
            sections: sections
        };

        logger?.debug('sending list message', listMessage);

        return await sock.sendMessage(jid, listMessage, options);
    };

    // ==========================================
    // MÉTHODE 5: Buttons avec NativeFlow (Format avancé)
    // ==========================================
    const sendNativeFlowButtons = async (jid, content, options = {}) => {
        const buttons = content.buttons || [];
        
        // Convertir les boutons simples en format nativeFlow
        const nativeButtons = buttons.map((btn, index) => {
            // Si c'est déjà un bouton nativeFlow
            if (btn.name && btn.buttonParamsJson) {
                return btn;
            }
            
            // Sinon, créer un format nativeFlow à partir d'un bouton simple
            return {
                name: "quick_reply",
                buttonParamsJson: JSON.stringify({
                    display_text: btn.displayText || btn.text || `Button ${index + 1}`,
                    id: btn.buttonId || btn.id || `btn_${index}`
                })
            };
        });

        const nativeFlowMessage = {
            text: content.text || '',
            title: content.title || '',
            footer: content.footer || '',
            buttons: nativeButtons,
            headerType: 4
        };

        // Support média
        if (content.image) {
            nativeFlowMessage.image = content.image;
        }
        if (content.video) {
            nativeFlowMessage.video = content.video;
        }

        logger?.debug('sending native flow buttons', nativeFlowMessage);

        return await sock.sendMessage(jid, nativeFlowMessage, options);
    };

    // ==========================================
    // MÉTHODE 6: Buttons Flow avec single_select (Menu déroulant dans bouton)
    // ==========================================
    const sendButtonsFlow = async (jid, content, options = {}) => {
        const buttons = [
            ...(content.quickButtons || []).map((btn, index) => ({
                buttonId: btn.buttonId || btn.id || `quick_${index}`,
                buttonText: {
                    displayText: btn.displayText || btn.text || `Button ${index + 1}`
                },
                type: 1
            })),
            {
                buttonId: 'action',
                buttonText: {
                    displayText: content.menuButtonText || '☰ Menu'
                },
                type: 4,
                nativeFlowInfo: {
                    name: 'single_select',
                    paramsJson: JSON.stringify({
                        title: content.menuTitle || 'Select an option',
                        sections: content.sections || []
                    })
                }
            }
        ];

        const buttonMessage = {
            text: content.text || '',
            footer: content.footer || '',
            buttons: buttons,
            headerType: 1,
            viewOnce: content.viewOnce || false
        };

        logger?.debug('sending buttons flow message', buttonMessage);

        return await sock.sendMessage(jid, buttonMessage, options);
    };

    return {
        ...sock,
        sendButtonMessage,
        sendInteractiveMessage,
        sendTemplateMessage,
        sendListMessage,
        sendNativeFlowButtons,
        sendButtonsFlow
    };
};