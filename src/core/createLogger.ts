
import { LogOptions } from '../types';
import Logger from './Logger';
const createLogger = (options?: LogOptions) => new Logger(options);


export default createLogger;