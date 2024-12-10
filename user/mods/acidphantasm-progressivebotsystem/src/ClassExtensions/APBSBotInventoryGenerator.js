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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
Object.defineProperty(exports, "__esModule", { value: true });
exports.APBSBotInventoryGenerator = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const BotEquipmentModGenerator_1 = require("C:/snapshot/project/obj/generators/BotEquipmentModGenerator");
const BotLootGenerator_1 = require("C:/snapshot/project/obj/generators/BotLootGenerator");
const BotWeaponGenerator_1 = require("C:/snapshot/project/obj/generators/BotWeaponGenerator");
const BotGeneratorHelper_1 = require("C:/snapshot/project/obj/helpers/BotGeneratorHelper");
const BotHelper_1 = require("C:/snapshot/project/obj/helpers/BotHelper");
const ItemHelper_1 = require("C:/snapshot/project/obj/helpers/ItemHelper");
const ContextVariableType_1 = require("C:/snapshot/project/obj/context/ContextVariableType");
const WeightedRandomHelper_1 = require("C:/snapshot/project/obj/helpers/WeightedRandomHelper");
const EquipmentSlots_1 = require("C:/snapshot/project/obj/models/enums/EquipmentSlots");
const ILogger_1 = require("C:/snapshot/project/obj/models/spt/utils/ILogger");
const ConfigServer_1 = require("C:/snapshot/project/obj/servers/ConfigServer");
const BotEquipmentModPoolService_1 = require("C:/snapshot/project/obj/services/BotEquipmentModPoolService");
const DatabaseService_1 = require("C:/snapshot/project/obj/services/DatabaseService");
const LocalisationService_1 = require("C:/snapshot/project/obj/services/LocalisationService");
const HashUtil_1 = require("C:/snapshot/project/obj/utils/HashUtil");
const RandomUtil_1 = require("C:/snapshot/project/obj/utils/RandomUtil");
const BotInventoryGenerator_1 = require("C:/snapshot/project/obj/generators/BotInventoryGenerator");
const APBSEquipmentGetter_1 = require("../Utils/APBSEquipmentGetter");
const APBSTierGetter_1 = require("../Utils/APBSTierGetter");
const ModConfig_1 = require("../Globals/ModConfig");
const APBSBotWeaponGenerator_1 = require("../ClassExtensions/APBSBotWeaponGenerator");
const ApplicationContext_1 = require("C:/snapshot/project/obj/context/ApplicationContext");
const ProfileHelper_1 = require("C:/snapshot/project/obj/helpers/ProfileHelper");
const WeatherHelper_1 = require("C:/snapshot/project/obj/helpers/WeatherHelper");
const BotEquipmentFilterService_1 = require("C:/snapshot/project/obj/services/BotEquipmentFilterService");
/** Handle profile related client events */
let APBSBotInventoryGenerator = class APBSBotInventoryGenerator extends BotInventoryGenerator_1.BotInventoryGenerator {
    logger;
    hashUtil;
    randomUtil;
    databaseService;
    applicationContext;
    botWeaponGenerator;
    botLootGenerator;
    botGeneratorHelper;
    profileHelper;
    botHelper;
    weightedRandomHelper;
    itemHelper;
    weatherHelper;
    localisationService;
    botEquipmentFilterService;
    botEquipmentModPoolService;
    botEquipmentModGenerator;
    configServer;
    apbsEquipmentGetter;
    apbsTierGetter;
    apbsBotWeaponGenerator;
    constructor(logger, hashUtil, randomUtil, databaseService, applicationContext, botWeaponGenerator, botLootGenerator, botGeneratorHelper, profileHelper, botHelper, weightedRandomHelper, itemHelper, weatherHelper, localisationService, botEquipmentFilterService, botEquipmentModPoolService, botEquipmentModGenerator, configServer, apbsEquipmentGetter, apbsTierGetter, apbsBotWeaponGenerator) {
        super(logger, hashUtil, randomUtil, databaseService, applicationContext, botWeaponGenerator, botLootGenerator, botGeneratorHelper, profileHelper, botHelper, weightedRandomHelper, itemHelper, weatherHelper, localisationService, botEquipmentFilterService, botEquipmentModPoolService, botEquipmentModGenerator, configServer);
        this.logger = logger;
        this.hashUtil = hashUtil;
        this.randomUtil = randomUtil;
        this.databaseService = databaseService;
        this.applicationContext = applicationContext;
        this.botWeaponGenerator = botWeaponGenerator;
        this.botLootGenerator = botLootGenerator;
        this.botGeneratorHelper = botGeneratorHelper;
        this.profileHelper = profileHelper;
        this.botHelper = botHelper;
        this.weightedRandomHelper = weightedRandomHelper;
        this.itemHelper = itemHelper;
        this.weatherHelper = weatherHelper;
        this.localisationService = localisationService;
        this.botEquipmentFilterService = botEquipmentFilterService;
        this.botEquipmentModPoolService = botEquipmentModPoolService;
        this.botEquipmentModGenerator = botEquipmentModGenerator;
        this.configServer = configServer;
        this.apbsEquipmentGetter = apbsEquipmentGetter;
        this.apbsTierGetter = apbsTierGetter;
        this.apbsBotWeaponGenerator = apbsBotWeaponGenerator;
    }
    generateInventory(sessionId, botJsonTemplate, botRole, isPmc, botLevel, chosenGameVersion) {
        const templateInventory = botJsonTemplate.inventory;
        let wornItemChances = botJsonTemplate.chances;
        const itemGenerationLimitsMinMax = botJsonTemplate.generation;
        // Generate base inventory with no items
        const botInventory = this.generateInventoryBase();
        const raidConfig = this.applicationContext
            .getLatestValue(ContextVariableType_1.ContextVariableType.RAID_CONFIGURATION)
            ?.getValue();
        this.generateAndAddEquipmentToBot(sessionId, templateInventory, wornItemChances, botRole, botInventory, botLevel, chosenGameVersion, raidConfig);
        // Roll weapon spawns (primary/secondary/holster) and generate a weapon for each roll that passed
        if (((botRole.includes("boss") || botRole.includes("sectant") || botRole.includes("arena")) && ModConfig_1.ModConfig.config.disableBossTierGeneration) || botRole == "bosslegion" || botRole == "bosspunisher") {
            this.generateAndAddWeaponsToBot(templateInventory, wornItemChances, sessionId, botInventory, botRole, isPmc, itemGenerationLimitsMinMax, botLevel);
            this.botLootGenerator.generateLoot(sessionId, botJsonTemplate, isPmc, botRole, botInventory, botLevel);
            return botInventory;
        }
        if (botRole.includes("follower") && ModConfig_1.ModConfig.config.disableBossFollowerTierGeneration) {
            this.generateAndAddWeaponsToBot(templateInventory, wornItemChances, sessionId, botInventory, botRole, isPmc, itemGenerationLimitsMinMax, botLevel);
            this.botLootGenerator.generateLoot(sessionId, botJsonTemplate, isPmc, botRole, botInventory, botLevel);
            return botInventory;
        }
        if ((botRole.includes("exusec") || botRole.includes("pmcbot")) && !ModConfig_1.ModConfig.config.disableRaiderRogueTierGeneration) {
            this.generateAndAddWeaponsToBot(templateInventory, wornItemChances, sessionId, botInventory, botRole, isPmc, itemGenerationLimitsMinMax, botLevel);
            this.botLootGenerator.generateLoot(sessionId, botJsonTemplate, isPmc, botRole, botInventory, botLevel);
            return botInventory;
        }
        if (botRole.includes("pmc") && ModConfig_1.ModConfig.config.disablePMCTierGeneration) {
            this.generateAndAddWeaponsToBot(templateInventory, wornItemChances, sessionId, botInventory, botRole, isPmc, itemGenerationLimitsMinMax, botLevel);
            this.botLootGenerator.generateLoot(sessionId, botJsonTemplate, isPmc, botRole, botInventory, botLevel);
            return botInventory;
        }
        if ((botRole.includes("assault") || botRole.includes("marksman")) && ModConfig_1.ModConfig.config.disableScavTierGeneration) {
            this.generateAndAddWeaponsToBot(templateInventory, wornItemChances, sessionId, botInventory, botRole, isPmc, itemGenerationLimitsMinMax, botLevel);
            this.botLootGenerator.generateLoot(sessionId, botJsonTemplate, isPmc, botRole, botInventory, botLevel);
            return botInventory;
        }
        if (botRole.includes("infected") || botRole.includes("spirit") || botRole.includes("skier") || botRole.includes("peacemaker") || botRole.includes("gifter")) {
            this.generateAndAddWeaponsToBot(templateInventory, wornItemChances, sessionId, botInventory, botRole, isPmc, itemGenerationLimitsMinMax, botLevel);
            this.botLootGenerator.generateLoot(sessionId, botJsonTemplate, isPmc, botRole, botInventory, botLevel);
            return botInventory;
        }
        // APBS generation chances instead
        const tierInfo = this.apbsTierGetter.getTierByLevel(botLevel);
        wornItemChances = this.apbsEquipmentGetter.getSpawnChancesByBotRole(botRole, tierInfo);
        this.generateAndAddWeaponsToBot(templateInventory, wornItemChances, sessionId, botInventory, botRole, isPmc, itemGenerationLimitsMinMax, botLevel);
        this.botLootGenerator.generateLoot(sessionId, botJsonTemplate, isPmc, botRole, botInventory, botLevel);
        return botInventory;
    }
    generateEquipment = (settings) => {
        const equipmentSlot = settings.rootEquipmentSlot;
        const botRole = settings.botData.role;
        const botLevel = settings.botData.level;
        const tierInfo = this.apbsTierGetter.getTierByLevel(botLevel);
        let equipmentPool = this.apbsEquipmentGetter.getEquipmentByBotRole(botRole, tierInfo, equipmentSlot);
        let randomisationDetails = this.apbsEquipmentGetter.getSpawnChancesByBotRole(botRole, tierInfo);
        let wornItemChances = this.apbsEquipmentGetter.getSpawnChancesByBotRole(botRole, tierInfo);
        let modPool = this.apbsEquipmentGetter.getModsByBotRole(botRole, tierInfo);
        let apbsBot = true;
        if ((ModConfig_1.ModConfig.config.disableBossTierGeneration && (botRole.includes("boss") || botRole.includes("sectant") || botRole.includes("arena"))) || botRole == "bosslegion" || botRole == "bosspunisher") {
            equipmentPool = settings.rootEquipmentPool;
            randomisationDetails = settings.randomisationDetails;
            wornItemChances = settings.spawnChances;
            modPool = settings.modPool;
            apbsBot = false;
        }
        if (ModConfig_1.ModConfig.config.disableBossFollowerTierGeneration && botRole.includes("follower")) {
            equipmentPool = settings.rootEquipmentPool;
            randomisationDetails = settings.randomisationDetails;
            wornItemChances = settings.spawnChances;
            modPool = settings.modPool;
            apbsBot = false;
        }
        if (ModConfig_1.ModConfig.config.disableRaiderRogueTierGeneration && (botRole.includes("exusec") || botRole.includes("pmcbot"))) {
            equipmentPool = settings.rootEquipmentPool;
            randomisationDetails = settings.randomisationDetails;
            wornItemChances = settings.spawnChances;
            modPool = settings.modPool;
            apbsBot = false;
        }
        if (ModConfig_1.ModConfig.config.disablePMCTierGeneration && (botRole.includes("pmcusec") || botRole.includes("pmcbear"))) {
            equipmentPool = settings.rootEquipmentPool;
            randomisationDetails = settings.randomisationDetails;
            wornItemChances = settings.spawnChances;
            modPool = settings.modPool;
            apbsBot = false;
        }
        if (ModConfig_1.ModConfig.config.disableScavTierGeneration && (botRole.includes("assault") || botRole.includes("marksman"))) {
            equipmentPool = settings.rootEquipmentPool;
            randomisationDetails = settings.randomisationDetails;
            wornItemChances = settings.spawnChances;
            modPool = settings.modPool;
            apbsBot = false;
        }
        if (botRole.includes("infected") || botRole.includes("spirit") || botRole.includes("skier") || botRole.includes("peacemaker") || botRole.includes("gifter")) {
            equipmentPool = settings.rootEquipmentPool;
            randomisationDetails = settings.randomisationDetails;
            wornItemChances = settings.spawnChances;
            modPool = settings.modPool;
            apbsBot = false;
        }
        if (apbsBot && equipmentSlot == EquipmentSlots_1.EquipmentSlots.TACTICAL_VEST && !settings.inventory.items.find(e => e.slotId === "ArmorVest")) {
            equipmentPool = this.apbsEquipmentGetter.getEquipmentByBotRole(botRole, tierInfo, "ArmouredRig");
        }
        if (equipmentSlot == EquipmentSlots_1.EquipmentSlots.POCKETS && Object.keys(settings.rootEquipmentPool).includes("65e080be269cbd5c5005e529")) {
            equipmentPool = settings.rootEquipmentPool;
        }
        const spawnChance = [EquipmentSlots_1.EquipmentSlots.POCKETS, EquipmentSlots_1.EquipmentSlots.SECURED_CONTAINER].includes(settings.rootEquipmentSlot)
            ? 100
            : wornItemChances.equipment[settings.rootEquipmentSlot];
        if (typeof spawnChance === "undefined") {
            this.logger.warning(this.localisationService.getText("bot-no_spawn_chance_defined_for_equipment_slot", settings.rootEquipmentSlot));
            return false;
        }
        const shouldSpawn = this.randomUtil.getChance100(spawnChance);
        if (shouldSpawn && Object.keys(equipmentPool).length) {
            let pickedItemDb;
            let found = false;
            const maxAttempts = Math.round(Object.keys(equipmentPool).length * 0.75); // Roughly 75% of pool size
            let attempts = 0;
            while (!found) {
                if (Object.values(equipmentPool).length === 0) {
                    return false;
                }
                const chosenItemTpl = this.weightedRandomHelper.getWeightedValue(equipmentPool);
                const dbResult = this.itemHelper.getItem(chosenItemTpl);
                if (!dbResult[0]) {
                    this.logger.error(this.localisationService.getText("bot-missing_item_template", chosenItemTpl));
                    this.logger.info(`EquipmentSlot -> ${settings.rootEquipmentSlot}`);
                    attempts++;
                    continue;
                }
                const compatabilityResult = this.botGeneratorHelper.isItemIncompatibleWithCurrentItems(settings.inventory.items, chosenItemTpl, settings.rootEquipmentSlot);
                if (compatabilityResult.incompatible) {
                    // Tried x different items that failed, stop
                    if (attempts > maxAttempts) {
                        return false;
                    }
                    attempts++;
                }
                else {
                    // Success
                    found = true;
                    pickedItemDb = dbResult[1];
                }
            }
            // Create root item
            const id = this.hashUtil.generate();
            const item = {
                _id: id,
                _tpl: pickedItemDb._id,
                parentId: settings.inventory.equipment,
                slotId: settings.rootEquipmentSlot,
                ...this.botGeneratorHelper.generateExtraPropertiesForItem(pickedItemDb, settings.botData.role)
            };
            const botEquipBlacklist = this.botEquipmentFilterService.getBotEquipmentBlacklist(settings.botData.equipmentRole, settings.generatingPlayerLevel);
            // Edge case: Filter the armor items mod pool if bot exists in config dict + config has armor slot
            if (this.botConfig.equipment[settings.botData.equipmentRole] &&
                randomisationDetails?.randomisedArmorSlots?.includes(settings.rootEquipmentSlot)) {
                // Filter out mods from relevant blacklist
                modPool[pickedItemDb._id] = this.getFilteredDynamicModsForItem(pickedItemDb._id, botEquipBlacklist.equipment);
            }
            // Does item have slots for sub-mods to be inserted into
            if (pickedItemDb._props.Slots?.length > 0 && !settings.generateModsBlacklist?.includes(pickedItemDb._id)) {
                const childItemsToAdd = this.botEquipmentModGenerator.generateModsForEquipment([item], id, pickedItemDb, settings, botEquipBlacklist);
                settings.inventory.items.push(...childItemsToAdd);
            }
            else {
                // No slots, add root item only
                settings.inventory.items.push(item);
            }
            return true;
        }
        return false;
    };
    generateAndAddWeaponsToBot(templateInventory, equipmentChances, sessionId, botInventory, botRole, isPmc, itemGenerationLimitsMinMax, botLevel) {
        const weaponSlotsToFill = this.getDesiredWeaponsForBot(equipmentChances);
        let hasBothPrimary = false;
        if (weaponSlotsToFill[0].shouldSpawn && weaponSlotsToFill[1].shouldSpawn) {
            hasBothPrimary = true;
        }
        for (const weaponSlot of weaponSlotsToFill) {
            // Add weapon to bot if true and bot json has something to put into the slot
            if (weaponSlot.shouldSpawn && Object.keys(templateInventory.equipment[weaponSlot.slot]).length) {
                this.apbsAddWeaponAndMagazinesToInventory(sessionId, weaponSlot, templateInventory, botInventory, equipmentChances, botRole, isPmc, itemGenerationLimitsMinMax, botLevel, hasBothPrimary);
            }
        }
    }
    apbsAddWeaponAndMagazinesToInventory(sessionId, weaponSlot, templateInventory, botInventory, equipmentChances, botRole, isPmc, itemGenerationWeights, botLevel, hasBothPrimary) {
        const generatedWeapon = this.apbsBotWeaponGenerator.apbsGenerateRandomWeapon(sessionId, weaponSlot.slot, templateInventory, botInventory.equipment, equipmentChances.weaponMods, botRole, isPmc, botLevel, hasBothPrimary);
        botInventory.items.push(...generatedWeapon.weapon);
        this.botWeaponGenerator.addExtraMagazinesToInventory(generatedWeapon, itemGenerationWeights.items.magazines, botInventory, botRole);
    }
};
exports.APBSBotInventoryGenerator = APBSBotInventoryGenerator;
exports.APBSBotInventoryGenerator = APBSBotInventoryGenerator = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("PrimaryLogger")),
    __param(1, (0, tsyringe_1.inject)("HashUtil")),
    __param(2, (0, tsyringe_1.inject)("RandomUtil")),
    __param(3, (0, tsyringe_1.inject)("DatabaseService")),
    __param(4, (0, tsyringe_1.inject)("ApplicationContext")),
    __param(5, (0, tsyringe_1.inject)("BotWeaponGenerator")),
    __param(6, (0, tsyringe_1.inject)("BotLootGenerator")),
    __param(7, (0, tsyringe_1.inject)("BotGeneratorHelper")),
    __param(8, (0, tsyringe_1.inject)("ProfileHelper")),
    __param(9, (0, tsyringe_1.inject)("BotHelper")),
    __param(10, (0, tsyringe_1.inject)("WeightedRandomHelper")),
    __param(11, (0, tsyringe_1.inject)("ItemHelper")),
    __param(12, (0, tsyringe_1.inject)("WeatherHelper")),
    __param(13, (0, tsyringe_1.inject)("LocalisationService")),
    __param(14, (0, tsyringe_1.inject)("BotEquipmentFilterService")),
    __param(15, (0, tsyringe_1.inject)("BotEquipmentModPoolService")),
    __param(16, (0, tsyringe_1.inject)("BotEquipmentModGenerator")),
    __param(17, (0, tsyringe_1.inject)("ConfigServer")),
    __param(18, (0, tsyringe_1.inject)("APBSEquipmentGetter")),
    __param(19, (0, tsyringe_1.inject)("APBSTierGetter")),
    __param(20, (0, tsyringe_1.inject)("APBSBotWeaponGenerator")),
    __metadata("design:paramtypes", [typeof (_a = typeof ILogger_1.ILogger !== "undefined" && ILogger_1.ILogger) === "function" ? _a : Object, typeof (_b = typeof HashUtil_1.HashUtil !== "undefined" && HashUtil_1.HashUtil) === "function" ? _b : Object, typeof (_c = typeof RandomUtil_1.RandomUtil !== "undefined" && RandomUtil_1.RandomUtil) === "function" ? _c : Object, typeof (_d = typeof DatabaseService_1.DatabaseService !== "undefined" && DatabaseService_1.DatabaseService) === "function" ? _d : Object, typeof (_e = typeof ApplicationContext_1.ApplicationContext !== "undefined" && ApplicationContext_1.ApplicationContext) === "function" ? _e : Object, typeof (_f = typeof BotWeaponGenerator_1.BotWeaponGenerator !== "undefined" && BotWeaponGenerator_1.BotWeaponGenerator) === "function" ? _f : Object, typeof (_g = typeof BotLootGenerator_1.BotLootGenerator !== "undefined" && BotLootGenerator_1.BotLootGenerator) === "function" ? _g : Object, typeof (_h = typeof BotGeneratorHelper_1.BotGeneratorHelper !== "undefined" && BotGeneratorHelper_1.BotGeneratorHelper) === "function" ? _h : Object, typeof (_j = typeof ProfileHelper_1.ProfileHelper !== "undefined" && ProfileHelper_1.ProfileHelper) === "function" ? _j : Object, typeof (_k = typeof BotHelper_1.BotHelper !== "undefined" && BotHelper_1.BotHelper) === "function" ? _k : Object, typeof (_l = typeof WeightedRandomHelper_1.WeightedRandomHelper !== "undefined" && WeightedRandomHelper_1.WeightedRandomHelper) === "function" ? _l : Object, typeof (_m = typeof ItemHelper_1.ItemHelper !== "undefined" && ItemHelper_1.ItemHelper) === "function" ? _m : Object, typeof (_o = typeof WeatherHelper_1.WeatherHelper !== "undefined" && WeatherHelper_1.WeatherHelper) === "function" ? _o : Object, typeof (_p = typeof LocalisationService_1.LocalisationService !== "undefined" && LocalisationService_1.LocalisationService) === "function" ? _p : Object, typeof (_q = typeof BotEquipmentFilterService_1.BotEquipmentFilterService !== "undefined" && BotEquipmentFilterService_1.BotEquipmentFilterService) === "function" ? _q : Object, typeof (_r = typeof BotEquipmentModPoolService_1.BotEquipmentModPoolService !== "undefined" && BotEquipmentModPoolService_1.BotEquipmentModPoolService) === "function" ? _r : Object, typeof (_s = typeof BotEquipmentModGenerator_1.BotEquipmentModGenerator !== "undefined" && BotEquipmentModGenerator_1.BotEquipmentModGenerator) === "function" ? _s : Object, typeof (_t = typeof ConfigServer_1.ConfigServer !== "undefined" && ConfigServer_1.ConfigServer) === "function" ? _t : Object, typeof (_u = typeof APBSEquipmentGetter_1.APBSEquipmentGetter !== "undefined" && APBSEquipmentGetter_1.APBSEquipmentGetter) === "function" ? _u : Object, typeof (_v = typeof APBSTierGetter_1.APBSTierGetter !== "undefined" && APBSTierGetter_1.APBSTierGetter) === "function" ? _v : Object, typeof (_w = typeof APBSBotWeaponGenerator_1.APBSBotWeaponGenerator !== "undefined" && APBSBotWeaponGenerator_1.APBSBotWeaponGenerator) === "function" ? _w : Object])
], APBSBotInventoryGenerator);
//# sourceMappingURL=APBSBotInventoryGenerator.js.map