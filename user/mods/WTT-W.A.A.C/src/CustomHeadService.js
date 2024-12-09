"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomHeadService = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
class CustomHeadService {
    instanceManager;
    preSptLoad(instanceManager) {
        this.instanceManager = instanceManager;
    }
    postDBLoad() {
        const headsJsonPath = node_path_1.default.join(__dirname, "../db/heads");
        const configFiles = node_fs_1.default
            .readdirSync(headsJsonPath);
        for (const file of configFiles) {
            const filePath = node_path_1.default.join(headsJsonPath, file);
            try {
                const fileContents = node_fs_1.default.readFileSync(filePath, "utf-8");
                const config = JSON.parse(fileContents);
                for (const headId in config) {
                    const headConfig = config[headId];
                    this.processHeadConfigs(headId, headConfig);
                }
            }
            catch (error) {
                console.log(error);
            }
        }
    }
    processHeadConfigs(headId, headConfig) {
        const iCustomizationHead = this.generateHeadSpecificConfig(headId, headConfig);
        const addHeadToPlayer = headConfig.addHeadToPlayer;
        this.addHeadToTemplates(headId, iCustomizationHead, addHeadToPlayer);
        this.handleLocale(headConfig, headId);
    }
    generateHeadSpecificConfig(headId, headConfig) {
        return {
            _id: headId,
            _name: null,
            _parent: "5cc085e214c02e000c6bea67",
            _type: "Item",
            _props: {
                Name: null,
                ShortName: null,
                Description: null,
                Side: headConfig.side,
                BodyPart: "Head",
                Prefab: {
                    path: headConfig.path,
                    rcid: ""
                }
            }
        };
    }
    addHeadToTemplates(headId, iCustomizationHead, addHeadToPlayer) {
        const templates = this.instanceManager.database.templates;
        templates.customization[headId] = iCustomizationHead;
        if (addHeadToPlayer) {
            templates.character.push(headId);
        }
    }
    handleLocale(headConfig, headId) {
        for (const localeID in this.instanceManager.database.locales.global) {
            if (this.instanceManager.debug) {
                console.log("Processing localeID:", localeID);
            }
            try {
                const itemName = `${headId} Name`;
                // Check if the locale exists, else fallback to 'en'
                const localeValue = headConfig.locales[localeID] || headConfig.locales["en"];
                if (localeValue && this.instanceManager.database.locales.global[localeID]) {
                    this.instanceManager.database.locales.global[localeID][itemName] = localeValue;
                }
            }
            catch (error) {
                console.error(`Error handling locale for ${localeID}: ${error}`);
            }
        }
    }
}
exports.CustomHeadService = CustomHeadService;
//# sourceMappingURL=CustomHeadService.js.map