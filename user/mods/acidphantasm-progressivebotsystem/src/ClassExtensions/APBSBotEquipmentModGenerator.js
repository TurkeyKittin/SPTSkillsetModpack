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
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z;
Object.defineProperty(exports, "__esModule", { value: true });
exports.APBSBotEquipmentModGenerator = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const BotGeneratorHelper_1 = require("C:/snapshot/project/obj/helpers/BotGeneratorHelper");
const BotHelper_1 = require("C:/snapshot/project/obj/helpers/BotHelper");
const BotWeaponGeneratorHelper_1 = require("C:/snapshot/project/obj/helpers/BotWeaponGeneratorHelper");
const ItemHelper_1 = require("C:/snapshot/project/obj/helpers/ItemHelper");
const PresetHelper_1 = require("C:/snapshot/project/obj/helpers/PresetHelper");
const ProbabilityHelper_1 = require("C:/snapshot/project/obj/helpers/ProbabilityHelper");
const ProfileHelper_1 = require("C:/snapshot/project/obj/helpers/ProfileHelper");
const WeightedRandomHelper_1 = require("C:/snapshot/project/obj/helpers/WeightedRandomHelper");
const ModSpawn_1 = require("C:/snapshot/project/obj/models/enums/ModSpawn");
const IFilterPlateModsForSlotByLevelResult_1 = require("C:/snapshot/project/obj/models/spt/bots/IFilterPlateModsForSlotByLevelResult");
const ExhaustableArray_1 = require("C:/snapshot/project/obj/models/spt/server/ExhaustableArray");
const ILogger_1 = require("C:/snapshot/project/obj/models/spt/utils/ILogger");
const ConfigServer_1 = require("C:/snapshot/project/obj/servers/ConfigServer");
const BotEquipmentFilterService_1 = require("C:/snapshot/project/obj/services/BotEquipmentFilterService");
const BotEquipmentModPoolService_1 = require("C:/snapshot/project/obj/services/BotEquipmentModPoolService");
const BotWeaponModLimitService_1 = require("C:/snapshot/project/obj/services/BotWeaponModLimitService");
const DatabaseService_1 = require("C:/snapshot/project/obj/services/DatabaseService");
const ItemFilterService_1 = require("C:/snapshot/project/obj/services/ItemFilterService");
const LocalisationService_1 = require("C:/snapshot/project/obj/services/LocalisationService");
const HashUtil_1 = require("C:/snapshot/project/obj/utils/HashUtil");
const RandomUtil_1 = require("C:/snapshot/project/obj/utils/RandomUtil");
const ICloner_1 = require("C:/snapshot/project/obj/utils/cloners/ICloner");
const BotEquipmentModGenerator_1 = require("C:/snapshot/project/obj/generators/BotEquipmentModGenerator");
const APBSEquipmentGetter_1 = require("../Utils/APBSEquipmentGetter");
const APBSTierGetter_1 = require("../Utils/APBSTierGetter");
const ModConfig_1 = require("../Globals/ModConfig");
const RaidInformation_1 = require("../Globals/RaidInformation");
const ModInformation_1 = require("../Globals/ModInformation");
const APBSTester_1 = require("../Utils/APBSTester");
const Money_1 = require("C:/snapshot/project/obj/models/enums/Money");
const BaseClasses_1 = require("C:/snapshot/project/obj/models/enums/BaseClasses");
/** Handle profile related client events */
let APBSBotEquipmentModGenerator = class APBSBotEquipmentModGenerator extends BotEquipmentModGenerator_1.BotEquipmentModGenerator {
    logger;
    hashUtil;
    randomUtil;
    probabilityHelper;
    databaseService;
    itemHelper;
    botEquipmentFilterService;
    itemFilterService;
    profileHelper;
    botWeaponModLimitService;
    botHelper;
    botGeneratorHelper;
    botWeaponGeneratorHelper;
    weightedRandomHelper;
    presetHelper;
    localisationService;
    botEquipmentModPoolService;
    configServer;
    cloner;
    apbsEquipmentGetter;
    apbsTierGetter;
    raidInformation;
    modInformation;
    apbsTester;
    constructor(logger, hashUtil, randomUtil, probabilityHelper, databaseService, itemHelper, botEquipmentFilterService, itemFilterService, profileHelper, botWeaponModLimitService, botHelper, botGeneratorHelper, botWeaponGeneratorHelper, weightedRandomHelper, presetHelper, localisationService, botEquipmentModPoolService, configServer, cloner, apbsEquipmentGetter, apbsTierGetter, raidInformation, modInformation, apbsTester) {
        super(logger, hashUtil, randomUtil, probabilityHelper, databaseService, itemHelper, botEquipmentFilterService, itemFilterService, profileHelper, botWeaponModLimitService, botHelper, botGeneratorHelper, botWeaponGeneratorHelper, weightedRandomHelper, presetHelper, localisationService, botEquipmentModPoolService, configServer, cloner);
        this.logger = logger;
        this.hashUtil = hashUtil;
        this.randomUtil = randomUtil;
        this.probabilityHelper = probabilityHelper;
        this.databaseService = databaseService;
        this.itemHelper = itemHelper;
        this.botEquipmentFilterService = botEquipmentFilterService;
        this.itemFilterService = itemFilterService;
        this.profileHelper = profileHelper;
        this.botWeaponModLimitService = botWeaponModLimitService;
        this.botHelper = botHelper;
        this.botGeneratorHelper = botGeneratorHelper;
        this.botWeaponGeneratorHelper = botWeaponGeneratorHelper;
        this.weightedRandomHelper = weightedRandomHelper;
        this.presetHelper = presetHelper;
        this.localisationService = localisationService;
        this.botEquipmentModPoolService = botEquipmentModPoolService;
        this.configServer = configServer;
        this.cloner = cloner;
        this.apbsEquipmentGetter = apbsEquipmentGetter;
        this.apbsTierGetter = apbsTierGetter;
        this.raidInformation = raidInformation;
        this.modInformation = modInformation;
        this.apbsTester = apbsTester;
    }
    generateModsForEquipment(equipment, parentId, parentTemplate, settings, specificBlacklist, shouldForceSpawn) {
        let forceSpawn = shouldForceSpawn;
        const botRole = settings.botData.role;
        const tier = this.apbsTierGetter.getTierByLevel(settings.botData.level);
        const tieredModPool = this.apbsEquipmentGetter.getModsByBotRole(botRole, tier);
        let compatibleModsPool = tieredModPool[parentTemplate._id];
        let actualModPool = tieredModPool;
        let spawnChances = this.apbsEquipmentGetter.getSpawnChancesByBotRole(botRole, tier);
        // Roll weapon spawns (primary/secondary/holster) and generate a weapon for each roll that passed
        if ((ModConfig_1.ModConfig.config.disableBossTierGeneration && (botRole.includes("boss") || botRole.includes("sectant") || botRole.includes("arena"))) || botRole == "bosslegion" || botRole == "bosspunisher") {
            spawnChances = settings.spawnChances;
            compatibleModsPool = settings.modPool[parentTemplate._id];
            actualModPool = settings.modPool;
        }
        if (ModConfig_1.ModConfig.config.disableBossFollowerTierGeneration && botRole.includes("follower")) {
            spawnChances = settings.spawnChances;
            compatibleModsPool = settings.modPool[parentTemplate._id];
            actualModPool = settings.modPool;
        }
        if (ModConfig_1.ModConfig.config.disableRaiderRogueTierGeneration && (botRole.includes("exusec") || botRole.includes("pmcbot"))) {
            spawnChances = settings.spawnChances;
            compatibleModsPool = settings.modPool[parentTemplate._id];
            actualModPool = settings.modPool;
        }
        if (ModConfig_1.ModConfig.config.disablePMCTierGeneration && (botRole.includes("pmcusec") || botRole.includes("pmcbear"))) {
            spawnChances = settings.spawnChances;
            compatibleModsPool = settings.modPool[parentTemplate._id];
            actualModPool = settings.modPool;
        }
        if (ModConfig_1.ModConfig.config.disableScavTierGeneration && (botRole.includes("assault") || botRole.includes("marksman"))) {
            spawnChances = settings.spawnChances;
            compatibleModsPool = settings.modPool[parentTemplate._id];
            actualModPool = settings.modPool;
        }
        if (botRole.includes("infected") || botRole.includes("spirit") || botRole.includes("skier") || botRole.includes("peacemaker") || botRole.includes("gifter")) {
            spawnChances = settings.spawnChances;
            compatibleModsPool = settings.modPool[parentTemplate._id];
            actualModPool = settings.modPool;
        }
        if (!compatibleModsPool) {
            this.logger.warning(`bot: ${botRole} lacks a mod slot pool for item: ${parentTemplate._id} ${parentTemplate._name}`);
        }
        // Iterate over mod pool and choose mods to add to item
        for (const modSlotName in compatibleModsPool) {
            if (modSlotName === "mod_equipment_000" && this.raidInformation.nightTime)
                continue;
            const itemSlotTemplate = this.getModItemSlotFromDb(modSlotName, parentTemplate);
            if (!itemSlotTemplate) {
                this.logger.error(this.localisationService.getText("bot-mod_slot_missing_from_item", {
                    modSlot: modSlotName,
                    parentId: parentTemplate._id,
                    parentName: parentTemplate._name,
                    botRole: settings.botData.role
                }));
                continue;
            }
            const modSpawnResult = this.shouldModBeSpawned(itemSlotTemplate, modSlotName.toLowerCase(), spawnChances.equipmentMods, settings.botEquipmentConfig);
            if (modSpawnResult === ModSpawn_1.ModSpawn.SKIP && !forceSpawn) {
                continue;
            }
            // Ensure submods for nvgs all spawn together if it's night
            if (modSlotName === "mod_nvg") {
                if (this.raidInformation.nightTime) {
                    forceSpawn = true;
                }
                else {
                    continue;
                }
            }
            let modPoolToChooseFrom = compatibleModsPool[modSlotName];
            if (settings.botEquipmentConfig.filterPlatesByLevel
                && this.itemHelper.isRemovablePlateSlot(modSlotName.toLowerCase())) {
                const outcome = this.filterPlateModsForSlotByLevel(settings, modSlotName.toLowerCase(), compatibleModsPool[modSlotName], parentTemplate);
                if ([IFilterPlateModsForSlotByLevelResult_1.Result.UNKNOWN_FAILURE, IFilterPlateModsForSlotByLevelResult_1.Result.NO_DEFAULT_FILTER].includes(outcome.result)) {
                    this.logger.debug(`Plate slot: ${modSlotName} selection for armor: ${parentTemplate._id} failed: ${IFilterPlateModsForSlotByLevelResult_1.Result[outcome.result]}, skipping`);
                    continue;
                }
                if ([IFilterPlateModsForSlotByLevelResult_1.Result.LACKS_PLATE_WEIGHTS].includes(outcome.result)) {
                    this.logger.warning(`Plate slot: ${modSlotName} lacks weights for armor: ${parentTemplate._id}, unable to adjust plate choice, using existing data`);
                }
                modPoolToChooseFrom = outcome.plateModTpls;
            }
            // Find random mod and check its compatible
            let modTpl;
            let found = false;
            const exhaustableModPool = new ExhaustableArray_1.ExhaustableArray(modPoolToChooseFrom, this.randomUtil, this.cloner);
            while (exhaustableModPool.hasValues()) {
                modTpl = exhaustableModPool.getRandomValue();
                if (modTpl
                    && !this.botGeneratorHelper.isItemIncompatibleWithCurrentItems(equipment, modTpl, modSlotName)
                        .incompatible) {
                    found = true;
                    break;
                }
            }
            // Compatible item not found but slot REQUIRES item, get random item from db
            if (!found && itemSlotTemplate._required) {
                modTpl = this.getRandomModTplFromItemDb(modTpl, itemSlotTemplate, modSlotName, equipment);
                found = !!modTpl;
            }
            // Compatible item not found + not required
            if (!(found || itemSlotTemplate._required)) {
                // Don't add item
                continue;
            }
            const modTemplate = this.itemHelper.getItem(modTpl);
            if (!this.isModValidForSlot(modTemplate, itemSlotTemplate, modSlotName, parentTemplate, botRole)) {
                continue;
            }
            // Generate new id to ensure all items are unique on bot
            const modId = this.hashUtil.generate();
            equipment.push(this.createModItem(modId, modTpl, parentId, modSlotName, modTemplate[1], botRole));
            // Does the item being added have possible child mods?
            if (Object.keys(actualModPool).includes(modTpl)) {
                // Call self recursively with item being checkced item we just added to bot
                this.generateModsForEquipment(equipment, modId, modTemplate[1], settings, specificBlacklist, forceSpawn);
            }
        }
        // This is for testing...
        if (this.modInformation.testMode && this.modInformation.testBotRole.includes(botRole.toLowerCase())) {
            const tables = this.databaseService.getTables();
            const assortEquipment = this.cloner.clone(equipment);
            for (const item in assortEquipment) {
                const oldID = assortEquipment[item]._id;
                const newID = this.hashUtil.generate();
                assortEquipment[item]._id = newID;
                // Loop array again to fix parentID
                for (const i in assortEquipment) {
                    if (assortEquipment[i].parentId == oldID) {
                        assortEquipment[i].parentId = newID;
                    }
                }
            }
            this.apbsTester.createComplexAssortItem(assortEquipment)
                .addUnlimitedStackCount()
                .addMoneyCost(Money_1.Money.ROUBLES, 20000)
                .addBuyRestriction(3)
                .addLoyaltyLevel(1)
                .export(tables.traders[this.modInformation.testTrader]);
        }
        return equipment;
    }
    filterPlateModsForSlotByLevel(settings, modSlot, existingPlateTplPool, armorItem) {
        const result = { result: IFilterPlateModsForSlotByLevelResult_1.Result.UNKNOWN_FAILURE, plateModTpls: undefined };
        // Not pmc or not a plate slot, return original mod pool array
        if (!this.itemHelper.isRemovablePlateSlot(modSlot)) {
            result.result = IFilterPlateModsForSlotByLevelResult_1.Result.NOT_PLATE_HOLDING_SLOT;
            result.plateModTpls = existingPlateTplPool;
            return result;
        }
        // Get the front/back/side weights based on bots level
        const plateSlotWeights = settings.botEquipmentConfig?.armorPlateWeighting?.find((armorWeight) => settings.botData.level >= armorWeight.levelRange.min && settings.botData.level <= armorWeight.levelRange.max);
        if (!plateSlotWeights) {
            // No weights, return original array of plate tpls
            result.result = IFilterPlateModsForSlotByLevelResult_1.Result.LACKS_PLATE_WEIGHTS;
            result.plateModTpls = existingPlateTplPool;
            return result;
        }
        // Get the specific plate slot weights (front/back/side)
        const plateWeights = plateSlotWeights[modSlot];
        if (!plateWeights) {
            // No weights, return original array of plate tpls
            result.result = IFilterPlateModsForSlotByLevelResult_1.Result.LACKS_PLATE_WEIGHTS;
            result.plateModTpls = existingPlateTplPool;
            return result;
        }
        // Choose a plate level based on weighting
        let chosenArmorPlateLevel = this.weightedRandomHelper.getWeightedValue(plateWeights);
        // Convert the array of ids into database items
        let platesFromDb = existingPlateTplPool.map((plateTpl) => this.itemHelper.getItem(plateTpl)[1]);
        // Filter plates to the chosen level based on its armorClass property
        let platesOfDesiredLevel = platesFromDb.filter((item) => item._props.armorClass === chosenArmorPlateLevel);
        let tries = 0;
        while (platesOfDesiredLevel.length === 0) {
            tries++;
            chosenArmorPlateLevel = (parseInt(chosenArmorPlateLevel) + 1).toString();
            if (parseInt(chosenArmorPlateLevel) > 6) {
                chosenArmorPlateLevel = "3";
            }
            platesFromDb = existingPlateTplPool.map((plateTpl) => this.itemHelper.getItem(plateTpl)[1]);
            platesOfDesiredLevel = platesFromDb.filter((item) => item._props.armorClass === chosenArmorPlateLevel);
            if (platesOfDesiredLevel.length > 0)
                break;
            if (tries >= 3)
                break;
        }
        if (platesOfDesiredLevel.length === 0) {
            this.logger.debug(`${settings.botData.role} - Plate filter was too restrictive for armor: ${armorItem._id}. Tried ${tries} times. Using mod items default plate.`);
            const relatedItemDbModSlot = armorItem._props.Slots.find((slot) => slot._name.toLowerCase() === modSlot);
            const defaultPlate = relatedItemDbModSlot._props.filters[0].Plate;
            if (!defaultPlate) {
                // No relevant plate found after filtering AND no default plate
                // Last attempt, get default preset and see if it has a plate default
                const defaultPreset = this.presetHelper.getDefaultPreset(armorItem._id);
                if (defaultPreset) {
                    const relatedPresetSlot = defaultPreset._items.find((item) => item.slotId?.toLowerCase() === modSlot);
                    if (relatedPresetSlot) {
                        result.result = IFilterPlateModsForSlotByLevelResult_1.Result.SUCCESS;
                        result.plateModTpls = [relatedPresetSlot._tpl];
                        return result;
                    }
                }
                // Return Default Preset cause didn't have default plates
                result.result = IFilterPlateModsForSlotByLevelResult_1.Result.NO_DEFAULT_FILTER;
                return result;
            }
            // Return Default Plates cause couldn't get lowest level available from original selection
            result.result = IFilterPlateModsForSlotByLevelResult_1.Result.SUCCESS;
            result.plateModTpls = [defaultPlate];
            return result;
        }
        // Only return the items ids
        result.result = IFilterPlateModsForSlotByLevelResult_1.Result.SUCCESS;
        result.plateModTpls = platesOfDesiredLevel.map((item) => item._id);
        return result;
    }
    getCompatibleModFromPool(modPool, modSpawnType, weapon) {
        // Create exhaustable pool to pick mod item from
        const exhaustableModPool = this.createExhaustableArray(modPool);
        // Create default response if no compatible item is found below
        const chosenModResult = {
            incompatible: true,
            found: false,
            reason: "unknown"
        };
        // Limit how many attempts to find a compatible mod can occur before giving up
        const maxBlockedAttempts = Math.round(modPool.length); // 75% of pool size
        let blockedAttemptCount = 0;
        let chosenTpl;
        while (exhaustableModPool.hasValues()) {
            chosenTpl = exhaustableModPool.getRandomValue();
            const pickedItemDetails = this.itemHelper.getItem(chosenTpl);
            if (!pickedItemDetails[0]) {
                // Not valid item, try again
                continue;
            }
            if (!pickedItemDetails[1]._props) {
                // no props data, try again
                continue;
            }
            // Success - Default wanted + only 1 item in pool
            if (modSpawnType === ModSpawn_1.ModSpawn.DEFAULT_MOD && modPool.length === 1) {
                chosenModResult.found = true;
                chosenModResult.incompatible = false;
                chosenModResult.chosenTpl = chosenTpl;
                break;
            }
            // Check if existing weapon mods are incompatible with chosen item
            const existingItemBlockingChoice = weapon.find((item) => pickedItemDetails[1]._props.ConflictingItems?.includes(item._tpl));
            if (existingItemBlockingChoice) {
                // Give max of x attempts of picking a mod if blocked by another
                if (blockedAttemptCount > maxBlockedAttempts) {
                    blockedAttemptCount = 0; // reset
                    break;
                }
                blockedAttemptCount++;
                // Not compatible - Try again
                continue;
            }
            // Edge case- Some mod combos will never work, make sure this isnt the case
            if (this.weaponModComboIsIncompatible(weapon, chosenTpl)) {
                chosenModResult.reason = `Chosen weapon mod: ${chosenTpl} can never be compatible with existing weapon mods`;
                break;
            }
            // Success
            chosenModResult.found = true;
            chosenModResult.incompatible = false;
            chosenModResult.chosenTpl = chosenTpl;
            break;
        }
        return chosenModResult;
    }
    apbsGenerateModsForWeapon(sessionId, request, isPmc) {
        const pmcProfile = this.profileHelper.getPmcProfile(sessionId);
        // Get pool of mods that fit weapon
        const compatibleModsPool = request.modPool[request.parentTemplate._id];
        if (!(request.parentTemplate._props.Slots.length ||
            request.parentTemplate._props.Cartridges?.length ||
            request.parentTemplate._props.Chambers?.length)) {
            this.logger.error(this.localisationService.getText("bot-unable_to_add_mods_to_weapon_missing_ammo_slot", {
                weaponName: request.parentTemplate._name,
                weaponId: request.parentTemplate._id,
                botRole: request.botData.role
            }));
            return request.weapon;
        }
        const botEquipConfig = this.botConfig.equipment[request.botData.equipmentRole];
        const botEquipBlacklist = this.botEquipmentFilterService.getBotEquipmentBlacklist(request.botData.equipmentRole, pmcProfile.Info.Level);
        const botWeaponSightWhitelist = this.botEquipmentFilterService.getBotWeaponSightWhitelist(request.botData.equipmentRole);
        const randomisationSettings = this.botHelper.getBotRandomizationDetails(request.botData.level, botEquipConfig);
        // Iterate over mod pool and choose mods to attach
        const sortedModKeys = this.sortModKeys(Object.keys(compatibleModsPool), request.parentTemplate._id);
        for (const modSlot of sortedModKeys) {
            // Check weapon has slot for mod to fit in
            const modsParentSlot = this.getModItemSlotFromDb(modSlot, request.parentTemplate);
            if (!modsParentSlot) {
                this.logger.error(this.localisationService.getText("bot-weapon_missing_mod_slot", {
                    modSlot: modSlot,
                    weaponId: request.parentTemplate._id,
                    weaponName: request.parentTemplate._name,
                    botRole: request.botData.role
                }));
                continue;
            }
            // Check spawn chance of mod
            const modSpawnResult = this.shouldModBeSpawned(modsParentSlot, modSlot, request.modSpawnChances, botEquipConfig);
            if (modSpawnResult === ModSpawn_1.ModSpawn.SKIP) {
                continue;
            }
            const isRandomisableSlot = randomisationSettings?.randomisedWeaponModSlots?.includes(modSlot) ?? false;
            const modToSpawnRequest = {
                modSlot: modSlot,
                isRandomisableSlot: isRandomisableSlot,
                randomisationSettings: randomisationSettings,
                botWeaponSightWhitelist: botWeaponSightWhitelist,
                botEquipBlacklist: botEquipBlacklist,
                itemModPool: compatibleModsPool,
                weapon: request.weapon,
                ammoTpl: request.ammoTpl,
                parentTemplate: request.parentTemplate,
                modSpawnResult: modSpawnResult,
                weaponStats: request.weaponStats,
                conflictingItemTpls: request.conflictingItemTpls,
                botData: request.botData
            };
            const modToAdd = this.chooseModToPutIntoSlot(modToSpawnRequest);
            // Compatible mod not found
            if (!modToAdd || typeof modToAdd === "undefined") {
                continue;
            }
            if (!this.isModValidForSlot(modToAdd, modsParentSlot, modSlot, request.parentTemplate, request.botData.role)) {
                continue;
            }
            const modToAddTemplate = modToAdd[1];
            // Skip adding mod to weapon if type limit reached
            if (this.botWeaponModLimitService.weaponModHasReachedLimit(request.botData.equipmentRole, modToAddTemplate, request.modLimits, request.parentTemplate, request.weapon)) {
                continue;
            }
            // If item is a mount for scopes, set scope chance to 100%, this helps fix empty mounts appearing on weapons
            if (this.modSlotCanHoldScope(modSlot, modToAddTemplate._parent)) {
                // mod_mount was picked to be added to weapon, force scope chance to ensure its filled
                let scopeSlots = ["mod_scope", "mod_scope_000", "mod_scope_001", "mod_scope_002", "mod_scope_003"];
                if (isPmc)
                    scopeSlots = ["mod_scope", "mod_scope_000"];
                this.adjustSlotSpawnChances(request.modSpawnChances, scopeSlots, 100);
                // Hydrate pool of mods that fit into mount as its a randomisable slot
                if (isRandomisableSlot) {
                    // Add scope mods to modPool dictionary to ensure the mount has a scope in the pool to pick
                    this.addCompatibleModsForProvidedMod("mod_scope", modToAddTemplate, request.modPool, botEquipBlacklist);
                }
            }
            /*
            if (!isPmc)
            {
                // If picked item is muzzle adapter that can hold a child, adjust spawn chance
                if (this.modSlotCanHoldMuzzleDevices(modSlot, modToAddTemplate._parent))
                {
                    const muzzleSlots = ["mod_muzzle", "mod_muzzle_000", "mod_muzzle_001"];
                    // Make chance of muzzle devices 95%
                    this.adjustSlotSpawnChances(request.modSpawnChances, muzzleSlots, 95);
                }
            }
            */
            // If front/rear sight are to be added, set opposite to 100% chance
            if (this.modIsFrontOrRearSight(modSlot, modToAddTemplate._id)) {
                request.modSpawnChances.mod_sight_front = 100;
                request.modSpawnChances.mod_sight_rear = 100;
            }
            // Handguard mod can take a sub handguard mod + weapon has no UBGL (takes same slot)
            // Force spawn chance to be 100% to ensure it gets added
            if (modSlot === "mod_handguard" &&
                modToAddTemplate._props.Slots.some((slot) => slot._name === "mod_handguard") &&
                !request.weapon.some((item) => item.slotId === "mod_launcher")) {
                // Needed for handguards with lower
                request.modSpawnChances.mod_handguard = 100;
            }
            // If stock mod can take a sub stock mod, force spawn chance to be 100% to ensure sub-stock gets added
            // Or if mod_stock is configured to be forced on
            if (this.shouldForceSubStockSlots(modSlot, botEquipConfig, modToAddTemplate)) {
                // Stock mod can take additional stocks, could be a locking device, force 100% chance
                const subStockSlots = ["mod_stock", "mod_stock_000", "mod_stock_001", "mod_stock_akms"];
                this.adjustSlotSpawnChances(request.modSpawnChances, subStockSlots, 100);
            }
            // Gather stats on mods being added to weapon
            if (this.itemHelper.isOfBaseclass(modToAddTemplate._id, BaseClasses_1.BaseClasses.IRON_SIGHT)) {
                if (modSlot === "mod_sight_front") {
                    request.weaponStats.hasFrontIronSight = true;
                }
                else if (modSlot === "mod_sight_rear") {
                    request.weaponStats.hasRearIronSight = true;
                }
            }
            else if (!request.weaponStats.hasOptic &&
                this.itemHelper.isOfBaseclass(modToAddTemplate._id, BaseClasses_1.BaseClasses.SIGHTS)) {
                request.weaponStats.hasOptic = true;
            }
            const modId = this.hashUtil.generate();
            request.weapon.push(this.createModItem(modId, modToAddTemplate._id, request.weaponId, modSlot, modToAddTemplate, request.botData.role));
            // Update conflicting item list now item has been chosen
            for (const conflictingItem of modToAddTemplate._props.ConflictingItems) {
                request.conflictingItemTpls.add(conflictingItem);
            }
            // I first thought we could use the recursive generateModsForItems as previously for cylinder magazines.
            // However, the recursion doesn't go over the slots of the parent mod but over the modPool which is given by the bot config
            // where we decided to keep cartridges instead of camoras. And since a CylinderMagazine only has one cartridge entry and
            // this entry is not to be filled, we need a special handling for the CylinderMagazine
            const modParentItem = this.itemHelper.getItem(modToAddTemplate._parent)[1];
            if (this.botWeaponGeneratorHelper.magazineIsCylinderRelated(modParentItem._name)) {
                // We don't have child mods, we need to create the camoras for the magazines instead
                this.fillCamora(request.weapon, request.modPool, modId, modToAddTemplate);
            }
            else {
                let containsModInPool = Object.keys(request.modPool).includes(modToAddTemplate._id);
                // Sometimes randomised slots are missing sub-mods, if so, get values from mod pool service
                // Check for a randomisable slot + without data in modPool + item being added as additional slots
                if (isRandomisableSlot && !containsModInPool && modToAddTemplate._props.Slots.length > 0) {
                    const modFromService = this.botEquipmentModPoolService.getModsForWeaponSlot(modToAddTemplate._id);
                    if (Object.keys(modFromService ?? {}).length > 0) {
                        request.modPool[modToAddTemplate._id] = modFromService;
                        containsModInPool = true;
                    }
                }
                if (containsModInPool) {
                    const recursiveRequestData = {
                        weapon: request.weapon,
                        modPool: request.modPool,
                        weaponId: modId,
                        parentTemplate: modToAddTemplate,
                        modSpawnChances: request.modSpawnChances,
                        ammoTpl: request.ammoTpl,
                        botData: {
                            role: request.botData.role,
                            level: request.botData.level,
                            equipmentRole: request.botData.equipmentRole
                        },
                        modLimits: request.modLimits,
                        weaponStats: request.weaponStats,
                        conflictingItemTpls: request.conflictingItemTpls
                    };
                    // Call self recursively to add mods to this mod
                    this.apbsGenerateModsForWeapon(sessionId, recursiveRequestData, isPmc);
                }
            }
        }
        return request.weapon;
    }
};
exports.APBSBotEquipmentModGenerator = APBSBotEquipmentModGenerator;
exports.APBSBotEquipmentModGenerator = APBSBotEquipmentModGenerator = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("PrimaryLogger")),
    __param(1, (0, tsyringe_1.inject)("HashUtil")),
    __param(2, (0, tsyringe_1.inject)("RandomUtil")),
    __param(3, (0, tsyringe_1.inject)("ProbabilityHelper")),
    __param(4, (0, tsyringe_1.inject)("DatabaseService")),
    __param(5, (0, tsyringe_1.inject)("ItemHelper")),
    __param(6, (0, tsyringe_1.inject)("BotEquipmentFilterService")),
    __param(7, (0, tsyringe_1.inject)("ItemFilterService")),
    __param(8, (0, tsyringe_1.inject)("ProfileHelper")),
    __param(9, (0, tsyringe_1.inject)("BotWeaponModLimitService")),
    __param(10, (0, tsyringe_1.inject)("BotHelper")),
    __param(11, (0, tsyringe_1.inject)("BotGeneratorHelper")),
    __param(12, (0, tsyringe_1.inject)("BotWeaponGeneratorHelper")),
    __param(13, (0, tsyringe_1.inject)("WeightedRandomHelper")),
    __param(14, (0, tsyringe_1.inject)("PresetHelper")),
    __param(15, (0, tsyringe_1.inject)("LocalisationService")),
    __param(16, (0, tsyringe_1.inject)("BotEquipmentModPoolService")),
    __param(17, (0, tsyringe_1.inject)("ConfigServer")),
    __param(18, (0, tsyringe_1.inject)("PrimaryCloner")),
    __param(19, (0, tsyringe_1.inject)("APBSEquipmentGetter")),
    __param(20, (0, tsyringe_1.inject)("APBSTierGetter")),
    __param(21, (0, tsyringe_1.inject)("RaidInformation")),
    __param(22, (0, tsyringe_1.inject)("ModInformation")),
    __param(23, (0, tsyringe_1.inject)("APBSTester")),
    __metadata("design:paramtypes", [typeof (_a = typeof ILogger_1.ILogger !== "undefined" && ILogger_1.ILogger) === "function" ? _a : Object, typeof (_b = typeof HashUtil_1.HashUtil !== "undefined" && HashUtil_1.HashUtil) === "function" ? _b : Object, typeof (_c = typeof RandomUtil_1.RandomUtil !== "undefined" && RandomUtil_1.RandomUtil) === "function" ? _c : Object, typeof (_d = typeof ProbabilityHelper_1.ProbabilityHelper !== "undefined" && ProbabilityHelper_1.ProbabilityHelper) === "function" ? _d : Object, typeof (_e = typeof DatabaseService_1.DatabaseService !== "undefined" && DatabaseService_1.DatabaseService) === "function" ? _e : Object, typeof (_f = typeof ItemHelper_1.ItemHelper !== "undefined" && ItemHelper_1.ItemHelper) === "function" ? _f : Object, typeof (_g = typeof BotEquipmentFilterService_1.BotEquipmentFilterService !== "undefined" && BotEquipmentFilterService_1.BotEquipmentFilterService) === "function" ? _g : Object, typeof (_h = typeof ItemFilterService_1.ItemFilterService !== "undefined" && ItemFilterService_1.ItemFilterService) === "function" ? _h : Object, typeof (_j = typeof ProfileHelper_1.ProfileHelper !== "undefined" && ProfileHelper_1.ProfileHelper) === "function" ? _j : Object, typeof (_k = typeof BotWeaponModLimitService_1.BotWeaponModLimitService !== "undefined" && BotWeaponModLimitService_1.BotWeaponModLimitService) === "function" ? _k : Object, typeof (_l = typeof BotHelper_1.BotHelper !== "undefined" && BotHelper_1.BotHelper) === "function" ? _l : Object, typeof (_m = typeof BotGeneratorHelper_1.BotGeneratorHelper !== "undefined" && BotGeneratorHelper_1.BotGeneratorHelper) === "function" ? _m : Object, typeof (_o = typeof BotWeaponGeneratorHelper_1.BotWeaponGeneratorHelper !== "undefined" && BotWeaponGeneratorHelper_1.BotWeaponGeneratorHelper) === "function" ? _o : Object, typeof (_p = typeof WeightedRandomHelper_1.WeightedRandomHelper !== "undefined" && WeightedRandomHelper_1.WeightedRandomHelper) === "function" ? _p : Object, typeof (_q = typeof PresetHelper_1.PresetHelper !== "undefined" && PresetHelper_1.PresetHelper) === "function" ? _q : Object, typeof (_r = typeof LocalisationService_1.LocalisationService !== "undefined" && LocalisationService_1.LocalisationService) === "function" ? _r : Object, typeof (_s = typeof BotEquipmentModPoolService_1.BotEquipmentModPoolService !== "undefined" && BotEquipmentModPoolService_1.BotEquipmentModPoolService) === "function" ? _s : Object, typeof (_t = typeof ConfigServer_1.ConfigServer !== "undefined" && ConfigServer_1.ConfigServer) === "function" ? _t : Object, typeof (_u = typeof ICloner_1.ICloner !== "undefined" && ICloner_1.ICloner) === "function" ? _u : Object, typeof (_v = typeof APBSEquipmentGetter_1.APBSEquipmentGetter !== "undefined" && APBSEquipmentGetter_1.APBSEquipmentGetter) === "function" ? _v : Object, typeof (_w = typeof APBSTierGetter_1.APBSTierGetter !== "undefined" && APBSTierGetter_1.APBSTierGetter) === "function" ? _w : Object, typeof (_x = typeof RaidInformation_1.RaidInformation !== "undefined" && RaidInformation_1.RaidInformation) === "function" ? _x : Object, typeof (_y = typeof ModInformation_1.ModInformation !== "undefined" && ModInformation_1.ModInformation) === "function" ? _y : Object, typeof (_z = typeof APBSTester_1.APBSTester !== "undefined" && APBSTester_1.APBSTester) === "function" ? _z : Object])
], APBSBotEquipmentModGenerator);
//# sourceMappingURL=APBSBotEquipmentModGenerator.js.map