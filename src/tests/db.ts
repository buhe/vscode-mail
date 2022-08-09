import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig'
describe('db', () => {
    it('init', async () => {
        let db = new JsonDB(new Config("/Users/guyanhua/.vsc-mail/myDataBase", true, false, '/'));

        // Pushing the data into the database
        // With the wanted DataPath
        // By default the push will override the old value
        await db.push("/test1", "super test");

        // Get the data from the root
        var data = await db.getData("/");

        console.info(data);

        // From a particular DataPath
        var data = await db.getData("/test1");

        console.info(data);

        await db.push("/arraytest/list", [1, 2, 3], true);

        await db.push("/arraytest/list[]", 4, true);

        var data = await db.getData("/arraytest/list");

        console.info(data);
    })
})