import { promises as fs } from "fs";
import * as path from 'path';
export default class Cache {
    private static CACHE_DIR = '.vsc-mail';
    private vendor_cache_dir ;
    constructor(displayName: string) {
        this.vendor_cache_dir = [require('os').homedir(), Cache.CACHE_DIR, displayName].join(path.sep);
        fs.mkdir(this.vendor_cache_dir, { recursive: true });
    }
    /**
     * hasCache
uid: number : boolean    */
    public async hasCache(uid: number): Promise<boolean> {
        return false;
    }

    /**
     * cache
subject: string     */
    public async setCache(uid:number, subject: string, content: string) {
        
    }

    /**
     * getCache
     */
    public async getCache(uid: number): Promise<string[]> {
        return [];
    }
}