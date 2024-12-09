"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstanceManager = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
// SPT
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
// Custom
const APBSLogger_1 = require("./Utils/APBSLogger");
const APBSStaticRouterHooks_1 = require("./RouterHooks/APBSStaticRouterHooks");
const RaidInformation_1 = require("./Globals/RaidInformation");
const ModInformation_1 = require("./Globals/ModInformation");
const TierInformation_1 = require("./Globals/TierInformation");
const ABPSBotLevelGenerator_1 = require("./Generators/ABPSBotLevelGenerator");
const BotConfigs_1 = require("./Alterations/BotConfigs");
const APBSBotWeaponGenerator_1 = require("./ClassExtensions/APBSBotWeaponGenerator");
const APBSTierGetter_1 = require("./Utils/APBSTierGetter");
const APBSEquipmentGetter_1 = require("./Utils/APBSEquipmentGetter");
const ModdedImportHelper_1 = require("./Helpers/ModdedImportHelper");
const APBSBotGenerator_1 = require("./ClassExtensions/APBSBotGenerator");
const APBSDynamicRouterHooks_1 = require("./RouterHooks/APBSDynamicRouterHooks");
const APBSBotEquipmentModGenerator_1 = require("./ClassExtensions/APBSBotEquipmentModGenerator");
const APBSBotInventoryGenerator_1 = require("./ClassExtensions/APBSBotInventoryGenerator");
const APBSBotLootGenerator_1 = require("./ClassExtensions/APBSBotLootGenerator");
const ModConfig_1 = require("./Globals/ModConfig");
const JSONHelper_1 = require("./Helpers/JSONHelper");
const BlacklistHelper_1 = require("./Helpers/BlacklistHelper");
const RealismHelper_1 = require("./Helpers/RealismHelper");
const APBSTester_1 = require("./Utils/APBSTester");
const APBSAttachmentChecker_1 = require("./Utils/APBSAttachmentChecker");
class InstanceManager {
    //#region accessible in or after preAkiLoad
    modName;
    debug;
    database;
    container;
    preSptModLoader;
    configServer;
    itemHelper;
    logger;
    staticRouter;
    dynamicRouter;
    weatherGenerator;
    modInformation;
    raidInformation;
    randUtil;
    profileHelper;
    botLevelGenerator;
    botGenerator;
    tierInformation;
    botWeaponGenerator;
    weightedRandomHelper;
    localisationService;
    hashUtil;
    inventoryMagGen;
    cloner;
    botWeaponGeneratorHelper;
    botWeaponModLimitService;
    botEquipmentModGenerator;
    botGeneratorHelper;
    repairService;
    vfs;
    apbsLogger;
    apbsTierGetter;
    apbsBotGenerator;
    apbsBotLevelGenerator;
    apbsEquipmentGetter;
    apbsStaticRouterHooks;
    apbsDynamicRouterHooks;
    apbsBotInventoryGenerator;
    apbsAttachmentChecker;
    jsonHelper;
    modConfig;
    apbsTester;
    //#endregion
    //#region accessible in or after postDBLoad
    tables;
    botConfigs;
    moddedImportHelper;
    realismHelper;
    //#endregion
    //#region accessible in or after PostSptLoad
    blacklistHelper;
    //#endregion
    // Call at the start of the mods postDBLoad method
    preSptLoad(container, mod) {
        this.modName = mod;
        // SPT Classes
        this.container = container;
        this.preSptModLoader = container.resolve("PreSptModLoader");
        this.logger = container.resolve("WinstonLogger");
        this.staticRouter = container.resolve("StaticRouterModService");
        this.dynamicRouter = container.resolve("DynamicRouterModService");
        this.weatherGenerator = container.resolve("WeatherGenerator");
        this.configServer = container.resolve("ConfigServer");
        this.itemHelper = container.resolve("ItemHelper");
        this.database = container.resolve("DatabaseService");
        this.randUtil = container.resolve("RandomUtil");
        this.profileHelper = container.resolve("ProfileHelper");
        this.botLevelGenerator = container.resolve("BotLevelGenerator");
        this.botGenerator = container.resolve("BotGenerator");
        this.botWeaponGenerator = container.resolve("BotWeaponGenerator");
        this.weightedRandomHelper = container.resolve("WeightedRandomHelper");
        this.localisationService = container.resolve("LocalisationService");
        this.hashUtil = container.resolve("HashUtil");
        this.inventoryMagGen = container.resolve("InventoryMagGen");
        this.botWeaponGeneratorHelper = container.resolve("BotWeaponGeneratorHelper");
        this.botWeaponModLimitService = container.resolve("BotWeaponModLimitService");
        this.botEquipmentModGenerator = container.resolve("BotEquipmentModGenerator");
        this.botGeneratorHelper = container.resolve("BotGeneratorHelper");
        this.repairService = container.resolve("RepairService");
        this.cloner = container.resolve("PrimaryCloner");
        this.vfs = container.resolve("VFS");
        // Custom Classes
        this.container.register("ModInformation", ModInformation_1.ModInformation, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        this.modInformation = container.resolve("ModInformation");
        this.container.register("APBSLogger", APBSLogger_1.APBSLogger, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        this.apbsLogger = container.resolve("APBSLogger");
        this.container.register("APBSTester", APBSTester_1.APBSTester, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        this.apbsTester = container.resolve("APBSTester");
        this.container.register("RaidInformation", RaidInformation_1.RaidInformation, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        this.raidInformation = container.resolve("RaidInformation");
        this.container.register("TierInformation", TierInformation_1.TierInformation, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        this.tierInformation = container.resolve("TierInformation");
        this.container.register("APBSTierGetter", APBSTierGetter_1.APBSTierGetter, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        this.apbsTierGetter = container.resolve("APBSTierGetter");
        this.container.register("APBSEquipmentGetter", APBSEquipmentGetter_1.APBSEquipmentGetter, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        this.apbsEquipmentGetter = container.resolve("APBSEquipmentGetter");
        // Custom Special
        this.container.register("APBSDynamicRouterHooks", APBSDynamicRouterHooks_1.APBSDynamicRouterHooks, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        this.apbsDynamicRouterHooks = container.resolve("APBSDynamicRouterHooks");
        this.container.register("APBSStaticRouterHooks", APBSStaticRouterHooks_1.APBSStaticRouterHooks, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        this.apbsStaticRouterHooks = container.resolve("APBSStaticRouterHooks");
        this.container.register("APBSBotLevelGenerator", ABPSBotLevelGenerator_1.APBSBotLevelGenerator, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        this.apbsBotLevelGenerator = container.resolve("APBSBotLevelGenerator");
        this.container.register("JSONHelper", JSONHelper_1.JSONHelper, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        this.jsonHelper = container.resolve("JSONHelper");
        this.container.register("APBSAttachmentChecker", APBSAttachmentChecker_1.APBSAttachmentChecker, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        this.apbsAttachmentChecker = container.resolve("APBSAttachmentChecker");
        // Class Extension Override
        this.container.register("APBSBotGenerator", APBSBotGenerator_1.APBSBotGenerator);
        this.container.register("BotGenerator", { useToken: "APBSBotGenerator" });
        this.container.register("APBSBotInventoryGenerator", APBSBotInventoryGenerator_1.APBSBotInventoryGenerator);
        this.container.register("BotInventoryGenerator", { useToken: "APBSBotInventoryGenerator" });
        this.container.register("APBSBotEquipmentModGenerator", APBSBotEquipmentModGenerator_1.APBSBotEquipmentModGenerator);
        this.container.register("BotEquipmentModGenerator", { useToken: "APBSBotEquipmentModGenerator" });
        this.container.register("APBSBotLootGenerator", APBSBotLootGenerator_1.APBSBotLootGenerator);
        this.container.register("BotLootGenerator", { useToken: "APBSBotLootGenerator" });
        this.container.register("APBSBotWeaponGenerator", APBSBotWeaponGenerator_1.APBSBotWeaponGenerator);
        this.container.register("BotWeaponGenerator", { useToken: "APBSBotWeaponGenerator" });
        // Resolve this last to set mod configs
        this.container.register("ModConfig", ModConfig_1.ModConfig, { lifecycle: tsyringe_1.Lifecycle.Singleton });
        this.modConfig = container.resolve("ModConfig");
        this.getPath();
    }
    postDBLoad(container) {
        // SPT Classes
        this.tables = container.resolve("DatabaseService").getTables();
        // Custom Classes
        this.botConfigs = new BotConfigs_1.BotConfigs(this.tables, this.database, this.configServer, this.itemHelper, this.apbsEquipmentGetter, this.tierInformation, this.raidInformation, this.apbsLogger);
        this.moddedImportHelper = new ModdedImportHelper_1.ModdedImportHelper(this.tables, this.database, this.itemHelper, this.tierInformation, this.apbsEquipmentGetter, this.apbsAttachmentChecker, this.apbsLogger);
        this.realismHelper = new RealismHelper_1.RealismHelper(this.tierInformation, this.apbsEquipmentGetter, this.apbsLogger);
    }
    postSptLoad(container) {
        // SPT Classes
        this.tables = container.resolve("DatabaseService").getTables();
        // Custom Classes
        this.blacklistHelper = new BlacklistHelper_1.BlacklistHelper(this.database, this.apbsEquipmentGetter, this.apbsLogger);
    }
    getPath() {
        const dirPath = path.dirname(__filename);
        const modDir = path.join(dirPath, "..", "..");
        const key = "V2F5ZmFyZXI=";
        const keyDE = Buffer.from(key, "base64");
        const contents = fs.readdirSync(modDir).includes(keyDE.toString());
        if (contents) {
            return true;
        }
        return false;
    }
}
exports.InstanceManager = InstanceManager;
//# sourceMappingURL=InstanceManager.js.map