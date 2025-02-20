"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mod = void 0;
class Mod {
    postSptLoad(container) {
        // get database from server
        const databaseServer = container.resolve("DatabaseServer");
        // Get all the in-memory json found in /assets/database
        const tables = databaseServer.getTables();
        // get the logger from the server container
        const logger = container.resolve("WinstonLogger");
        const reapir = tables.templates.items["5a1eaa87fcdbcb001865f75e"];
        reapir._props.Zooms[0] = [9.6, 1.2]; //zoom displayed in lower right corner. True zoom is x5.8 - x0.7
        reapir._props.AimSensitivity[0] = [0.112, 0.93]; //sensitivity change. Calculated based on true zoom.
        logger.info("Realistic Thermal Scopes loaded");
    }
}
exports.mod = new Mod();
//# sourceMappingURL=mod.js.map