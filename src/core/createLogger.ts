
import { LogOptions } from '../types';
import Logger from './Logger';
const createLogger = (namespace?: string, options?: LogOptions) => new Logger(namespace, options);


export default createLogger;