"use strict";
/* eslint-disable @typescript-eslint/naming-convention */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const LogTextColor_1 = require("C:/snapshot/project/obj/models/spt/logging/LogTextColor");
// WTT imports
const WTTInstanceManager_1 = require("./WTTInstanceManager");
const CustomHeadService_1 = require("./CustomHeadService");
const CustomVoiceService_1 = require("./CustomVoiceService");
const CustomClothingService_1 = require("./CustomClothingService");
class WAAC {
    instanceManager = new WTTInstanceManager_1.WTTInstanceManager();
    version;
    modName = "WTT - W.A.A.C. (Women's Advanced Assault Corps)";
    customHeadService = new CustomHeadService_1.CustomHeadService();
    customVoiceService = new CustomVoiceService_1.CustomVoiceService();
    customClothingService = new CustomClothingService_1.CustomClothingService();
    debug = false;
    // Anything that needs done on preSptLoad, place here.
    preSptLoad(container) {
        // Initialize the instance manager DO NOTHING ELSE BEFORE THIS
        this.instanceManager.preSptLoad(container, this.modName);
        this.instanceManager.debug = this.debug;
        // EVERYTHING AFTER HERE MUST USE THE INSTANCE
        this.getVersionFromJson();
        this.displayCreditBanner();
        this.customHeadService.preSptLoad(this.instanceManager);
        this.customClothingService.preSptLoad(this.instanceManager);
        this.customVoiceService.preSptLoad(this.instanceManager);
    }
    // Anything that needs done on postDBLoad, place here.
    postDBLoad(container) {
        // Initialize the instance manager DO NOTHING ELSE BEFORE THIS
        this.instanceManager.postDBLoad(container);
        // EVERYTHING AFTER HERE MUST USE THE INSTANCE
        this.customHeadService.postDBLoad();
        this.customClothingService.postDBLoad();
        this.customVoiceService.postDBLoad();
        this.instanceManager.logger.log(`[${this.modName}] Database: Loading complete.`, LogTextColor_1.LogTextColor.GREEN);
    }
    getVersionFromJson() {
        const packageJsonPath = node_path_1.default.join(__dirname, "../package.json");
        node_fs_1.default.readFile(packageJsonPath, "utf-8", (err, data) => {
            if (err) {
                console.error("Error reading file:", err);
                return;
            }
            const jsonData = JSON.parse(data);
            this.version = jsonData.version;
        });
    }
    displayCreditBanner() {
        this.instanceManager.colorLog(`[${this.modName}] Developers: GroovypenguinX
                                                            The Girls Get IT DONE`, "green");
    }
}
module.exports = { mod: new WAAC() };
//# sourceMappingURL=mod.js.map