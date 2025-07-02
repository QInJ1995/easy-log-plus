import { createLogger } from './dist/easy-log-plus.mjs'


const logger2 = createLogger('EasyLogPlus3aS AAHSG ', {
    level: 'debug',
    style: {
        fontSize: 28,
        fontWeight: 900,
        padding: '50px 0 10px 0'
    },
    // isLevel: false,
    // isTime: false,
    // isColor: false,
})
const logger3 = createLogger()
const logger = createLogger('EasyLogPlus3', {
    level: 'debug',
    // isLevel: false,
    // isTime: false,
    // isColor: false,
})
logger3.log('log', 'blue', 'hello world2')
logger2.log(111)
logger.debug('debug', 'dads', {}, 111, true)
logger.warn('warn')
logger.error('error', 111)
logger.error('a->', { a: 1, b: { c: 2 } }, [1, '2', { c: 3 }], [1, '2', { c: 3 }], [1, '2', { c: 3 }], [1, '2', { c: 3 }], [1, '2', { c: 3 }])

function qqq() {
    logger.debug('debug', 'dads', {}, 111, true)
    logger.warn('warn')
    logger.error('error', 111)
}

qqq()