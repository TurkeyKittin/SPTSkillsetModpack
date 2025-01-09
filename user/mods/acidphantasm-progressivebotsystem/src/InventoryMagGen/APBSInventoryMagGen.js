"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.APBSInventoryMagGen = void 0;
class APBSInventoryMagGen {
    magCounts;
    magazineTemplate;
    weaponTemplate;
    ammoTemplate;
    pmcInventory;
    botRole;
    botLevel;
    constructor(magCounts, magazineTemplate, weaponTemplate, ammoTemplate, pmcInventory, botRole, botLevel) {
        this.magCounts = magCounts;
        this.magazineTemplate = magazineTemplate;
        this.weaponTemplate = weaponTemplate;
        this.ammoTemplate = ammoTemplate;
        this.pmcInventory = pmcInventory;
        this.botRole = botRole;
        this.botLevel = botLevel;
    }
    getMagCount() {
        return this.magCounts;
    }
    getMagazineTemplate() {
        return this.magazineTemplate;
    }
    getWeaponTemplate() {
        return this.weaponTemplate;
    }
    getAmmoTemplate() {
        return this.ammoTemplate;
    }
    getPmcInventory() {
        return this.pmcInventory;
    }
    getBotRole() {
        return this.botRole;
    }
    getBotLevel() {
        return this.botLevel;
    }
}
exports.APBSInventoryMagGen = APBSInventoryMagGen;
//# sourceMappingURL=APBSInventoryMagGen.js.map