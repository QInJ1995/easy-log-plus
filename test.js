import { createLogger } from './dist/index.mjs'


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
logger.log()()('log', 'blue', 'hello world')
logger2.log(111)
logger.debug('debug', 'dads', {}, 111, true)
logger.info()('打印信息', 1, 2)
logger.info()()('打印信息2', 'red', 2, 4)
logger.warn('warn')
logger.error('error', 111)
logger.error('a->', { a: 1, b: { c: 2 } }, [1, '2', { c: 3 }], [1, '2', { c: 3 }], [1, '2', { c: 3 }], [1, '2', { c: 3 }], [1, '2', { c: 3 }])