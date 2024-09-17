const { ipcRenderer } = window.require('electron');

class IPCEventManager {
    constructor() {
        this.listeners = {};
    }

    on(channel, listener) {
        if (!this.listeners[channel]) {
            this.listeners[channel] = new Set();
            ipcRenderer.on(channel, (_, ...args) => this.emit(channel, ...args));
        }
        this.listeners[channel].add(listener);
    }

    off(channel, listener) {
        if (this.listeners[channel]) {
            this.listeners[channel].delete(listener);
            if (this.listeners[channel].size === 0) {
                delete this.listeners[channel];
                ipcRenderer.removeAllListeners(channel);
            }
        }
    }

    emit(channel, ...args) {
        if (this.listeners[channel]) {
            this.listeners[channel].forEach(listener => listener(...args));
        }
    }
}

export const ipcEventManager = new IPCEventManager();