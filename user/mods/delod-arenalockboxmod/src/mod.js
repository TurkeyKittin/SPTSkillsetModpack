"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crafts_js_1 = require("./crafts.js");
class ArenaLockboxMod {
    postDBLoad(container) {
        // Init logger
        const logger = container.resolve("WinstonLogger");
        // Get database from server
        const databaseServer = container.resolve("DatabaseServer");
        const tables = databaseServer.getTables();
        let hideoutCrafts = tables.hideout.production.recipes;
        // Loop and add new crafts
        for (const newCraft of crafts_js_1.addedCrafts) {
            const alreadyAdded = hideoutCrafts.find((i) => i._id === newCraft._id);
            if (!alreadyAdded) {
                hideoutCrafts.push(newCraft);
            }
            else {
                hideoutCrafts = hideoutCrafts.filter(i => i._id !== newCraft._id);
                hideoutCrafts.push(newCraft);
            }
        }
        logger.info(`ALM: Added ${crafts_js_1.addedCrafts.length} new crafting recipes for Arena Lockboxes`);
    }
}
module.exports = { mod: new ArenaLockboxMod() };
//# sourceMappingURL=mod.js.map