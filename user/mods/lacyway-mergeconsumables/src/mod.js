"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mod = void 0;
const CustomItemEventRouter_1 = require("./CustomItemEventRouter");
class Mod {
    preSptLoad(container) {
        container.registerType("IERouters", "CustomInventoryItemEventRouter");
        container.register("CustomInventoryItemEventRouter", {
            useClass: CustomItemEventRouter_1.CustomInventoryItemEventRouter
        });
    }
}
exports.mod = new Mod();
//# sourceMappingURL=mod.js.map