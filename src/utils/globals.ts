// utils/globals.ts
import Logger from '../core/Logger';

export const getGlobal = (): typeof globalThis & { logger?: Logger } => {
    if (typeof window !== 'undefined') {
        return window as any;
    } else if (typeof process !== 'undefined' && process.versions?.node) {
        return global as any;
    }
    return {} as any; // fallback
};

export const setGlobalLogger = (logger: Logger): void => {
    const g = getGlobal();
    g.logger = logger;
};

export const getGlobalLogger = (): Logger | undefined => {
    const g = getGlobal();
    return g.logger;
}
