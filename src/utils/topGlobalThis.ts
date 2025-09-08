import { checkIsBrowser } from "./common";


const topGlobalThis = _getTopGlobalThis();

function _getTopGlobalThis(): any {
    let topGlobalThis = globalThis as any;
    if (!checkIsBrowser()) {
        return topGlobalThis;
    }
    while (topGlobalThis !== topGlobalThis.top) {
        try {
            // 使用 postMessage 进行跨域测试
            topGlobalThis.postMessage('__test__', '*');
            // 如果能发送消息，说明可以访问
            topGlobalThis = topGlobalThis.parent
        } catch (_error) {
            break;
        }
    }
    return topGlobalThis
}


export default topGlobalThis;