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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlacklistHelper = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const APBSEquipmentGetter_1 = require("../Utils/APBSEquipmentGetter");
const DatabaseService_1 = require("C:/snapshot/project/obj/services/DatabaseService");
const APBSLogger_1 = require("../Utils/APBSLogger");
const Logging_1 = require("../Enums/Logging");
const ModConfig_1 = require("../Globals/ModConfig");
let BlacklistHelper = class BlacklistHelper {
    database;
    apbsEquipmentGetter;
    apbsLogger;
    constructor(database, apbsEquipmentGetter, apbsLogger) {
        this.database = database;
        this.apbsEquipmentGetter = apbsEquipmentGetter;
        this.apbsLogger = apbsLogger;
    }
    initialize() {
        if (ModConfig_1.ModConfig.config.tier1AmmoBlacklist.length > 0)
            this.removeBlacklistedAmmo(ModConfig_1.ModConfig.config.tier1AmmoBlacklist, 1);
        if (ModConfig_1.ModConfig.config.tier2AmmoBlacklist.length > 0)
            this.removeBlacklistedAmmo(ModConfig_1.ModConfig.config.tier2AmmoBlacklist, 2);
        if (ModConfig_1.ModConfig.config.tier3AmmoBlacklist.length > 0)
            this.removeBlacklistedAmmo(ModConfig_1.ModConfig.config.tier3AmmoBlacklist, 3);
        if (ModConfig_1.ModConfig.config.tier4AmmoBlacklist.length > 0)
            this.removeBlacklistedAmmo(ModConfig_1.ModConfig.config.tier4AmmoBlacklist, 4);
        if (ModConfig_1.ModConfig.config.tier5AmmoBlacklist.length > 0)
            this.removeBlacklistedAmmo(ModConfig_1.ModConfig.config.tier5AmmoBlacklist, 5);
        if (ModConfig_1.ModConfig.config.tier6AmmoBlacklist.length > 0)
            this.removeBlacklistedAmmo(ModConfig_1.ModConfig.config.tier6AmmoBlacklist, 6);
        if (ModConfig_1.ModConfig.config.tier7AmmoBlacklist.length > 0)
            this.removeBlacklistedAmmo(ModConfig_1.ModConfig.config.tier7AmmoBlacklist, 7);
        if (ModConfig_1.ModConfig.config.tier1EquipmentBlacklist.length > 0)
            this.removeBlacklistedEquipment(ModConfig_1.ModConfig.config.tier1EquipmentBlacklist, 1);
        if (ModConfig_1.ModConfig.config.tier2EquipmentBlacklist.length > 0)
            this.removeBlacklistedEquipment(ModConfig_1.ModConfig.config.tier2EquipmentBlacklist, 2);
        if (ModConfig_1.ModConfig.config.tier3EquipmentBlacklist.length > 0)
            this.removeBlacklistedEquipment(ModConfig_1.ModConfig.config.tier3EquipmentBlacklist, 3);
        if (ModConfig_1.ModConfig.config.tier4EquipmentBlacklist.length > 0)
            this.removeBlacklistedEquipment(ModConfig_1.ModConfig.config.tier4EquipmentBlacklist, 4);
        if (ModConfig_1.ModConfig.config.tier5EquipmentBlacklist.length > 0)
            this.removeBlacklistedEquipment(ModConfig_1.ModConfig.config.tier5EquipmentBlacklist, 5);
        if (ModConfig_1.ModConfig.config.tier6EquipmentBlacklist.length > 0)
            this.removeBlacklistedEquipment(ModConfig_1.ModConfig.config.tier6EquipmentBlacklist, 6);
        if (ModConfig_1.ModConfig.config.tier7EquipmentBlacklist.length > 0)
            this.removeBlacklistedEquipment(ModConfig_1.ModConfig.config.tier7EquipmentBlacklist, 7);
        if (ModConfig_1.ModConfig.config.tier1WeaponBlacklist.length > 0)
            this.removeBlacklistedWeapons(ModConfig_1.ModConfig.config.tier1WeaponBlacklist, 1);
        if (ModConfig_1.ModConfig.config.tier2WeaponBlacklist.length > 0)
            this.removeBlacklistedWeapons(ModConfig_1.ModConfig.config.tier2WeaponBlacklist, 2);
        if (ModConfig_1.ModConfig.config.tier3WeaponBlacklist.length > 0)
            this.removeBlacklistedWeapons(ModConfig_1.ModConfig.config.tier3WeaponBlacklist, 3);
        if (ModConfig_1.ModConfig.config.tier4WeaponBlacklist.length > 0)
            this.removeBlacklistedWeapons(ModConfig_1.ModConfig.config.tier4WeaponBlacklist, 4);
        if (ModConfig_1.ModConfig.config.tier5WeaponBlacklist.length > 0)
            this.removeBlacklistedWeapons(ModConfig_1.ModConfig.config.tier5WeaponBlacklist, 5);
        if (ModConfig_1.ModConfig.config.tier6WeaponBlacklist.length > 0)
            this.removeBlacklistedWeapons(ModConfig_1.ModConfig.config.tier6WeaponBlacklist, 6);
        if (ModConfig_1.ModConfig.config.tier7WeaponBlacklist.length > 0)
            this.removeBlacklistedWeapons(ModConfig_1.ModConfig.config.tier7WeaponBlacklist, 7);
        if (ModConfig_1.ModConfig.config.tier1AttachmentBlacklist.length > 0)
            this.removeBlacklistedAttachments(ModConfig_1.ModConfig.config.tier1AttachmentBlacklist, 1);
        if (ModConfig_1.ModConfig.config.tier2AttachmentBlacklist.length > 0)
            this.removeBlacklistedAttachments(ModConfig_1.ModConfig.config.tier2AttachmentBlacklist, 2);
        if (ModConfig_1.ModConfig.config.tier3AttachmentBlacklist.length > 0)
            this.removeBlacklistedAttachments(ModConfig_1.ModConfig.config.tier3AttachmentBlacklist, 3);
        if (ModConfig_1.ModConfig.config.tier4AttachmentBlacklist.length > 0)
            this.removeBlacklistedAttachments(ModConfig_1.ModConfig.config.tier4AttachmentBlacklist, 4);
        if (ModConfig_1.ModConfig.config.tier5AttachmentBlacklist.length > 0)
            this.removeBlacklistedAttachments(ModConfig_1.ModConfig.config.tier5AttachmentBlacklist, 5);
        if (ModConfig_1.ModConfig.config.tier6AttachmentBlacklist.length > 0)
            this.removeBlacklistedAttachments(ModConfig_1.ModConfig.config.tier6AttachmentBlacklist, 6);
        if (ModConfig_1.ModConfig.config.tier7AttachmentBlacklist.length > 0)
            this.removeBlacklistedAttachments(ModConfig_1.ModConfig.config.tier7AttachmentBlacklist, 7);
    }
    removeBlacklistedAmmo(ammoBlacklist, tier) {
        const tierJSON = this.apbsEquipmentGetter.getTierAmmoJson(tier, true);
        for (const item in ammoBlacklist) {
            const itemDetails = this.getItem(ammoBlacklist[item]);
            if (itemDetails != undefined && itemDetails._parent == "5485a8684bdc2da71d8b4567") {
                for (const botType in tierJSON) {
                    for (const ammo in tierJSON[botType]) {
                        if (Object.keys(tierJSON[botType][ammo]).includes(itemDetails._id)) {
                            if (Object.keys(tierJSON[botType][ammo]).length > 1) {
                                delete tierJSON[botType][ammo][itemDetails._id];
                                this.apbsLogger.log(Logging_1.Logging.DEBUG, `[Tier${tier}] Removed "${itemDetails._id}" from "${botType}" ${ammo} pool.`);
                                continue;
                            }
                            this.apbsLogger.log(Logging_1.Logging.WARN, `Did not blacklist "${itemDetails._id}" as it would make the Tier${tier} "${botType}" ${ammo} pool empty`);
                            continue;
                        }
                    }
                }
            }
            if (itemDetails == undefined || itemDetails._parent != "5485a8684bdc2da71d8b4567") {
                this.apbsLogger.log(Logging_1.Logging.WARN, `"${ammoBlacklist[item]}" in Ammo Blacklist is either an invalid ammunition or item ID.`);
            }
        }
    }
    removeBlacklistedEquipment(equipmentBlacklist, tier) {
        const tierJSON = this.apbsEquipmentGetter.getTierJson(tier, true);
        for (const item in equipmentBlacklist) {
            const itemDetails = this.getItem(equipmentBlacklist[item]);
            if (itemDetails != undefined) {
                for (const botType in tierJSON) {
                    for (const equipmentSlot in tierJSON[botType].equipment) {
                        if (Object.keys(tierJSON[botType].equipment[equipmentSlot]).includes(itemDetails._id)) {
                            if (Object.keys(tierJSON[botType].equipment[equipmentSlot]).length > 1) {
                                delete tierJSON[botType].equipment[equipmentSlot][itemDetails._id];
                                this.apbsLogger.log(Logging_1.Logging.DEBUG, `[Tier${tier}] Removed "${itemDetails._id}" from "${botType}" ${equipmentSlot} pool.`);
                                continue;
                            }
                            this.apbsLogger.log(Logging_1.Logging.WARN, `Did not blacklist "${itemDetails._id}" as it would make the Tier${tier} "${botType}" ${equipmentSlot} pool empty.`);
                            continue;
                        }
                    }
                }
            }
            if (itemDetails == undefined) {
                this.apbsLogger.log(Logging_1.Logging.WARN, `"${equipmentBlacklist[item]}" in Equipment Blacklist is an invalid item ID.`);
            }
        }
    }
    removeBlacklistedWeapons(weaponBlacklist, tier) {
        const tierJSON = this.apbsEquipmentGetter.getTierJson(tier, true);
        for (const item in weaponBlacklist) {
            const itemDetails = this.getItem(weaponBlacklist[item]);
            if (itemDetails != undefined) {
                for (const botType in tierJSON) {
                    for (const equipmentSlot in tierJSON[botType].equipment.FirstPrimaryWeapon) {
                        if (Object.keys(tierJSON[botType].equipment.FirstPrimaryWeapon[equipmentSlot]).includes(itemDetails._id)) {
                            if (Object.keys(tierJSON[botType].equipment.FirstPrimaryWeapon[equipmentSlot]).length > 1) {
                                delete tierJSON[botType].equipment.FirstPrimaryWeapon[equipmentSlot][itemDetails._id];
                                this.apbsLogger.log(Logging_1.Logging.DEBUG, `[Tier${tier}] Removed "${itemDetails._id}" from "${botType}" ${equipmentSlot} pool.`);
                                continue;
                            }
                            this.apbsLogger.log(Logging_1.Logging.WARN, `Did not blacklist "${itemDetails._id}" as it would make the Tier${tier} "${botType}" ${equipmentSlot} pool empty.`);
                            continue;
                        }
                    }
                    for (const equipmentSlot in tierJSON[botType].equipment.SecondPrimaryWeapon) {
                        if (Object.keys(tierJSON[botType].equipment.SecondPrimaryWeapon[equipmentSlot]).includes(itemDetails._id)) {
                            if (Object.keys(tierJSON[botType].equipment.SecondPrimaryWeapon[equipmentSlot]).length > 1) {
                                delete tierJSON[botType].equipment.SecondPrimaryWeapon[equipmentSlot][itemDetails._id];
                                this.apbsLogger.log(Logging_1.Logging.DEBUG, `[Tier${tier}] Removed "${itemDetails._id}" from "${botType}" ${equipmentSlot} pool.`);
                                continue;
                            }
                            this.apbsLogger.log(Logging_1.Logging.WARN, `Did not blacklist "${itemDetails._id}" as it would make the Tier${tier} "${botType}" ${equipmentSlot} pool empty.`);
                            continue;
                        }
                    }
                    if (Object.keys(tierJSON[botType].equipment.Holster).includes(itemDetails._id)) {
                        if (Object.keys(tierJSON[botType].equipment.Holster).length > 1) {
                            delete tierJSON[botType].equipment.Holster[itemDetails._id];
                            this.apbsLogger.log(Logging_1.Logging.DEBUG, `[Tier${tier}] Removed "${itemDetails._id}" from "${botType}" Holster pool.`);
                            continue;
                        }
                        this.apbsLogger.log(Logging_1.Logging.WARN, `Did not blacklist "${itemDetails._id}" as it would make the Tier${tier} "${botType}" Holster pool empty.`);
                        continue;
                    }
                    if (Object.keys(tierJSON[botType].equipment.Scabbard).includes(itemDetails._id)) {
                        if (Object.keys(tierJSON[botType].equipment.Scabbard).length > 1) {
                            delete tierJSON[botType].equipment.Scabbard[itemDetails._id];
                            this.apbsLogger.log(Logging_1.Logging.DEBUG, `[Tier${tier}] Removed "${itemDetails._id}" from "${botType}" Scabbard pool.`);
                            continue;
                        }
                        this.apbsLogger.log(Logging_1.Logging.WARN, `Did not blacklist "${itemDetails._id}" as it would make the Tier${tier} "${botType}" Scabbard pool empty.`);
                        continue;
                    }
                }
            }
            if (itemDetails == undefined) {
                this.apbsLogger.log(Logging_1.Logging.WARN, `"${weaponBlacklist[item]}" in Weapon Blacklist is an invalid item ID.`);
            }
        }
    }
    removeBlacklistedAttachments(attachmentBlacklist, tier) {
        const tierJSON = this.apbsEquipmentGetter.getTierModsJson(tier, true);
        for (const item in attachmentBlacklist) {
            const itemDetails = this.getItem(attachmentBlacklist[item]);
            if (itemDetails != undefined) {
                for (const parentID in tierJSON) {
                    const parentItemName = this.getItem(parentID);
                    const parentItemID = tierJSON[parentID];
                    for (const slotName in parentItemID) {
                        const itemSlotName = tierJSON[parentID][slotName];
                        if (itemSlotName.includes(itemDetails._id)) {
                            if (itemSlotName.length == 1) {
                                delete tierJSON[parentID][slotName];
                                this.apbsLogger.log(Logging_1.Logging.DEBUG, `[Tier${tier}] Removed slot "${slotName}" from "${parentItemName._name}" because array is now empty.`);
                                continue;
                            }
                            const index = itemSlotName.indexOf(itemDetails._id);
                            if (index > -1) {
                                itemSlotName.splice(index, 1);
                                this.apbsLogger.log(Logging_1.Logging.DEBUG, `[Tier${tier}] Removed "${itemDetails._id}" from "${parentItemName._name}" slot "${slotName}".`);
                                continue;
                            }
                        }
                    }
                }
            }
            if (itemDetails == undefined) {
                this.apbsLogger.log(Logging_1.Logging.WARN, `"${attachmentBlacklist[item]}" in Attachment Blacklist is either an invalid attachment or item ID.`);
            }
        }
    }
    getItem(tpl) {
        if (tpl in this.database.getItems()) {
            return this.database.getItems()[tpl];
        }
        return undefined;
    }
};
exports.BlacklistHelper = BlacklistHelper;
exports.BlacklistHelper = BlacklistHelper = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("DatabaseService")),
    __param(1, (0, tsyringe_1.inject)("APBSEquipmentGetter")),
    __param(2, (0, tsyringe_1.inject)("APBSLogger")),
    __metadata("design:paramtypes", [typeof (_a = typeof DatabaseService_1.DatabaseService !== "undefined" && DatabaseService_1.DatabaseService) === "function" ? _a : Object, typeof (_b = typeof APBSEquipmentGetter_1.APBSEquipmentGetter !== "undefined" && APBSEquipmentGetter_1.APBSEquipmentGetter) === "function" ? _b : Object, typeof (_c = typeof APBSLogger_1.APBSLogger !== "undefined" && APBSLogger_1.APBSLogger) === "function" ? _c : Object])
], BlacklistHelper);
//# sourceMappingURL=BlacklistHelper.js.map