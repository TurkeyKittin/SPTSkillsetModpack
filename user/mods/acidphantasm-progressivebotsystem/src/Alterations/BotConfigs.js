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
var _a, _b, _c, _d, _e, _f, _g, _h;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BotConfigs = void 0;
/* eslint-disable @typescript-eslint/naming-convention */
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const IDatabaseTables_1 = require("C:/snapshot/project/obj/models/spt/server/IDatabaseTables");
const ConfigServer_1 = require("C:/snapshot/project/obj/servers/ConfigServer");
const ConfigTypes_1 = require("C:/snapshot/project/obj/models/enums/ConfigTypes");
const DatabaseService_1 = require("C:/snapshot/project/obj/services/DatabaseService");
const BaseClasses_1 = require("C:/snapshot/project/obj/models/enums/BaseClasses");
const ItemHelper_1 = require("C:/snapshot/project/obj/helpers/ItemHelper");
const APBSEquipmentGetter_1 = require("../Utils/APBSEquipmentGetter");
const TierInformation_1 = require("../Globals/TierInformation");
const RaidInformation_1 = require("../Globals/RaidInformation");
const ModConfig_1 = require("../Globals/ModConfig");
const APBSLogger_1 = require("../Utils/APBSLogger");
const Logging_1 = require("../Enums/Logging");
let BotConfigs = class BotConfigs {
    tables;
    database;
    configServer;
    itemHelper;
    apbsEquipmentGetter;
    tierInformation;
    raidInformation;
    apbsLogger;
    botConfig;
    pmcConfig;
    constructor(tables, database, configServer, itemHelper, apbsEquipmentGetter, tierInformation, raidInformation, apbsLogger) {
        this.tables = tables;
        this.database = database;
        this.configServer = configServer;
        this.itemHelper = itemHelper;
        this.apbsEquipmentGetter = apbsEquipmentGetter;
        this.tierInformation = tierInformation;
        this.raidInformation = raidInformation;
        this.apbsLogger = apbsLogger;
        this.botConfig = this.configServer.getConfig(ConfigTypes_1.ConfigTypes.BOT);
        this.pmcConfig = this.configServer.getConfig(ConfigTypes_1.ConfigTypes.PMC);
    }
    initialize() {
        this.clearNoLongerNeededBotDetails();
        this.configureBotExperienceLevels();
        this.configurePlateWeightings();
        this.configureWeaponDurability();
        this.adjustNVG();
        this.setLootItemResourceRandomization();
        this.setPMCItemLimits();
        this.setPMCLoot();
        this.setPMCScopeWhitelist();
        this.setPMCSlotIDsToMakeRequired();
        if (ModConfig_1.ModConfig.config.gameVersionWeight)
            this.setPMCGameVersionWeights();
        if (ModConfig_1.ModConfig.config.addAllKeysToScavs || ModConfig_1.ModConfig.config.addOnlyKeyCardsToScavs || ModConfig_1.ModConfig.config.addOnlyMechanicalKeysToScavs)
            this.pushScavKeys();
        if (ModConfig_1.ModConfig.config.enableCustomPlateChances)
            this.setPlateChances();
        if (ModConfig_1.ModConfig.config.forceStock)
            this.setForceStock();
        if (ModConfig_1.ModConfig.config.forceDustCover)
            this.setForceDustCover();
        if (ModConfig_1.ModConfig.config.forceScopeSlot)
            this.setForceScopes();
        if (ModConfig_1.ModConfig.config.forceWeaponModLimits)
            this.setWeaponModLimits();
        if (!ModConfig_1.ModConfig.config.scavLoot)
            this.removeScavLoot();
        if (ModConfig_1.ModConfig.config.enableScavEqualEquipmentTiering)
            this.setIdenticalScavWeights();
        this.removeThermalGoggles(ModConfig_1.ModConfig.config.enableT7Thermals);
        if (ModConfig_1.ModConfig.config.enableCustomLevelDeltas)
            this.setLevelDeltas();
        if (ModConfig_1.ModConfig.config.enableScavCustomLevelDeltas)
            this.setScavLevelDeltas();
    }
    configureBotExperienceLevels() {
        const botTypeTable = this.tables.bots.types;
        for (const botType in botTypeTable) {
            botTypeTable[botType].experience.level.min = 1;
            botTypeTable[botType].experience.level.max = 79;
        }
    }
    configurePlateWeightings() {
        const botConfigEquipment = this.botConfig.equipment;
        for (const botType in botConfigEquipment) {
            if (botType.includes("assault") || botType.includes("marksman")) {
                botConfigEquipment[botType].filterPlatesByLevel = true;
                botConfigEquipment[botType].armorPlateWeighting = this.tierInformation.scavArmorPlateWeights;
                continue;
            }
            botConfigEquipment[botType].filterPlatesByLevel = true;
            botConfigEquipment[botType].armorPlateWeighting = this.tierInformation.armorPlateWeights;
        }
    }
    clearNoLongerNeededBotDetails() {
        const botConfigEquipment = this.botConfig.equipment;
        for (const botType in botConfigEquipment) {
            botConfigEquipment[botType].randomisation = [];
            botConfigEquipment[botType].weightingAdjustmentsByBotLevel = [];
        }
    }
    configureWeaponDurability() {
        // Do this better in the future - this looks like shit. Bad Acid. Bad.
        const botConfigDurability = this.botConfig.durability;
        for (const botType in botConfigDurability) {
            if (botType == "pmc") {
                botConfigDurability[botType].weapon.lowestMax = ModConfig_1.ModConfig.config.pmcWeaponDurability[0];
                botConfigDurability[botType].weapon.highestMax = ModConfig_1.ModConfig.config.pmcWeaponDurability[1];
                botConfigDurability[botType].weapon.minDelta = ModConfig_1.ModConfig.config.pmcWeaponDurability[2];
                botConfigDurability[botType].weapon.maxDelta = ModConfig_1.ModConfig.config.pmcWeaponDurability[3];
                botConfigDurability[botType].weapon.minLimitPercent = 40;
            }
            if (botType == "boss" || botType == "arenafighterevent" || botType == "arenafighter" || botType == "sectantpriest" || botType == "sectantwarrior") {
                botConfigDurability[botType].weapon.lowestMax = ModConfig_1.ModConfig.config.bossWeaponDurability[0];
                botConfigDurability[botType].weapon.highestMax = ModConfig_1.ModConfig.config.bossWeaponDurability[1];
                botConfigDurability[botType].weapon.minDelta = ModConfig_1.ModConfig.config.bossWeaponDurability[2];
                botConfigDurability[botType].weapon.maxDelta = ModConfig_1.ModConfig.config.bossWeaponDurability[3];
                botConfigDurability[botType].weapon.minLimitPercent = 40;
            }
            if (botType == "assault" || botType == "cursedassault" || botType == "marksman" || botType == "crazyassaultevent" || botType == "default") {
                botConfigDurability[botType].weapon.lowestMax = ModConfig_1.ModConfig.config.scavWeaponDurability[0];
                botConfigDurability[botType].weapon.highestMax = ModConfig_1.ModConfig.config.scavWeaponDurability[1];
                botConfigDurability[botType].weapon.minDelta = ModConfig_1.ModConfig.config.scavWeaponDurability[2];
                botConfigDurability[botType].weapon.maxDelta = ModConfig_1.ModConfig.config.scavWeaponDurability[3];
                botConfigDurability[botType].weapon.minLimitPercent = 40;
            }
            if (botType == "follower") {
                botConfigDurability[botType].weapon.lowestMax = ModConfig_1.ModConfig.config.guardWeaponDurability[0];
                botConfigDurability[botType].weapon.highestMax = ModConfig_1.ModConfig.config.guardWeaponDurability[1];
                botConfigDurability[botType].weapon.minDelta = ModConfig_1.ModConfig.config.guardWeaponDurability[2];
                botConfigDurability[botType].weapon.maxDelta = ModConfig_1.ModConfig.config.guardWeaponDurability[3];
                botConfigDurability[botType].weapon.minLimitPercent = 40;
            }
            if (botType == "pmcbot" || botType == "exusec") {
                botConfigDurability[botType].weapon.lowestMax = ModConfig_1.ModConfig.config.raiderWeaponDurability[0];
                botConfigDurability[botType].weapon.highestMax = ModConfig_1.ModConfig.config.raiderWeaponDurability[1];
                botConfigDurability[botType].weapon.minDelta = ModConfig_1.ModConfig.config.raiderWeaponDurability[2];
                botConfigDurability[botType].weapon.maxDelta = ModConfig_1.ModConfig.config.raiderWeaponDurability[3];
                botConfigDurability[botType].weapon.minLimitPercent = 40;
            }
        }
    }
    adjustNVG() {
        const botConfigEquipment = this.botConfig.equipment;
        for (const botType in botConfigEquipment) {
            botConfigEquipment[botType].faceShieldIsActiveChancePercent = 90;
            botConfigEquipment[botType].lightIsActiveDayChancePercent = 7;
            botConfigEquipment[botType].lightIsActiveNightChancePercent = 25;
            botConfigEquipment[botType].laserIsActiveChancePercent = 50;
            botConfigEquipment[botType].nvgIsActiveChanceDayPercent = 0;
            botConfigEquipment[botType].nvgIsActiveChanceNightPercent = 95;
        }
    }
    setForceStock() {
        for (const tierObject in this.tierInformation.tiers) {
            const tierNumber = this.tierInformation.tiers[tierObject].tier;
            const tierJson = this.apbsEquipmentGetter.getTierChancesJson(tierNumber);
            for (const botType in this.tierInformation.tier1chances) {
                const chances = tierJson[botType].chances;
                for (const weaponType in chances) {
                    chances[weaponType]["mod_stock"] = 100;
                    chances[weaponType]["mod_stock_000"] = 100;
                    chances[weaponType]["mod_stock_001"] = 100;
                    chances[weaponType]["mod_stock_akms"] = 100;
                    chances[weaponType]["mod_stock_axis"] = 100;
                }
            }
        }
    }
    setForceDustCover() {
        for (const tierObject in this.tierInformation.tiers) {
            const tierNumber = this.tierInformation.tiers[tierObject].tier;
            const tierJson = this.apbsEquipmentGetter.getTierChancesJson(tierNumber);
            for (const botType in this.tierInformation.tier1chances) {
                const chances = tierJson[botType].chances;
                for (const weaponType in chances) {
                    chances[weaponType]["mod_reciever"] = 100;
                }
            }
        }
    }
    setForceScopes() {
        for (const tierObject in this.tierInformation.tiers) {
            const tierNumber = this.tierInformation.tiers[tierObject].tier;
            const tierJson = this.apbsEquipmentGetter.getTierChancesJson(tierNumber);
            for (const botType in this.tierInformation.tier1chances) {
                const chances = tierJson[botType].chances;
                for (const weaponType in chances) {
                    chances[weaponType]["mod_scope"] = 100;
                }
            }
        }
    }
    setPlateChances() {
        for (const tierObject in this.tierInformation.tiers) {
            const tierNumber = this.tierInformation.tiers[tierObject].tier;
            const tierJson = this.apbsEquipmentGetter.getTierChancesJson(tierNumber);
            for (const botType in this.tierInformation.tier1chances) {
                if (botType == "pmcUSEC" || botType == "pmcBEAR") {
                    tierJson[botType].chances.equipmentMods["back_plate"] = tierJson[botType].chances.equipmentMods["front_plate"] = ModConfig_1.ModConfig.config.pmcMainPlateChance[tierObject];
                    tierJson[botType].chances.equipmentMods["left_side_plate"] = tierJson[botType].chances.equipmentMods["right_side_plate"] = ModConfig_1.ModConfig.config.pmcSidePlateChance[tierObject];
                }
                if (botType == "followerbirdeye" || botType == "followerbigpipe" || botType.includes("boss") || botType.includes("sectant")) {
                    tierJson[botType].chances.equipmentMods["back_plate"] = tierJson[botType].chances.equipmentMods["front_plate"] = ModConfig_1.ModConfig.config.bossMainPlateChance[tierObject];
                    tierJson[botType].chances.equipmentMods["left_side_plate"] = tierJson[botType].chances.equipmentMods["right_side_plate"] = ModConfig_1.ModConfig.config.bossSidePlateChance[tierObject];
                }
                if (botType == "scav") {
                    tierJson[botType].chances.equipmentMods["back_plate"] = tierJson[botType].chances.equipmentMods["front_plate"] = ModConfig_1.ModConfig.config.scavMainPlateChance[tierObject];
                    tierJson[botType].chances.equipmentMods["left_side_plate"] = tierJson[botType].chances.equipmentMods["right_side_plate"] = ModConfig_1.ModConfig.config.scavSidePlateChance[tierObject];
                }
                if (botType == "exusec" || botType == "pmcbot") {
                    tierJson[botType].chances.equipmentMods["back_plate"] = tierJson[botType].chances.equipmentMods["front_plate"] = ModConfig_1.ModConfig.config.raiderMainPlateChance[tierObject];
                    tierJson[botType].chances.equipmentMods["left_side_plate"] = tierJson[botType].chances.equipmentMods["right_side_plate"] = ModConfig_1.ModConfig.config.raiderSidePlateChance[tierObject];
                }
                if (botType == "default") {
                    tierJson[botType].chances.equipmentMods["back_plate"] = tierJson[botType].chances.equipmentMods["front_plate"] = ModConfig_1.ModConfig.config.guardMainPlateChance[tierObject];
                    tierJson[botType].chances.equipmentMods["left_side_plate"] = tierJson[botType].chances.equipmentMods["right_side_plate"] = ModConfig_1.ModConfig.config.guardSidePlateChance[tierObject];
                }
            }
        }
    }
    setWeaponModLimits() {
        const botConfigEquipment = this.botConfig.equipment;
        for (const botType in botConfigEquipment) {
            if (botConfigEquipment[botType].weaponModLimits == undefined) {
                botConfigEquipment[botType].weaponModLimits =
                    {
                        "scopeLimit": 2,
                        "lightLaserLimit": 1
                    };
            }
            botConfigEquipment[botType].weaponModLimits.scopeLimit = ModConfig_1.ModConfig.config.scopeLimit;
            botConfigEquipment[botType].weaponModLimits.lightLaserLimit = ModConfig_1.ModConfig.config.tacticalLimit;
        }
    }
    setLootItemResourceRandomization() {
        // Chance it is 100% full
        let scavFoodMaxChance = 100;
        let scavMedMaxChance = 100;
        let pmcFoodMaxChance = 100;
        let pmcMedMaxChance = 100;
        // Minimum resource amount
        let scavFoodResourcePercent = 60;
        let scavMedResourcePercent = 60;
        let pmcFoodResourcePercent = 60;
        let pmcMedResourcePercent = 60;
        // Check if enabled, if so - change to values in config
        if (ModConfig_1.ModConfig.config.enableConsumableResourceRandomization) {
            scavFoodMaxChance = ModConfig_1.ModConfig.config.scavFoodRates[0];
            scavMedMaxChance = ModConfig_1.ModConfig.config.scavMedRates[0];
            pmcFoodMaxChance = ModConfig_1.ModConfig.config.pmcFoodRates[0];
            pmcMedMaxChance = ModConfig_1.ModConfig.config.pmcMedRates[0];
            scavFoodResourcePercent = ModConfig_1.ModConfig.config.scavFoodRates[1];
            scavMedResourcePercent = ModConfig_1.ModConfig.config.scavMedRates[1];
            pmcFoodResourcePercent = ModConfig_1.ModConfig.config.pmcFoodRates[1];
            pmcMedResourcePercent = ModConfig_1.ModConfig.config.pmcMedRates[1];
        }
        // Set values in botConfig
        this.botConfig.lootItemResourceRandomization.assault = { "food": { "chanceMaxResourcePercent": scavFoodMaxChance, "resourcePercent": scavFoodResourcePercent }, "meds": { "chanceMaxResourcePercent": scavMedMaxChance, "resourcePercent": scavMedResourcePercent } };
        this.botConfig.lootItemResourceRandomization.marksman = { "food": { "chanceMaxResourcePercent": scavFoodMaxChance, "resourcePercent": scavFoodResourcePercent }, "meds": { "chanceMaxResourcePercent": scavMedMaxChance, "resourcePercent": scavMedResourcePercent } };
        this.botConfig.lootItemResourceRandomization.pmcusec = { "food": { "chanceMaxResourcePercent": pmcFoodMaxChance, "resourcePercent": pmcFoodResourcePercent }, "meds": { "chanceMaxResourcePercent": pmcMedMaxChance, "resourcePercent": pmcMedResourcePercent } };
        this.botConfig.lootItemResourceRandomization.pmcbear = { "food": { "chanceMaxResourcePercent": pmcFoodMaxChance, "resourcePercent": pmcFoodResourcePercent }, "meds": { "chanceMaxResourcePercent": pmcMedMaxChance, "resourcePercent": pmcMedResourcePercent } };
        this.botConfig.lootItemResourceRandomization.pmc = { "food": { "chanceMaxResourcePercent": pmcFoodMaxChance, "resourcePercent": pmcFoodResourcePercent }, "meds": { "chanceMaxResourcePercent": pmcMedMaxChance, "resourcePercent": pmcMedResourcePercent } };
    }
    setPMCItemLimits() {
        this.botConfig.itemSpawnLimits.pmc["60098ad7c2240c0fe85c570a"] = 1;
        this.botConfig.itemSpawnLimits.pmc["590c678286f77426c9660122"] = 1;
        this.botConfig.itemSpawnLimits.pmc["5e831507ea0a7c419c2f9bd9"] = 1;
        this.botConfig.itemSpawnLimits.pmc["590c661e86f7741e566b646a"] = 1;
        this.botConfig.itemSpawnLimits.pmc["544fb45d4bdc2dee738b4568"] = 1;
        this.botConfig.itemSpawnLimits.pmc["5e8488fa988a8701445df1e4"] = 1;
        this.botConfig.itemSpawnLimits.pmc["544fb37f4bdc2dee738b4567"] = 1;
        this.botConfig.itemSpawnLimits.pmc["5448e8d04bdc2ddf718b4569"] = 1;
        this.botConfig.itemSpawnLimits.pmc["5448e8d64bdc2dce718b4568"] = 1;
    }
    setPMCLoot() {
        this.pmcConfig.looseWeaponInBackpackLootMinMax.min = 0;
        this.pmcConfig.looseWeaponInBackpackLootMinMax.max = 0;
        if (ModConfig_1.ModConfig.config.pmcLoot) {
            for (const level in this.tierInformation.lootRandomization) {
                this.tierInformation.lootRandomization[level].generation.backpackLoot.weights["0"] = 1;
                this.tierInformation.lootRandomization[level].generation.backpackLoot.weights["3"] = 2;
                this.tierInformation.lootRandomization[level].generation.backpackLoot.weights["5"] = 5;
                this.tierInformation.lootRandomization[level].generation.backpackLoot.weights["8"] = 6;
                this.tierInformation.lootRandomization[level].generation.backpackLoot.weights["10"] = 5;
                this.tierInformation.lootRandomization[level].generation.backpackLoot.weights["12"] = 4;
                this.tierInformation.lootRandomization[level].generation.backpackLoot.weights["15"] = 4;
                this.tierInformation.lootRandomization[level].generation.backpackLoot.weights["20"] = 3;
                this.tierInformation.lootRandomization[level].generation.backpackLoot.weights["23"] = 1;
                this.tierInformation.lootRandomization[level].generation.pocketLoot.weights["0"] = 1;
                this.tierInformation.lootRandomization[level].generation.pocketLoot.weights["1"] = 3;
                this.tierInformation.lootRandomization[level].generation.pocketLoot.weights["2"] = 4;
                this.tierInformation.lootRandomization[level].generation.pocketLoot.weights["3"] = 2;
                this.tierInformation.lootRandomization[level].generation.pocketLoot.weights["4"] = 1;
                this.tierInformation.lootRandomization[level].generation.vestLoot.weights["0"] = 1;
                this.tierInformation.lootRandomization[level].generation.vestLoot.weights["1"] = 2;
                this.tierInformation.lootRandomization[level].generation.vestLoot.weights["2"] = 3;
                this.tierInformation.lootRandomization[level].generation.vestLoot.weights["3"] = 2;
                this.tierInformation.lootRandomization[level].generation.vestLoot.weights["4"] = 1;
            }
            for (const tierObject in this.tierInformation.tiers) {
                const tierNumber = this.tierInformation.tiers[tierObject].tier;
                const tierJson = this.apbsEquipmentGetter.getTierChancesJson(tierNumber);
                tierJson.pmcUSEC.chances.generation.items.backpackLoot.weights["0"] = 4;
                tierJson.pmcUSEC.chances.generation.items.backpackLoot.weights["1"] = 15;
                tierJson.pmcUSEC.chances.generation.items.backpackLoot.weights["2"] = 40;
                tierJson.pmcUSEC.chances.generation.items.backpackLoot.weights["3"] = 10;
                tierJson.pmcUSEC.chances.generation.items.backpackLoot.weights["4"] = 8;
                tierJson.pmcUSEC.chances.generation.items.backpackLoot.weights["5"] = 2;
                tierJson.pmcUSEC.chances.generation.items.backpackLoot.weights["10"] = 1;
                tierJson.pmcBEAR.chances.generation.items.backpackLoot.weights["0"] = 4;
                tierJson.pmcBEAR.chances.generation.items.backpackLoot.weights["1"] = 15;
                tierJson.pmcBEAR.chances.generation.items.backpackLoot.weights["2"] = 40;
                tierJson.pmcBEAR.chances.generation.items.backpackLoot.weights["3"] = 10;
                tierJson.pmcBEAR.chances.generation.items.backpackLoot.weights["4"] = 8;
                tierJson.pmcBEAR.chances.generation.items.backpackLoot.weights["5"] = 2;
                tierJson.pmcBEAR.chances.generation.items.backpackLoot.weights["10"] = 1;
                tierJson.pmcUSEC.chances.generation.items.pocketLoot.weights["0"] = 4;
                tierJson.pmcUSEC.chances.generation.items.pocketLoot.weights["1"] = 9;
                tierJson.pmcUSEC.chances.generation.items.pocketLoot.weights["2"] = 1;
                tierJson.pmcUSEC.chances.generation.items.pocketLoot.weights["3"] = 1;
                tierJson.pmcBEAR.chances.generation.items.pocketLoot.weights["0"] = 4;
                tierJson.pmcBEAR.chances.generation.items.pocketLoot.weights["1"] = 9;
                tierJson.pmcBEAR.chances.generation.items.pocketLoot.weights["2"] = 1;
                tierJson.pmcBEAR.chances.generation.items.pocketLoot.weights["3"] = 1;
                tierJson.pmcUSEC.chances.generation.items.vestLoot.weights["0"] = 2;
                tierJson.pmcUSEC.chances.generation.items.vestLoot.weights["1"] = 12;
                tierJson.pmcUSEC.chances.generation.items.vestLoot.weights["2"] = 1;
                tierJson.pmcUSEC.chances.generation.items.vestLoot.weights["3"] = 1;
                tierJson.pmcUSEC.chances.generation.items.vestLoot.weights["4"] = 1;
                tierJson.pmcBEAR.chances.generation.items.vestLoot.weights["0"] = 2;
                tierJson.pmcBEAR.chances.generation.items.vestLoot.weights["1"] = 12;
                tierJson.pmcBEAR.chances.generation.items.vestLoot.weights["2"] = 1;
                tierJson.pmcBEAR.chances.generation.items.vestLoot.weights["3"] = 1;
                tierJson.pmcBEAR.chances.generation.items.vestLoot.weights["4"] = 1;
            }
            this.botConfig.equipment.pmc.randomisation = this.tierInformation.lootRandomization;
        }
        else {
            this.botConfig.equipment.pmc.randomisation = this.tierInformation.lootRandomization;
        }
    }
    setPMCScopeWhitelist() {
        this.botConfig.equipment.pmc.weaponSightWhitelist = {
            "5447b5fc4bdc2d87278b4567": [
                "55818ad54bdc2ddc698b4569",
                "55818acf4bdc2dde698b456b",
                "55818ae44bdc2dde698b456c",
                "55818ac54bdc2d5b648b456e",
                "55818add4bdc2d5b648b456f",
                "55818aeb4bdc2ddc698b456a"
            ],
            "5447b5f14bdc2d61278b4567": [
                "55818ad54bdc2ddc698b4569",
                "55818acf4bdc2dde698b456b",
                "55818ae44bdc2dde698b456c",
                "55818ac54bdc2d5b648b456e",
                "55818add4bdc2d5b648b456f",
                "55818aeb4bdc2ddc698b456a"
            ],
            "5447bedf4bdc2d87278b4568": [
                "55818ad54bdc2ddc698b4569",
                "55818add4bdc2d5b648b456f",
                "55818ac54bdc2d5b648b456e",
                "55818aeb4bdc2ddc698b456a"
            ],
            "5447bed64bdc2d97278b4568": [
                "55818ad54bdc2ddc698b4569",
                "55818acf4bdc2dde698b456b",
                "55818ac54bdc2d5b648b456e",
                "55818add4bdc2d5b648b456f",
                "55818aeb4bdc2ddc698b456a"
            ],
            "5447b6194bdc2d67278b4567": [
                "55818ad54bdc2ddc698b4569",
                "55818ae44bdc2dde698b456c",
                "55818ac54bdc2d5b648b456e",
                "55818aeb4bdc2ddc698b456a",
                "55818add4bdc2d5b648b456f"
            ],
            "5447b5cf4bdc2d65278b4567": [
                "55818ad54bdc2ddc698b4569",
                "55818acf4bdc2dde698b456b",
                "55818ac54bdc2d5b648b456e"
            ],
            "617f1ef5e8b54b0998387733": [
                "55818ad54bdc2ddc698b4569",
                "55818acf4bdc2dde698b456b",
                "55818ac54bdc2d5b648b456e"
            ],
            "5447b6094bdc2dc3278b4567": [
                "55818ad54bdc2ddc698b4569",
                "55818acf4bdc2dde698b456b",
                "55818ac54bdc2d5b648b456e"
            ],
            "5447b5e04bdc2d62278b4567": [
                "55818ad54bdc2ddc698b4569",
                "55818acf4bdc2dde698b456b",
                "55818ac54bdc2d5b648b456e"
            ],
            "5447b6254bdc2dc3278b4568": [
                "55818ae44bdc2dde698b456c",
                "55818ac54bdc2d5b648b456e",
                "55818aeb4bdc2ddc698b456a",
                "55818add4bdc2d5b648b456f"
            ]
        };
    }
    pushScavKeys() {
        const scavBackpack = this.tables.bots.types.assault.inventory.items.Backpack;
        const items = Object.values(this.tables.templates.items);
        const baseClass = this.getKeyConfig();
        const allKeys = items.filter(x => this.itemHelper.isOfBaseclass(x._id, baseClass));
        let count = 0;
        for (const key in allKeys) {
            if (scavBackpack[allKeys[key]._id] == undefined) {
                scavBackpack[allKeys[key]._id] = 1;
                count++;
            }
        }
        this.apbsLogger.log(Logging_1.Logging.DEBUG, `Added ${count} keys to Scav Backpacks (Key Class Added: ${baseClass})`);
    }
    getKeyConfig() {
        if (ModConfig_1.ModConfig.config.addAllKeysToScavs)
            return BaseClasses_1.BaseClasses.KEY;
        if (ModConfig_1.ModConfig.config.addOnlyMechanicalKeysToScavs)
            return BaseClasses_1.BaseClasses.KEY_MECHANICAL;
        if (ModConfig_1.ModConfig.config.addOnlyKeyCardsToScavs)
            return BaseClasses_1.BaseClasses.KEYCARD;
    }
    removeScavLoot() {
        this.tables.bots.types.assault.inventory.items.Backpack = {};
        this.tables.bots.types.assault.inventory.items.Pockets = {};
        this.tables.bots.types.assault.inventory.items.TacticalVest = {};
        this.tables.bots.types.marksman.inventory.items.Backpack = {};
        this.tables.bots.types.marksman.inventory.items.Pockets = {};
        this.tables.bots.types.marksman.inventory.items.TacticalVest = {};
    }
    setIdenticalScavWeights() {
        for (const tierObject in this.tierInformation.tiers) {
            const tierNumber = this.tierInformation.tiers[tierObject].tier;
            const tierJson = this.apbsEquipmentGetter.getTierJson(tierNumber, true);
            const scav = tierJson.scav.equipment;
            for (const slot in scav) {
                if (slot == "SecondPrimaryWeapon" || slot == "ArmBand")
                    continue;
                if (slot == "FirstPrimaryWeapon") {
                    for (const subSlot in scav[slot]) {
                        for (const item in scav[slot][subSlot]) {
                            scav[slot][subSlot][item] = 1;
                        }
                    }
                    continue;
                }
                for (const item in scav[slot]) {
                    scav[slot][item] = 1;
                }
            }
        }
    }
    removeThermalGoggles(removeSome) {
        for (const tierObject in this.tierInformation.tiers) {
            const tierNumber = this.tierInformation.tiers[tierObject].tier;
            const tierJson = this.apbsEquipmentGetter.getTierModsJson(tierNumber, true);
            const tatmMods = tierJson["5a16b8a9fcdbcb00165aa6ca"].mod_nvg;
            const index = tatmMods.indexOf("5c11046cd174af02a012e42b");
            if (removeSome && tierNumber >= ModConfig_1.ModConfig.config.startTier)
                continue;
            if (index > -1) {
                tatmMods.splice(index, 1);
            }
        }
    }
    setPMCGameVersionWeights() {
        this.pmcConfig.gameVersionWeight.standard = ModConfig_1.ModConfig.config.standard;
        this.pmcConfig.gameVersionWeight.left_behind = ModConfig_1.ModConfig.config.left_behind;
        this.pmcConfig.gameVersionWeight.prepare_for_escape = ModConfig_1.ModConfig.config.prepare_for_escape;
        this.pmcConfig.gameVersionWeight.edge_of_darkness = ModConfig_1.ModConfig.config.edge_of_darkness;
        this.pmcConfig.gameVersionWeight.unheard_edition = ModConfig_1.ModConfig.config.unheard_edition;
    }
    setLevelDeltas() {
        this.tierInformation.tiers[0].botMinLevelVariance = ModConfig_1.ModConfig.config.tier1LevelDelta[0];
        this.tierInformation.tiers[0].botMaxLevelVariance = ModConfig_1.ModConfig.config.tier1LevelDelta[1];
        this.tierInformation.tiers[1].botMinLevelVariance = ModConfig_1.ModConfig.config.tier2LevelDelta[0];
        this.tierInformation.tiers[1].botMaxLevelVariance = ModConfig_1.ModConfig.config.tier2LevelDelta[1];
        this.tierInformation.tiers[2].botMinLevelVariance = ModConfig_1.ModConfig.config.tier3LevelDelta[0];
        this.tierInformation.tiers[2].botMaxLevelVariance = ModConfig_1.ModConfig.config.tier3LevelDelta[1];
        this.tierInformation.tiers[3].botMinLevelVariance = ModConfig_1.ModConfig.config.tier4LevelDelta[0];
        this.tierInformation.tiers[3].botMaxLevelVariance = ModConfig_1.ModConfig.config.tier4LevelDelta[1];
        this.tierInformation.tiers[4].botMinLevelVariance = ModConfig_1.ModConfig.config.tier5LevelDelta[0];
        this.tierInformation.tiers[4].botMaxLevelVariance = ModConfig_1.ModConfig.config.tier5LevelDelta[1];
        this.tierInformation.tiers[5].botMinLevelVariance = ModConfig_1.ModConfig.config.tier6LevelDelta[0];
        this.tierInformation.tiers[5].botMaxLevelVariance = ModConfig_1.ModConfig.config.tier6LevelDelta[1];
        this.tierInformation.tiers[6].botMinLevelVariance = ModConfig_1.ModConfig.config.tier7LevelDelta[0];
        this.tierInformation.tiers[6].botMaxLevelVariance = ModConfig_1.ModConfig.config.tier7LevelDelta[1];
    }
    setScavLevelDeltas() {
        this.tierInformation.tiers[0].scavMinLevelVariance = ModConfig_1.ModConfig.config.tier1ScavLevelDelta[0];
        this.tierInformation.tiers[0].scavMaxLevelVariance = ModConfig_1.ModConfig.config.tier1ScavLevelDelta[1];
        this.tierInformation.tiers[1].scavMinLevelVariance = ModConfig_1.ModConfig.config.tier2ScavLevelDelta[0];
        this.tierInformation.tiers[1].scavMaxLevelVariance = ModConfig_1.ModConfig.config.tier2ScavLevelDelta[1];
        this.tierInformation.tiers[2].scavMinLevelVariance = ModConfig_1.ModConfig.config.tier3ScavLevelDelta[0];
        this.tierInformation.tiers[2].scavMaxLevelVariance = ModConfig_1.ModConfig.config.tier3ScavLevelDelta[1];
        this.tierInformation.tiers[3].scavMinLevelVariance = ModConfig_1.ModConfig.config.tier4ScavLevelDelta[0];
        this.tierInformation.tiers[3].scavMaxLevelVariance = ModConfig_1.ModConfig.config.tier4ScavLevelDelta[1];
        this.tierInformation.tiers[4].scavMinLevelVariance = ModConfig_1.ModConfig.config.tier5ScavLevelDelta[0];
        this.tierInformation.tiers[4].scavMaxLevelVariance = ModConfig_1.ModConfig.config.tier5ScavLevelDelta[1];
        this.tierInformation.tiers[5].scavMinLevelVariance = ModConfig_1.ModConfig.config.tier6ScavLevelDelta[0];
        this.tierInformation.tiers[5].scavMaxLevelVariance = ModConfig_1.ModConfig.config.tier6ScavLevelDelta[1];
        this.tierInformation.tiers[6].scavMinLevelVariance = ModConfig_1.ModConfig.config.tier7ScavLevelDelta[0];
        this.tierInformation.tiers[6].scavMaxLevelVariance = ModConfig_1.ModConfig.config.tier7ScavLevelDelta[1];
    }
    setPMCSlotIDsToMakeRequired() {
        this.botConfig.equipment.pmc.weaponSlotIdsToMakeRequired = ["mod_reciever", "mod_stock"];
    }
};
exports.BotConfigs = BotConfigs;
exports.BotConfigs = BotConfigs = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("IDatabaseTables")),
    __param(1, (0, tsyringe_1.inject)("DatabaseService")),
    __param(2, (0, tsyringe_1.inject)("ConfigServer")),
    __param(3, (0, tsyringe_1.inject)("ItemHelper")),
    __param(4, (0, tsyringe_1.inject)("APBSEquipmentGetter")),
    __param(5, (0, tsyringe_1.inject)("TierInformation")),
    __param(6, (0, tsyringe_1.inject)("RaidInformation")),
    __param(7, (0, tsyringe_1.inject)("APBSLogger")),
    __metadata("design:paramtypes", [typeof (_a = typeof IDatabaseTables_1.IDatabaseTables !== "undefined" && IDatabaseTables_1.IDatabaseTables) === "function" ? _a : Object, typeof (_b = typeof DatabaseService_1.DatabaseService !== "undefined" && DatabaseService_1.DatabaseService) === "function" ? _b : Object, typeof (_c = typeof ConfigServer_1.ConfigServer !== "undefined" && ConfigServer_1.ConfigServer) === "function" ? _c : Object, typeof (_d = typeof ItemHelper_1.ItemHelper !== "undefined" && ItemHelper_1.ItemHelper) === "function" ? _d : Object, typeof (_e = typeof APBSEquipmentGetter_1.APBSEquipmentGetter !== "undefined" && APBSEquipmentGetter_1.APBSEquipmentGetter) === "function" ? _e : Object, typeof (_f = typeof TierInformation_1.TierInformation !== "undefined" && TierInformation_1.TierInformation) === "function" ? _f : Object, typeof (_g = typeof RaidInformation_1.RaidInformation !== "undefined" && RaidInformation_1.RaidInformation) === "function" ? _g : Object, typeof (_h = typeof APBSLogger_1.APBSLogger !== "undefined" && APBSLogger_1.APBSLogger) === "function" ? _h : Object])
], BotConfigs);
//# sourceMappingURL=BotConfigs.js.map