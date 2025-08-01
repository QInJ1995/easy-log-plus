import localforage from 'localforage';
import { localConsoleError, localConsoleWarn } from '../../utils/common';
/**
 * LocalForage 封装工具类
 * 提供更简洁的 API 和统一的错误处理
 */
export default class LocalForageService {
    /**
     * LocalForage 配置选项
     */
    private config: any;

    /**
     * LocalForage 实例
     */
    private storage: any;

    /**
     * 构造函数
     * @param {Object} config - LocalForage 配置选项
     */
    constructor(config: LocalForageOptions = {}) {

        // 默认配置
        const defaultConfig = {
            driver: localforage.INDEXEDDB, // 使用 IndexedDB 作为默认存储驱动
            name: 'EasyLogPlus', // 存储库名称
            version: 1.0, // 存储库版本
        };

        // 合并配置
        this.config = { ...defaultConfig, ...config };

        // 初始化存储实例
        this.storage = localforage.createInstance(this.config);

        // 绑定上下文
        this.setItem = this.setItem.bind(this);
        this.getItem = this.getItem.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.clear = this.clear.bind(this);
        this.length = this.length.bind(this);
        this.keys = this.keys.bind(this);
        this.iterate = this.iterate.bind(this);
    }

    /**
     * 存储数据
     * @param {string} key - 存储键名
     * @param {any} value - 存储值（支持多种类型）
     * @returns {Promise<any>} - 返回存储的值
     */
    async setItem(key: string, value: any): Promise<any> {
        try {
            if (typeof key !== 'string') {
                localConsoleWarn(`[easy-log-plus]: ${this.config.storeName} store set key must be a string!`)
                return
            }
            await this.storage.setItem(key, value);
            return value;
        } catch (error) {
            localConsoleError(`[easy-log-plus]: ${this.config.storeName} store Failed to set ${key}:`, error);
        }
    }

    /**
     * 获取数据
     * @param {string} key - 存储键名
     * @returns {Promise<any>} - 返回获取的值
     */
    async getItem(key: string): Promise<any> {
        try {
            if (typeof key !== 'string') {
                localConsoleWarn(`[easy-log-plus]: ${this.config.storeName} store get key must be a string!`)
                return
            }
            return await this.storage.getItem(key);
        } catch (error) {
            localConsoleError(`[easy-log-plus]: ${this.config.storeName} store failed to get ${key}:`, error);
        }
    }

    /**
     * 删除指定键的数据
     * @param {string} key - 存储键名
     * @returns {Promise<void>}
     */
    async removeItem(key: string): Promise<void> {
        try {
            if (typeof key !== 'string') {
                localConsoleWarn(`[easy-log-plus]: ${this.config.storeName} store remove key must be a string!`)
                return
            }
            await this.storage.removeItem(key);
        } catch (error) {
            localConsoleError(`[easy-log-plus]: ${this.config.storeName} store failed to remove ${key}:`, error);
        }
    }

    /**
     * 清空所有存储数据
     * @returns {Promise<void>}
     */
    async clear(): Promise<void> {
        try {
            await this.storage.clear();
        } catch (error) {
            localConsoleError(`[easy-log-plus]: ${this.config.storeName} store failed to clear:`, error);
        }
    }

    /**
     * 获取存储的键值对数量
     * @returns {Promise<number>} - 返回键值对数量
     */
    async length(): Promise<number | void> {
        try {
            return await this.storage.length();
        } catch (error) {
            localConsoleError(`[easy-log-plus]: ${this.config.storeName} store failed to get length:`, error);
        }
    }

    /**
     * 获取所有存储的键名
     * @returns {Promise<Array<string>>} - 返回键名数组
     */
    async keys(): Promise<Array<string> | void> {
        try {
            return await this.storage.keys();
        } catch (error) {
            localConsoleError(`[easy-log-plus]: ${this.config.storeName} store failed to get keys:`, error);
        }
    }

    /**
     * 迭代所有存储的数据
     * @param {Function} callback - 迭代回调函数
     * @returns {Promise<any>} - 返回迭代结果
     */
    async iterate(callback: (value: any, key: string, index: number) => any): Promise<any> {
        try {
            if (typeof callback !== 'function') {
                localConsoleWarn(`[easy-log-plus]: ${this.config.storeName} store iterate callback must be a function!`)
                return
            }
            return await this.storage.iterate(callback);
        } catch (error) {
            localConsoleError(`[easy-log-plus]: ${this.config.storeName} store failed to iterate:`, error);
        }
    }

    /**
     * 创建一个新的存储实例
     * @param {Object} config - 新实例的配置
     * @returns {LocalForageService} - 返回新的实例
     */
    createInstance(config: LocalForageOptions): LocalForageService {
        return new LocalForageService(config);
    }
}

