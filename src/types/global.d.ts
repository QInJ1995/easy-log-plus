// src/types/global.d.ts
import Logger from '../core/Logger';

declare global {
    interface Window {
        logger?: Logger;
    }
    // interface Global {
    //     logger?: Logger;
    // }
}