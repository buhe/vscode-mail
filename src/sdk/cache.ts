import { promises as fs } from "fs";
import * as path from 'path';
export default class Cache {
    private static CACHE_DIR = '.vsc-mail';
    private static CACHE_SPLIT_KEY = '\r\n.....cache.....\r\n';
    private vendor_cache_dir ;
    constructor(displayName: string) {
        this.vendor_cache_dir = [require('os').homedir(), Cache.CACHE_DIR, displayName].join(path.sep);
        fs.mkdir(this.vendor_cache_dir, { recursive: true });
    }

    private async exists(path: string) {
        try {
            await fs.access(path)
            return true
        } catch {
            return false
        }
    }
    /**
     * hasCache
uid: number : boolean    */
    public async hasCache(uid: number): Promise<boolean> {
        let fileName = [this.vendor_cache_dir, uid].join(path.sep);
        return await this.exists(fileName);
    }

    /**
     * cache
subject: string     */
    public async setCache(uid:number, subject: string, content: string) {
        let fileName = [this.vendor_cache_dir, uid].join(path.sep);
        let fileCotent = [subject, content].join(Cache.CACHE_SPLIT_KEY);
        await fs.writeFile(fileName, fileCotent);
    }

    /**
     * getCache
     */
    public async getCache(uid: number): Promise<string[]> {
        let fileName = [this.vendor_cache_dir, uid].join(path.sep);
        let fileCotent = await fs.readFile(fileName);
        let cacheFile = fileCotent.toString().split(Cache.CACHE_SPLIT_KEY);
        return [cacheFile[0], cacheFile[1]];
    }
}