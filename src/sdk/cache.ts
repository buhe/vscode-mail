export default class Cache {
    private static CACHE_DIR = '.vsc-mail';
    constructor(displayName: string) {
        
    }
    /**
     * hasCache
uid: number : boolean    */
    public hasCache(uid: number): boolean {
        return false;
    }

    /**
     * cache
subject: string     */
    public setCache(uid:number, subject: string, content: string) {
        
    }

    /**
     * getCache
     */
    public getCache(uid: number): string[] {
        return [];
    }
}