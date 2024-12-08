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
var _a, _b, _c, _d, _e, _f, _g;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModdedImportHelper = void 0;
/* eslint-disable @typescript-eslint/quotes */
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const ItemHelper_1 = require("C:/snapshot/project/obj/helpers/ItemHelper");
const BaseClasses_1 = require("C:/snapshot/project/obj/models/enums/BaseClasses");
const IDatabaseTables_1 = require("C:/snapshot/project/obj/models/spt/server/IDatabaseTables");
const DatabaseService_1 = require("C:/snapshot/project/obj/services/DatabaseService");
const ModConfig_1 = require("../Globals/ModConfig");
const VanillaItemLists_1 = require("../Globals/VanillaItemLists");
const APBSLogger_1 = require("../Utils/APBSLogger");
const Logging_1 = require("../Enums/Logging");
const APBSEquipmentGetter_1 = require("../Utils/APBSEquipmentGetter");
const TierInformation_1 = require("../Globals/TierInformation");
const APBSAttachmentChecker_1 = require("../Utils/APBSAttachmentChecker");
let ModdedImportHelper = class ModdedImportHelper {
    tables;
    databaseService;
    itemHelper;
    tierInformation;
    apbsEquipmentGetter;
    apbsAttachmentChecker;
    apbsLogger;
    blacklist;
    attachmentBlacklist;
    clothingBlacklist;
    constructor(tables, databaseService, itemHelper, tierInformation, apbsEquipmentGetter, apbsAttachmentChecker, apbsLogger) {
        this.tables = tables;
        this.databaseService = databaseService;
        this.itemHelper = itemHelper;
        this.tierInformation = tierInformation;
        this.apbsEquipmentGetter = apbsEquipmentGetter;
        this.apbsAttachmentChecker = apbsAttachmentChecker;
        this.apbsLogger = apbsLogger;
        this.blacklist = [
            "5ae083b25acfc4001a5fc702", //weapons
            "5e81ebcd8e146c7080625e15",
            "6217726288ed9f0845317459",
            "5d52cc5ba4b9367408500062",
            "620109578d82e67e7911abf2",
            "639af924d0446708ee62294e",
            "657857faeff4c850222dff1b",
            "639c3fbbd0446708ee622ee9",
            "62178be9d0050232da3485d9",
            "62178c4d4ecf221597654e3d",
            "624c0b3340357b5f566e8766",
            "5cdeb229d7f00c000e7ce174",
            "579204f224597773d619e051",
            "6275303a9f372d6ea97f9ec7",
            "66015072e9f84d5680039678",
            "59f9cabd86f7743a10721f46",
            "5abccb7dd8ce87001773e277",
            "5b3b713c5acfc4330140bd8d",
            "66d98233302686954b0c6f81",
            "66d9f1abb16d9aacf5068468",
            "56e33634d2720bd8058b456b", //backpacks
            "5e4abc6786f77406812bd572",
            "5e997f0b86f7741ac73993e2",
            "61b9e1aaef9a1b5d6a79899a",
            "61c18db6dfd64163ea78fbb4", //headwear
            "66bdc28a0b603c26902b2011",
            "65749cb8e0423b9ebe0c79c9",
            "60a7acf20c5cb24b01346648",
            "636270263f2495c26f00b007",
            "5a43943586f77416ad2f06e2",
            "5a43957686f7742a2c2f11b0",
            "65749ccf33fdc9c0cf06d3ca",
            "5a16bb52fcdbcb001a3b00dc",
            "628e4dd1f477aa12234918aa",
            "5c066ef40db834001966a595",
            "59ef13ca86f77445fd0e2483",
            "6531119b9afebff7ff0a1769"
        ];
        this.attachmentBlacklist = [
            "5c110624d174af029e69734c",
            "5d1b5e94d7ad1a2b865a96b0",
            "6478641c19d732620e045e17",
            "5a1eaa87fcdbcb001865f75e",
            "609bab8b455afd752b2e6138",
            "63fc44e2429a8a166c7f61e6",
            "5a1ead28fcdbcb001912fa9f",
            "63fc449f5bd61c6cf3784a88",
            "5b3b6dc75acfc47a8773fb1e",
            "5c11046cd174af02a012e42b",
            "544a3f024bdc2d1d388b4568",
            "544a3d0a4bdc2d1b388b4567",
            "5648b62b4bdc2d9d488b4585",
            "5c0e2ff6d174af02a1659d4a",
            "5c0e2f5cd174af02a012cfc9",
            "5c6592372e221600133e47d7",
            "544a378f4bdc2d30388b4567",
            "5d1340bdd7ad1a0e8d245aab",
            "671d85439ae8365d69117ba6",
            "670e8eab8c1bb0e5a7075acf",
            "671d8617a3e45c1f5908278c",
            "671d8ac8a3e45c1f59082799",
            "671d8b38b769f0d88c0950f8",
            "671d8b8c0959c721a50ca838"
        ];
        this.clothingBlacklist = [
            "668bc5cd834c88e06b08b645", // All of this is Artem hands, because they are being configured as Body instead...Crackboooonnneee!!
            "668bc5cd834c88e06b08b64a",
            "668bc5cd834c88e06b08b64d",
            "668bc5cd834c88e06b08b650",
            "668bc5cd834c88e06b08b652",
            "668bc5cd834c88e06b08b655",
            "668bc5cd834c88e06b08b658",
            "668bc5cd834c88e06b08b65b",
            "668bc5cd834c88e06b08b65e",
            "668bc5cd834c88e06b08b662",
            "668bc5cd834c88e06b08b665",
            "668bc5cd834c88e06b08b668",
            "668bc5cd834c88e06b08b66b",
            "668bc5cd834c88e06b08b66e",
            "668bc5cd834c88e06b08b671",
            "668bc5cd834c88e06b08b674",
            "668bc5cd834c88e06b08b677",
            "668bc5cd834c88e06b08b67a",
            "668bc5cd834c88e06b08b67d"
        ];
    }
    tiersTable = [];
    initialize() {
        if (ModConfig_1.ModConfig.config.initalTierAppearance < 1 || ModConfig_1.ModConfig.config.initalTierAppearance > 7) {
            this.apbsLogger.log(Logging_1.Logging.WARN, `Config value for "initialTierAppearance" is invalid. Must be 1-7. Currently configured for ${ModConfig_1.ModConfig.config.initalTierAppearance}`);
            return;
        }
        if (ModConfig_1.ModConfig.config.enableModdedWeapons)
            this.buildVanillaWeaponList();
        if (ModConfig_1.ModConfig.config.enableModdedEquipment)
            this.buildVanillaEquipmentList();
        if (ModConfig_1.ModConfig.config.enableModdedClothing)
            this.buildVanillaClothingList();
    }
    buildVanillaWeaponList() {
        this.apbsLogger.log(Logging_1.Logging.WARN, "Checking & importing Modded Weapons...Support not granted for this feature...");
        // Build the joined list for every weapon used in APBS
        const weapons = {};
        VanillaItemLists_1.vanillaItemList.equipment.LongRange.forEach(element => weapons[element] = this.getItem(element));
        VanillaItemLists_1.vanillaItemList.equipment.ShortRange.forEach(element => weapons[element] = this.getItem(element));
        VanillaItemLists_1.vanillaItemList.equipment.Holster.forEach(element => weapons[element] = this.getItem(element));
        VanillaItemLists_1.vanillaItemList.equipment.Scabbard.forEach(element => weapons[element] = this.getItem(element));
        // Push this list to the function to filter and import
        this.getModdedItems(weapons, BaseClasses_1.BaseClasses.WEAPON, "Weapons");
    }
    buildVanillaEquipmentList() {
        this.apbsLogger.log(Logging_1.Logging.WARN, "Checking & importing Modded Equipment...Support not granted for this feature...");
        // Build the joined list for every armour type used in APBS
        const armours = {};
        VanillaItemLists_1.vanillaItemList.equipment.ArmorVest.forEach(element => armours[element] = this.getItem(element));
        const headwear = {};
        VanillaItemLists_1.vanillaItemList.equipment.Headwear.forEach(element => headwear[element] = this.getItem(element));
        const tacticalVests = {};
        VanillaItemLists_1.vanillaItemList.equipment.TacticalVest.forEach(element => tacticalVests[element] = this.getItem(element));
        // Push these lists to the function to filter and import
        this.getModdedItems(armours, BaseClasses_1.BaseClasses.ARMOR, "Armours");
        this.getModdedItems(headwear, BaseClasses_1.BaseClasses.HEADWEAR, "Helmets");
        this.getModdedItems(tacticalVests, BaseClasses_1.BaseClasses.VEST, "Vests");
    }
    buildVanillaClothingList() {
        this.apbsLogger.log(Logging_1.Logging.WARN, "Checking & importing Modded Clothing...Support not granted for this feature...");
        // Build the joined list for every body & feet type used in APBS
        const body = {};
        VanillaItemLists_1.vanillaClothingList.appearance.body.forEach(element => body[element] = this.getCustomization(element));
        const feet = {};
        VanillaItemLists_1.vanillaClothingList.appearance.feet.forEach(element => feet[element] = this.getCustomization(element));
        // Push these lists to the function to filter and import
        this.getModdedClothing(body, "Body");
        this.getModdedClothing(feet, "Feet");
    }
    getModdedClothing(clothingList, className) {
        // Compare SPT database values to APBS values, filter down to the difference (assuming they are either modded, or not in the APBS database).
        const databaseClothing = Object.values(this.databaseService.getTables().templates.customization);
        const allClothing = databaseClothing.filter(x => this.isCustomization(x._id, className));
        const moddedClothing = Object.values(clothingList);
        const allApbsClothing = moddedClothing.filter(x => this.isCustomization(x._id, className));
        let clothingToBeImported = allClothing.filter(x => !allApbsClothing.includes(x));
        // Filter out blacklisted items
        for (const item of clothingToBeImported) {
            if (this.clothingBlacklist.includes(item._id))
                clothingToBeImported = clothingToBeImported.filter(id => id._id != item._id);
        }
        // Push clothing to APBS database
        if (clothingToBeImported.length > 0) {
            this.apbsLogger.log(Logging_1.Logging.WARN, `Importing ${clothingToBeImported.length} Modded ${className}...`);
            this.pushClothing(clothingToBeImported);
        }
    }
    pushClothing(clothingList) {
        // Loop each tier to add clothing to every tier
        for (const object in this.tierInformation.tiers) {
            const tierNumber = this.tierInformation.tiers[object].tier;
            const tierJson = this.apbsEquipmentGetter.getAppearanceJson(tierNumber, true);
            // Skip tiers based on configuration
            if (tierNumber < ModConfig_1.ModConfig.config.initalTierAppearance)
                continue;
            // Add each item from the clothing list to each tier JSON - this completes the import
            for (const item in clothingList) {
                if (clothingList[item]._props.Side.includes("Bear")) {
                    if (clothingList[item]._props.BodyPart == "Feet")
                        tierJson.pmcBEAR.appearance.feet[clothingList[item]._id] = 1;
                    if (clothingList[item]._props.BodyPart == "Body")
                        tierJson.pmcBEAR.appearance.body[clothingList[item]._id] = 1;
                }
                if (clothingList[item]._props.Side.includes("Usec")) {
                    if (clothingList[item]._props.BodyPart == "Feet")
                        tierJson.pmcUSEC.appearance.feet[clothingList[item]._id] = 1;
                    if (clothingList[item]._props.BodyPart == "Body")
                        tierJson.pmcUSEC.appearance.body[clothingList[item]._id] = 1;
                }
            }
        }
    }
    getModdedItems(equipmentList, baseClass, className) {
        // Compare SPT database values to APBS values, filter down to the difference (assuming they are either modded, or not in the APBS database).
        const items = Object.values(this.tables.templates.items);
        const allItems = items.filter(x => this.itemHelper.isOfBaseclass(x._id, baseClass));
        const tieredItems = Object.values(equipmentList);
        const allTieredItems = tieredItems.filter(x => this.itemHelper.isOfBaseclass(x._id, baseClass));
        let itemsToBeImported = allItems.filter(x => !allTieredItems.includes(x));
        // Filter out blacklisted items
        for (const item of itemsToBeImported) {
            if (this.blacklist.includes(item._id))
                itemsToBeImported = itemsToBeImported.filter(id => id._id != item._id);
        }
        // Push items to APBS database depending on if they are weapons or equipment
        if (itemsToBeImported.length > 0) {
            this.apbsLogger.log(Logging_1.Logging.WARN, `Importing ${itemsToBeImported.length} Modded ${className}...`);
            if (baseClass == BaseClasses_1.BaseClasses.WEAPON)
                this.getSetModdedWeaponDetails(itemsToBeImported);
            if (baseClass != BaseClasses_1.BaseClasses.WEAPON)
                this.getSetModdedEquipmentDetails(itemsToBeImported);
        }
    }
    getSetModdedWeaponDetails(weaponPool) {
        // Loop each weapon in the pool of weapons to be imported - push them individually
        for (const weapon in weaponPool) {
            const weaponParent = weaponPool[weapon]._parent;
            const weaponId = weaponPool[weapon]._id;
            const weaponSlots = weaponPool[weapon]?._props?.Slots;
            const weaponType = weaponPool[weapon]?._props?.weapUseType;
            // Push Weapon details to relevant pools
            this.pushCalibersToAmmoPools(weaponId);
            this.pushWeaponToTiers(weaponId, weaponType, weaponParent);
            this.pushItemAndPrimaryMods(weaponId, weaponSlots);
        }
    }
    getSetModdedEquipmentDetails(equipmentPool) {
        // Loop each equipment in the pool of equipment to be imported - push them individually
        for (const equipment in equipmentPool) {
            const equipmentParent = equipmentPool[equipment]._parent;
            const equipmentId = equipmentPool[equipment]._id;
            const equipmentSlots = equipmentPool[equipment]?._props?.Slots;
            const equipmentSlotsLength = equipmentPool[equipment]?._props?.Slots.length;
            const gridLength = equipmentPool[equipment]?._props?.Grids.length;
            let equipmentSlot;
            // Set equipmentSlot string to the proper value - this is only done to separate TacticalVests & ArmouredRigs
            if (equipmentParent == "5448e5284bdc2dcb718b4567" && (equipmentSlots.length == 0 || equipmentSlots == undefined))
                equipmentSlot = "TacticalVest";
            if (equipmentParent == "5448e5284bdc2dcb718b4567" && equipmentSlots.length >= 1)
                equipmentSlot = "ArmouredRig";
            if (equipmentParent == "5448e54d4bdc2dcc718b4568")
                equipmentSlot = "ArmorVest";
            if (equipmentParent == "5a341c4086f77401f2541505")
                equipmentSlot = "Headwear";
            // Push Equipment details to relevant pools
            this.pushEquipmentToTiers(equipmentId, equipmentSlot, gridLength, equipmentSlotsLength);
            this.pushItemAndPrimaryMods(equipmentId, equipmentSlots);
        }
    }
    pushWeaponToTiers(weaponId, weaponType, parentClass) {
        // Define weights to use, and which range they go to (for logging).
        let range = "";
        const pmcWeight = ModConfig_1.ModConfig.config.pmcWeaponWeights <= 0 ? 1 : ModConfig_1.ModConfig.config.pmcWeaponWeights;
        const scavWeight = ModConfig_1.ModConfig.config.scavWeaponWeights <= 0 ? 1 : ModConfig_1.ModConfig.config.scavWeaponWeights;
        const defaultWeight = ModConfig_1.ModConfig.config.followerWeaponWeights <= 0 ? 1 : ModConfig_1.ModConfig.config.followerWeaponWeights;
        // Loop over each tier to easily use the proper tierJSON
        for (const object in this.tierInformation.tiers) {
            const tierNumber = this.tierInformation.tiers[object].tier;
            const tierJson = this.apbsEquipmentGetter.getTierJson(tierNumber, true);
            // Skip tiers based on configuration
            if (tierNumber < ModConfig_1.ModConfig.config.initalTierAppearance)
                continue;
            // Use multiple variable switch to set specific weapon "types" to the correct pool
            switch (true) {
                case parentClass == "5447b5fc4bdc2d87278b4567" && weaponType == "primary":
                    tierJson.pmcUSEC.equipment.FirstPrimaryWeapon.LongRange[weaponId] = pmcWeight;
                    tierJson.pmcUSEC.equipment.FirstPrimaryWeapon.ShortRange[weaponId] = pmcWeight;
                    tierJson.pmcUSEC.equipment.SecondPrimaryWeapon.LongRange[weaponId] = pmcWeight;
                    tierJson.pmcUSEC.equipment.SecondPrimaryWeapon.ShortRange[weaponId] = pmcWeight;
                    tierJson.pmcBEAR.equipment.FirstPrimaryWeapon.LongRange[weaponId] = pmcWeight;
                    tierJson.pmcBEAR.equipment.FirstPrimaryWeapon.ShortRange[weaponId] = pmcWeight;
                    tierJson.pmcBEAR.equipment.SecondPrimaryWeapon.LongRange[weaponId] = pmcWeight;
                    tierJson.pmcBEAR.equipment.SecondPrimaryWeapon.ShortRange[weaponId] = pmcWeight;
                    tierJson.scav.equipment.FirstPrimaryWeapon.LongRange[weaponId] = scavWeight;
                    tierJson.scav.equipment.FirstPrimaryWeapon.ShortRange[weaponId] = scavWeight;
                    tierJson.scav.equipment.SecondPrimaryWeapon.LongRange[weaponId] = scavWeight;
                    tierJson.scav.equipment.SecondPrimaryWeapon.ShortRange[weaponId] = scavWeight;
                    tierJson.default.equipment.FirstPrimaryWeapon.LongRange[weaponId] = defaultWeight;
                    tierJson.default.equipment.FirstPrimaryWeapon.ShortRange[weaponId] = defaultWeight;
                    tierJson.default.equipment.SecondPrimaryWeapon.LongRange[weaponId] = defaultWeight;
                    tierJson.default.equipment.SecondPrimaryWeapon.ShortRange[weaponId] = defaultWeight;
                    range = "Long & Short range";
                    continue;
                case parentClass == "5447b6254bdc2dc3278b4568" && weaponType == "primary":
                case parentClass == "5447b6194bdc2d67278b4567" && weaponType == "primary":
                    tierJson.pmcUSEC.equipment.FirstPrimaryWeapon.LongRange[weaponId] = pmcWeight;
                    tierJson.pmcUSEC.equipment.SecondPrimaryWeapon.LongRange[weaponId] = pmcWeight;
                    tierJson.pmcBEAR.equipment.FirstPrimaryWeapon.LongRange[weaponId] = pmcWeight;
                    tierJson.pmcBEAR.equipment.SecondPrimaryWeapon.LongRange[weaponId] = pmcWeight;
                    tierJson.scav.equipment.FirstPrimaryWeapon.LongRange[weaponId] = scavWeight;
                    tierJson.scav.equipment.SecondPrimaryWeapon.LongRange[weaponId] = scavWeight;
                    tierJson.default.equipment.FirstPrimaryWeapon.LongRange[weaponId] = defaultWeight;
                    tierJson.default.equipment.SecondPrimaryWeapon.LongRange[weaponId] = defaultWeight;
                    range = "Long range";
                    continue;
                case parentClass == "5447b5f14bdc2d61278b4567" && weaponType == "primary":
                case parentClass == "5447bed64bdc2d97278b4568" && weaponType == "primary":
                case parentClass == "5447b5e04bdc2d62278b4567" && weaponType == "primary":
                case parentClass == "5447b5cf4bdc2d65278b4567" && weaponType == "primary":
                case parentClass == "617f1ef5e8b54b0998387733" && weaponType == "primary":
                case parentClass == "5447b6094bdc2dc3278b4567" && weaponType == "primary":
                    tierJson.pmcUSEC.equipment.FirstPrimaryWeapon.ShortRange[weaponId] = pmcWeight;
                    tierJson.pmcUSEC.equipment.SecondPrimaryWeapon.ShortRange[weaponId] = pmcWeight;
                    tierJson.pmcBEAR.equipment.FirstPrimaryWeapon.ShortRange[weaponId] = pmcWeight;
                    tierJson.pmcBEAR.equipment.SecondPrimaryWeapon.ShortRange[weaponId] = pmcWeight;
                    tierJson.scav.equipment.FirstPrimaryWeapon.ShortRange[weaponId] = scavWeight;
                    tierJson.scav.equipment.SecondPrimaryWeapon.ShortRange[weaponId] = scavWeight;
                    tierJson.default.equipment.FirstPrimaryWeapon.ShortRange[weaponId] = defaultWeight;
                    tierJson.default.equipment.SecondPrimaryWeapon.ShortRange[weaponId] = defaultWeight;
                    range = "Short range";
                    continue;
                case parentClass == "5447b5cf4bdc2d65278b4567" && weaponType == "secondary":
                case parentClass == "617f1ef5e8b54b0998387733" && weaponType == "secondary":
                case parentClass == "5447b6094bdc2dc3278b4567" && weaponType == "secondary":
                    tierJson.pmcUSEC.equipment.Holster[weaponId] = 5;
                    tierJson.pmcBEAR.equipment.Holster[weaponId] = 5;
                    tierJson.scav.equipment.Holster[weaponId] = 1;
                    tierJson.default.equipment.Holster[weaponId] = 3;
                    range = "Holster";
                    continue;
                default:
                    if (weaponType == "primary") {
                        tierJson.pmcUSEC.equipment.FirstPrimaryWeapon.LongRange[weaponId] = pmcWeight;
                        tierJson.pmcUSEC.equipment.FirstPrimaryWeapon.ShortRange[weaponId] = pmcWeight;
                        tierJson.pmcUSEC.equipment.SecondPrimaryWeapon.LongRange[weaponId] = pmcWeight;
                        tierJson.pmcUSEC.equipment.SecondPrimaryWeapon.ShortRange[weaponId] = pmcWeight;
                        tierJson.pmcBEAR.equipment.FirstPrimaryWeapon.LongRange[weaponId] = pmcWeight;
                        tierJson.pmcBEAR.equipment.FirstPrimaryWeapon.ShortRange[weaponId] = pmcWeight;
                        tierJson.pmcBEAR.equipment.SecondPrimaryWeapon.LongRange[weaponId] = pmcWeight;
                        tierJson.pmcBEAR.equipment.SecondPrimaryWeapon.ShortRange[weaponId] = pmcWeight;
                        tierJson.scav.equipment.FirstPrimaryWeapon.LongRange[weaponId] = scavWeight;
                        tierJson.scav.equipment.FirstPrimaryWeapon.ShortRange[weaponId] = scavWeight;
                        tierJson.scav.equipment.SecondPrimaryWeapon.LongRange[weaponId] = scavWeight;
                        tierJson.scav.equipment.SecondPrimaryWeapon.ShortRange[weaponId] = scavWeight;
                        tierJson.default.equipment.SecondPrimaryWeapon.LongRange[weaponId] = defaultWeight;
                        tierJson.default.equipment.SecondPrimaryWeapon.ShortRange[weaponId] = defaultWeight;
                        tierJson.default.equipment.FirstPrimaryWeapon.LongRange[weaponId] = defaultWeight;
                        tierJson.default.equipment.FirstPrimaryWeapon.ShortRange[weaponId] = defaultWeight;
                        range = "Long & Short range";
                    }
                    if (weaponType == "secondary") {
                        tierJson.pmcUSEC.equipment.Holster[weaponId] = 5;
                        tierJson.pmcBEAR.equipment.Holster[weaponId] = 5;
                        tierJson.scav.equipment.Holster[weaponId] = 1;
                        tierJson.default.equipment.Holster[weaponId] = 3;
                        range = "Holster";
                    }
                    continue;
            }
        }
        this.apbsLogger.log(Logging_1.Logging.DEBUG, `[Tier${ModConfig_1.ModConfig.config.initalTierAppearance}+] Added ${weaponId} to ${range} weapons.`);
    }
    pushEquipmentToTiers(itemID, equipmentSlot, gridLength, equipmentSlotsLength) {
        // Loop over each tier to easily use the proper tierJSON
        for (const object in this.tierInformation.tiers) {
            const tierNumber = this.tierInformation.tiers[object].tier;
            const tierJson = this.apbsEquipmentGetter.getTierJson(tierNumber, true);
            // Skip tiers based on configuration
            if (tierNumber < ModConfig_1.ModConfig.config.initalTierAppearance)
                continue;
            // Set weights based on witch slot they are in. Check TacticalVests for belts (low grid count) and check Helmets to see if armoured or decorative
            let weight;
            if (equipmentSlot == "TacticalVest" && gridLength > 10)
                weight = 10;
            if (equipmentSlot == "TacticalVest" && gridLength <= 10)
                weight = 1;
            if (equipmentSlot == "ArmouredRig")
                weight = 7;
            if (equipmentSlot == "ArmorVest")
                weight = 10;
            if (equipmentSlot == "Headwear" && equipmentSlotsLength > 0)
                weight = 6;
            if (equipmentSlot == "Headwear" && equipmentSlotsLength == 0)
                weight = 1;
            // Add the equipment to the proper slot and correct weight
            tierJson.pmcUSEC.equipment[equipmentSlot][itemID] = weight;
            tierJson.pmcBEAR.equipment[equipmentSlot][itemID] = weight;
            tierJson.scav.equipment[equipmentSlot][itemID] = 1;
            tierJson.default.equipment[equipmentSlot][itemID] = weight;
        }
        this.apbsLogger.log(Logging_1.Logging.DEBUG, `[Tier${ModConfig_1.ModConfig.config.initalTierAppearance}+] Added ${itemID} to ${equipmentSlot}.`);
    }
    pushItemAndPrimaryMods(itemID, itemSlots) {
        // Loop over all slots of the item
        for (const slot in itemSlots) {
            const slotName = itemSlots[slot]?._name;
            const slotFilter = itemSlots[slot]?._props?.filters[0]?.Filter;
            // Loop over all items in the filter for the slot
            for (const item in slotFilter) {
                const slotFilterItem = slotFilter[item];
                // Check if the item is actually a valid item, or is on the blacklist
                // WTT puts itemIDs in their mods that don't exist in the database for some reason (probably unreleased mods)
                const itemExistsCheck = this.itemHelper.getItem(slotFilterItem);
                if (this.attachmentBlacklist.includes(slotFilterItem) || !itemExistsCheck[0])
                    continue;
                // Check if the itemID already exists in the tierJsons, if not - create it in them all.
                if (this.tierInformation.tier1mods[itemID] == undefined) {
                    this.tierInformation.tier1mods[itemID] = {};
                    this.tierInformation.tier2mods[itemID] = {};
                    this.tierInformation.tier3mods[itemID] = {};
                    this.tierInformation.tier4mods[itemID] = {};
                    this.tierInformation.tier5mods[itemID] = {};
                    this.tierInformation.tier6mods[itemID] = {};
                    this.tierInformation.tier7mods[itemID] = {};
                }
                // Check if the itemID's slot already exists in the tierJsons, if not - create it in them all.
                if (this.tierInformation.tier1mods[itemID][slotName] == undefined) {
                    this.tierInformation.tier1mods[itemID][slotName] = [];
                    this.tierInformation.tier2mods[itemID][slotName] = [];
                    this.tierInformation.tier3mods[itemID][slotName] = [];
                    this.tierInformation.tier4mods[itemID][slotName] = [];
                    this.tierInformation.tier5mods[itemID][slotName] = [];
                    this.tierInformation.tier6mods[itemID][slotName] = [];
                    this.tierInformation.tier7mods[itemID][slotName] = [];
                }
                // Check if the itemID's slot doesn't already contain the item to import, if it doesn't - add it
                if (!this.tierInformation.tier1mods[itemID][slotName].includes(slotFilterItem)) {
                    this.tierInformation.tier1mods[itemID][slotName].push(slotFilterItem);
                    this.tierInformation.tier2mods[itemID][slotName].push(slotFilterItem);
                    this.tierInformation.tier3mods[itemID][slotName].push(slotFilterItem);
                    this.tierInformation.tier4mods[itemID][slotName].push(slotFilterItem);
                    this.tierInformation.tier5mods[itemID][slotName].push(slotFilterItem);
                    this.tierInformation.tier6mods[itemID][slotName].push(slotFilterItem);
                    this.tierInformation.tier7mods[itemID][slotName].push(slotFilterItem);
                    // Push any children mods
                    this.recursivePushChildrenMods(slotFilterItem);
                }
            }
        }
    }
    recursivePushChildrenMods(parentSlotFilterItem) {
        const parentSlotItemData = this.getItem(parentSlotFilterItem);
        const parentSlotItemID = parentSlotItemData?._id;
        const parentSlotSlots = parentSlotItemData?._props?.Slots;
        // Exit if there are no children
        if (parentSlotSlots == undefined || parentSlotSlots.length == 0)
            return;
        // Loop over all slots of the parent
        for (const slot in parentSlotSlots) {
            const slotName = parentSlotSlots[slot]?._name;
            let slotFilter = parentSlotSlots[slot]?._props?.filters[0]?.Filter;
            // If a slot's filters contain the canted sight mount, remove all other items from the filter - this ensures ONLY the canted sight is added
            if (slotFilter.includes("5649a2464bdc2d91118b45a8")) {
                slotFilter = ["5649a2464bdc2d91118b45a8"];
            }
            // Loop over each item in the slot's filters
            for (const item in slotFilter) {
                const slotFilterItem = parentSlotSlots[slot]?._props?.filters[0]?.Filter[item];
                const itemExistsCheck = this.itemHelper.getItem(slotFilterItem);
                // Check if the item is actually a valid item, or is on the blacklist
                // WTT puts itemIDs in their mods that don't exist in the database for some reason (probably unreleased mods)
                if (this.attachmentBlacklist.includes(slotFilterItem) || !itemExistsCheck[0])
                    continue;
                // Check if the parent mod & the child mod are vanilla or modded
                // This allows preventing mods adding vanilla mods to vanilla weapons
                const isVanillaParent = this.apbsAttachmentChecker.isVanillaItem(parentSlotItemID);
                const isVanillaItem = this.apbsAttachmentChecker.isVanillaItem(slotFilterItem);
                // Check if the PARENT itemID already exists in the tierJsons, if not - create it in all tierJSONs.
                if (this.tierInformation.tier1mods[parentSlotItemID] == undefined) {
                    this.tierInformation.tier1mods[parentSlotItemID] = {};
                    this.tierInformation.tier2mods[parentSlotItemID] = {};
                    this.tierInformation.tier3mods[parentSlotItemID] = {};
                    this.tierInformation.tier4mods[parentSlotItemID] = {};
                    this.tierInformation.tier5mods[parentSlotItemID] = {};
                    this.tierInformation.tier6mods[parentSlotItemID] = {};
                    this.tierInformation.tier7mods[parentSlotItemID] = {};
                }
                // Check if the PARENT itemID already exists with the slotName, if not - create it in all tierJSONs
                if (this.tierInformation.tier1mods[parentSlotItemID][slotName] == undefined) {
                    this.tierInformation.tier1mods[parentSlotItemID][slotName] = [];
                    this.tierInformation.tier2mods[parentSlotItemID][slotName] = [];
                    this.tierInformation.tier3mods[parentSlotItemID][slotName] = [];
                    this.tierInformation.tier4mods[parentSlotItemID][slotName] = [];
                    this.tierInformation.tier5mods[parentSlotItemID][slotName] = [];
                    this.tierInformation.tier6mods[parentSlotItemID][slotName] = [];
                    this.tierInformation.tier7mods[parentSlotItemID][slotName] = [];
                }
                // Check if the PARENT itemID's slot doesn't already contain the item to import
                if (!this.tierInformation.tier1mods[parentSlotItemID][slotName].includes(slotFilterItem)) {
                    // Additionally, check if the parent mod & child mod are vanilla as well as checking the config safeguard
                    if (isVanillaParent && isVanillaItem && ModConfig_1.ModConfig.config.enableSafeGuard)
                        continue;
                    // Finally push the child mod to the proper tierJSONs
                    this.tierInformation.tier1mods[parentSlotItemID][slotName].push(slotFilterItem);
                    this.tierInformation.tier2mods[parentSlotItemID][slotName].push(slotFilterItem);
                    this.tierInformation.tier3mods[parentSlotItemID][slotName].push(slotFilterItem);
                    this.tierInformation.tier4mods[parentSlotItemID][slotName].push(slotFilterItem);
                    this.tierInformation.tier5mods[parentSlotItemID][slotName].push(slotFilterItem);
                    this.tierInformation.tier6mods[parentSlotItemID][slotName].push(slotFilterItem);
                    this.tierInformation.tier7mods[parentSlotItemID][slotName].push(slotFilterItem);
                    // Push any children mods
                    this.recursivePushChildrenMods(slotFilterItem);
                }
            }
        }
    }
    pushCalibersToAmmoPools(itemID) {
        const itemDetails = this.itemHelper.getItem(itemID);
        const itemCaliber = itemDetails[1]?._props?.ammoCaliber;
        // Check if the Caliber exists on tierJSON or is valid
        if (!Object.keys(this.tierInformation.tier1ammo.scavAmmo).includes(itemCaliber) && itemCaliber != undefined) {
            const chamberFilter = itemDetails[1]?._props?.Chambers[0]?._props?.filters[0]?.Filter;
            // If the chamber is valid and has items, add them to the tierJSONs
            if (chamberFilter && chamberFilter.length > 0) {
                for (const botPool in this.tierInformation.tier1ammo) {
                    // Since the Caliber doesn't exist, create them empty to prevent undefined error below
                    this.tierInformation.tier1ammo[botPool][itemCaliber] = {};
                    this.tierInformation.tier2ammo[botPool][itemCaliber] = {};
                    this.tierInformation.tier3ammo[botPool][itemCaliber] = {};
                    this.tierInformation.tier4ammo[botPool][itemCaliber] = {};
                    this.tierInformation.tier5ammo[botPool][itemCaliber] = {};
                    this.tierInformation.tier6ammo[botPool][itemCaliber] = {};
                    this.tierInformation.tier7ammo[botPool][itemCaliber] = {};
                    // Push each item in the filter to the tierJSON
                    for (const item in chamberFilter) {
                        const ammo = chamberFilter[item];
                        this.tierInformation.tier1ammo[botPool][itemCaliber][ammo] = 1;
                        this.tierInformation.tier2ammo[botPool][itemCaliber][ammo] = 1;
                        this.tierInformation.tier3ammo[botPool][itemCaliber][ammo] = 1;
                        this.tierInformation.tier4ammo[botPool][itemCaliber][ammo] = 1;
                        this.tierInformation.tier5ammo[botPool][itemCaliber][ammo] = 1;
                        this.tierInformation.tier6ammo[botPool][itemCaliber][ammo] = 1;
                        this.tierInformation.tier7ammo[botPool][itemCaliber][ammo] = 1;
                    }
                }
            }
        }
    }
    getItem(tpl) {
        if (tpl in this.databaseService.getItems()) {
            return this.databaseService.getItems()[tpl];
        }
        return undefined;
    }
    getCustomization(tpl) {
        if (tpl in this.databaseService.getCustomization()) {
            return this.databaseService.getCustomization()[tpl];
        }
        return undefined;
    }
    isCustomization(tpl, type) {
        if (tpl in this.databaseService.getCustomization()) {
            const item = this.databaseService.getCustomization()[tpl];
            if (item._props.Side == undefined) {
                return false;
            }
            if (item._props.Side.includes("Bear") || item._props.Side.includes("Usec")) {
                if (item._props.BodyPart == type) {
                    return true;
                }
                return false;
            }
        }
        return false;
    }
};
exports.ModdedImportHelper = ModdedImportHelper;
exports.ModdedImportHelper = ModdedImportHelper = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IDatabaseTables")),
    __param(1, (0, tsyringe_1.inject)("DatabaseService")),
    __param(2, (0, tsyringe_1.inject)("ItemHelper")),
    __param(3, (0, tsyringe_1.inject)("TierInformation")),
    __param(4, (0, tsyringe_1.inject)("APBSEquipmentGetter")),
    __param(5, (0, tsyringe_1.inject)("APBSAttachmentChecker")),
    __param(6, (0, tsyringe_1.inject)("APBSLogger")),
    __metadata("design:paramtypes", [typeof (_a = typeof IDatabaseTables_1.IDatabaseTables !== "undefined" && IDatabaseTables_1.IDatabaseTables) === "function" ? _a : Object, typeof (_b = typeof DatabaseService_1.DatabaseService !== "undefined" && DatabaseService_1.DatabaseService) === "function" ? _b : Object, typeof (_c = typeof ItemHelper_1.ItemHelper !== "undefined" && ItemHelper_1.ItemHelper) === "function" ? _c : Object, typeof (_d = typeof TierInformation_1.TierInformation !== "undefined" && TierInformation_1.TierInformation) === "function" ? _d : Object, typeof (_e = typeof APBSEquipmentGetter_1.APBSEquipmentGetter !== "undefined" && APBSEquipmentGetter_1.APBSEquipmentGetter) === "function" ? _e : Object, typeof (_f = typeof APBSAttachmentChecker_1.APBSAttachmentChecker !== "undefined" && APBSAttachmentChecker_1.APBSAttachmentChecker) === "function" ? _f : Object, typeof (_g = typeof APBSLogger_1.APBSLogger !== "undefined" && APBSLogger_1.APBSLogger) === "function" ? _g : Object])
], ModdedImportHelper);
//# sourceMappingURL=ModdedImportHelper.js.map