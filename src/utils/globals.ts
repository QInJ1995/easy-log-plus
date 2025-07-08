// utils/globals.ts
import Logger from '../core/Logger';

export const setGlobalLogger = (logger: Logger): void => {
    globalThis.logger = logger;
};

export const getGlobalLogger = (): Logger | undefined => {
    return globalThis.logger;
}
