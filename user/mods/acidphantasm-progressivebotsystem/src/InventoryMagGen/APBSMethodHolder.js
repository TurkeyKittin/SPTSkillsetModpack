"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.APBSMethodHolder = void 0;
const ItemHelper_1 = require("C:/snapshot/project/obj/helpers/ItemHelper");
const WeightedRandomHelper_1 = require("C:/snapshot/project/obj/helpers/WeightedRandomHelper");
const ILogger_1 = require("C:/snapshot/project/obj/models/spt/utils/ILogger");
const LocalisationService_1 = require("C:/snapshot/project/obj/services/LocalisationService");
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
let APBSMethodHolder = class APBSMethodHolder {
    logger;
    localisationService;
    weightedRandomHelper;
    itemHelper;
    constructor(logger, localisationService, weightedRandomHelper, itemHelper) {
        this.logger = logger;
        this.localisationService = localisationService;
        this.weightedRandomHelper = weightedRandomHelper;
        this.itemHelper = itemHelper;
    }
    getWeightedCompatibleAmmo(cartridgePool, weaponTemplate) {
        const desiredCaliber = this.getWeaponCaliber(weaponTemplate);
        const cartridgePoolForWeapon = cartridgePool[desiredCaliber];
        if (!cartridgePoolForWeapon || cartridgePoolForWeapon?.length === 0) {
            this.logger.debug(this.localisationService.getText("bot-no_caliber_data_for_weapon_falling_back_to_default", {
                weaponId: weaponTemplate._id,
                weaponName: weaponTemplate._name,
                defaultAmmo: weaponTemplate._props.defAmmo
            }));
            // Immediately returns, default ammo is guaranteed to be compatible
            return weaponTemplate._props.defAmmo;
        }
        // Get cartridges the weapons first chamber allow
        const compatibleCartridgesInTemplate = this.getCompatibleCartridgesFromWeaponTemplate(weaponTemplate);
        if (!compatibleCartridgesInTemplate) {
            // No chamber data found in weapon, send default
            return weaponTemplate._props.defAmmo;
        }
        // Inner join the weapons allowed + passed in cartridge pool to get compatible cartridges
        const compatibleCartridges = Object.keys(cartridgePoolForWeapon)
            .filter((cartridge) => compatibleCartridgesInTemplate.includes(cartridge))
            .reduce((acc, key) => ({ ...acc, [key]: cartridgePoolForWeapon[key] }), {});
        if (!compatibleCartridges) {
            // No compatible cartridges, use default
            return weaponTemplate._props.defAmmo;
        }
        return this.weightedRandomHelper.getWeightedValue(compatibleCartridges);
    }
    getWeaponCaliber(weaponTemplate) {
        if (weaponTemplate._props.Caliber) {
            return weaponTemplate._props.Caliber;
        }
        if (weaponTemplate._props.ammoCaliber) {
            // 9x18pmm has a typo, should be Caliber9x18PM
            return weaponTemplate._props.ammoCaliber === "Caliber9x18PMM"
                ? "Caliber9x18PM"
                : weaponTemplate._props.ammoCaliber;
        }
        if (weaponTemplate._props.LinkedWeapon) {
            const ammoInChamber = this.itemHelper.getItem(weaponTemplate._props.Chambers[0]._props.filters[0].Filter[0]);
            if (!ammoInChamber[0]) {
                return;
            }
            return ammoInChamber[1]._props.Caliber;
        }
    }
    getCompatibleCartridgesFromWeaponTemplate(weaponTemplate) {
        let cartridges = weaponTemplate._props.Chambers[0]?._props?.filters[0]?.Filter;
        if (!cartridges) {
            // Fallback to the magazine if possible, e.g. for revolvers
            //  Grab the magazines template
            const firstMagazine = weaponTemplate._props.Slots.find((slot) => slot._name === "mod_magazine");
            const magazineTemplate = this.itemHelper.getItem(firstMagazine._props.filters[0].Filter[0]);
            // Get the first slots array of cartridges
            cartridges = magazineTemplate[1]._props.Slots[0]?._props.filters[0].Filter;
            if (!cartridges) {
                // Normal magazines
                // None found, try the cartridges array
                cartridges = magazineTemplate[1]._props.Cartridges[0]?._props.filters[0].Filter;
            }
        }
        return cartridges;
    }
};
exports.APBSMethodHolder = APBSMethodHolder;
exports.APBSMethodHolder = APBSMethodHolder = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("PrimaryLogger")),
    __param(1, (0, tsyringe_1.inject)("LocalisationService")),
    __param(2, (0, tsyringe_1.inject)("WeightedRandomHelper")),
    __param(3, (0, tsyringe_1.inject)("ItemHelper")),
    __metadata("design:paramtypes", [typeof (_a = typeof ILogger_1.ILogger !== "undefined" && ILogger_1.ILogger) === "function" ? _a : Object, typeof (_b = typeof LocalisationService_1.LocalisationService !== "undefined" && LocalisationService_1.LocalisationService) === "function" ? _b : Object, typeof (_c = typeof WeightedRandomHelper_1.WeightedRandomHelper !== "undefined" && WeightedRandomHelper_1.WeightedRandomHelper) === "function" ? _c : Object, typeof (_d = typeof ItemHelper_1.ItemHelper !== "undefined" && ItemHelper_1.ItemHelper) === "function" ? _d : Object])
], APBSMethodHolder);
//# sourceMappingURL=APBSMethodHolder.js.map