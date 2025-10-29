import { DEFAULT_CONNECTION_CONFIG } from '../Defaults/index.js';
import { makeButtonsSocket } from './buttons.js'; // ← Changé
const makeWASocket = (config) => {
    const newConfig = {
        ...DEFAULT_CONNECTION_CONFIG,
        ...config
    };
    if (config.shouldSyncHistoryMessage === undefined) {
        newConfig.shouldSyncHistoryMessage = () => !!newConfig.syncFullHistory;
    }
    return makeButtonsSocket(newConfig); // ← Changé
};
export default makeWASocket;
//# sourceMappingURL=index.js.map