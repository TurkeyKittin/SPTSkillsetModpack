"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mod = void 0;
// Custom
const Logging_1 = require("./Enums/Logging");
const InstanceManager_1 = require("./InstanceManager");
const ModConfig_1 = require("./Globals/ModConfig");
class APBS {
    instance = new InstanceManager_1.InstanceManager();
    preSptLoad(container) {
        const start = performance.now();
        this.instance.preSptLoad(container, "APBS");
        // Set Mod Configuration Settings
        this.instance.modConfig.serverLogDetails();
        // Check and configure for Questing Bots if necessary
        const questingBots = this.instance.preSptModLoader.getImportedModsNames().includes("DanW-SPTQuestingBots");
        this.instance.apbsLogger.createLogFiles();
        if (questingBots) {
            this.instance.apbsLogger.log(Logging_1.Logging.WARN, "Questing Bots Detected. Updated bot logging.");
            this.instance.apbsDynamicRouterHooks.registerQBRouterHooks();
        }
        // Register necessary routers & SPT method changes
        this.instance.apbsStaticRouterHooks.registerRouterHooks();
        this.instance.apbsBotLevelGenerator.registerBotLevelGenerator(container);
        if (ModConfig_1.ModConfig.config.usePreset) {
            this.instance.raidInformation.usingDefaultDB = false;
            this.instance.jsonHelper.usePreset(ModConfig_1.ModConfig.config.presetName);
        }
        else {
            this.instance.raidInformation.usingDefaultDB = true;
            this.instance.jsonHelper.buildTierJson();
        }
        const timeTaken = performance.now() - start;
        this.instance.apbsLogger.log(Logging_1.Logging.DEBUG, `${timeTaken.toFixed(2)}ms for APBS.preSptLoad`);
    }
    postDBLoad(container) {
        const start = performance.now();
        this.instance.postDBLoad(container);
        //Do postDBLoad stuff
        this.instance.botConfigs.initialize();
        this.instance.moddedImportHelper.initialize();
        // Check and configure for Realism if necessary
        const realism = this.instance.preSptModLoader.getImportedModsNames().includes("SPT-Realism");
        if (realism && !ModConfig_1.ModConfig.config.disableRealismGasMasks) {
            this.instance.apbsLogger.log(Logging_1.Logging.WARN, "Realism Detected. Adding gas masks...");
            this.instance.realismHelper.initialize();
        }
        // Only do this if you need to build a new attachment list
        // this.instance.apbsAttachmentChecker.buildAttachmentList();
        const timeTaken = performance.now() - start;
        this.instance.apbsLogger.log(Logging_1.Logging.DEBUG, `${timeTaken.toFixed(2)}ms for APBS.postDBLoad`);
    }
    postSptLoad(container) {
        const start = performance.now();
        this.instance.postSptLoad(container);
        //Do postSPTLoad stuff
        this.instance.blacklistHelper.initialize();
        if (this.instance.modInformation.versionNumber.includes("alpha")) {
            this.instance.apbsLogger.log(Logging_1.Logging.WARN, "!!! THIS IS AN EARLY RELEASE BUILD !!!");
            this.instance.apbsLogger.log(Logging_1.Logging.WARN, "Do not report problems with this anywhere except #acidphantasm-mods in the SPT Discord.");
            this.instance.apbsLogger.log(Logging_1.Logging.WARN, "Thank you for testing!");
        }
        const timeTaken = performance.now() - start;
        this.instance.apbsLogger.log(Logging_1.Logging.DEBUG, `${timeTaken.toFixed(2)}ms for APBS.postSptLoad`);
    }
}
exports.mod = new APBS();
//# sourceMappingURL=mod.js.map