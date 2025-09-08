import { checkIsBrowser } from "./common";


const topGlobalThis = _getTopGlobalThis();

function _getTopGlobalThis(): any {
    let topGlobalThis = globalThis as any;
    if (!checkIsBrowser()) {
        return topGlobalThis;
    }
    while (topGlobalThis !== topGlobalThis.top) {
        try {
            if (topGlobalThis.parent.location.href) {
                topGlobalThis = topGlobalThis.parent
            }
        } catch (_error) {
            break;
        }
    }
    return topGlobalThis
}


export default topGlobalThis;