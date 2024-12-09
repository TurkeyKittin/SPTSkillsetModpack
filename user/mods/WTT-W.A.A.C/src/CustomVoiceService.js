"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomVoiceService = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
class CustomVoiceService {
    instanceManager;
    preSptLoad(instanceManager) {
        this.instanceManager = instanceManager;
    }
    postDBLoad() {
        if (this.instanceManager.debug) {
            console.log("Starting CustomVoiceService postDBLoad");
        }
        // Read the voice config files from the directory
        const configFiles = node_fs_1.default.readdirSync(node_path_1.default.join(__dirname, "../db/voices"))
            .filter(file => file.endsWith(".json"));
        // Process each file and each voice config separately
        for (const file of configFiles) {
            const configPath = node_path_1.default.join(__dirname, "../db/voices", file);
            try {
                const configFileContents = node_fs_1.default.readFileSync(configPath, "utf-8");
                const voiceConfig = JSON.parse(configFileContents);
                if (this.instanceManager.debug) {
                    console.log(`Processing file: ${file}`);
                }
                for (const voiceId in voiceConfig) {
                    const singleVoiceConfig = voiceConfig[voiceId];
                    if (this.instanceManager.debug) {
                        console.log(`Processing voice: ${voiceId}`);
                    }
                    this.processVoiceConfig(singleVoiceConfig, voiceId);
                }
            }
            catch (error) {
                console.error(`Error processing file ${file}:`, error);
            }
        }
        if (this.instanceManager.debug) {
            console.log("Finished postDBLoad");
        }
    }
    /**
     * Processes the voice configuration by handling the locale,
     * creating and adding the voice to the player, and adding the
     * voice to the bots.
     *
     * @param {any} database - The database object.
     * @param {any} voiceConfig - The voice configuration object.
     * @return {void}
     */
    processVoiceConfig(voiceConfig, voiceId) {
        if (this.instanceManager.debug) {
            console.log("Processing voice config:", voiceConfig);
        }
        let addVoiceToPlayer = false;
        if (voiceConfig.addVoiceToPlayer) {
            addVoiceToPlayer = true;
        }
        if (this.instanceManager.debug) {
            console.log("loading voice", voiceId);
            console.log("locales", voiceConfig.locales);
        }
        const sideSpecificVoice = voiceConfig.sideSpecificVoice;
        const name = voiceConfig.name;
        // create voice and add to player optionally
        this.createAndAddVoice(voiceId, name, addVoiceToPlayer, sideSpecificVoice);
        // Handle locale
        this.handleLocale(voiceConfig, voiceId);
        this.processBotVoices(voiceConfig, voiceId);
    }
    handleLocale(voiceConfig, voiceId) {
        for (const localeID in this.instanceManager.database.locales.global) {
            if (this.instanceManager.debug) {
                console.log("Processing localeID:", localeID);
            }
            try {
                const itemName = `${voiceId} Name`;
                // Check if the locale exists, else fallback to 'en'
                const localeValue = voiceConfig.locales[localeID] || voiceConfig.locales["en"];
                if (localeValue && this.instanceManager.database.locales.global[localeID]) {
                    this.instanceManager.database.locales.global[localeID][itemName] = localeValue;
                }
            }
            catch (error) {
                console.error(`Error handling locale for ${localeID}: ${error}`);
            }
        }
    }
    createAndAddVoice(voiceId, name, addVoiceToPlayer, sideSpecificVoice) {
        if (this.instanceManager.debug) {
            console.log("Creating and adding voice:", voiceId);
        }
        // Ensure sideSpecificVoice is handled properly as a string (or a default value can be provided)
        const newVoice = {
            "_id": voiceId,
            "_name": name,
            "_parent": "5fc100cf95572123ae738483",
            "_type": "Item",
            "_props": {
                "Name": name,
                "ShortName": name,
                "Description": name,
                "Side": sideSpecificVoice ?? ["Usec", "Bear"],
                "Prefab": name
            }
        };
        if (this.instanceManager.debug) {
            console.log("New voice:", newVoice);
        }
        // Add new voice to the database templates
        this.instanceManager.database.templates.customization[voiceId] = newVoice;
        if (addVoiceToPlayer) {
            this.instanceManager.database.templates.character.push(voiceId);
        }
    }
    processBotVoices(voiceConfig, voiceId) {
        if (voiceConfig.addToBotTypes != null) {
            for (const botType in voiceConfig.addToBotTypes) {
                const botTypeToLower = botType.toLowerCase();
                const weight = voiceConfig.addToBotTypes[botTypeToLower];
                const botDb = this.instanceManager.database.bots.types[botTypeToLower];
                botDb.appearance.voice = botDb.appearance.voice || {};
                botDb.appearance.voice[voiceId] = weight;
            }
        }
        else {
            if (this.instanceManager.debug) {
                console.error('Invalid addToBotTypes structure:', voiceConfig.addToBotTypes);
            }
        }
    }
}
exports.CustomVoiceService = CustomVoiceService;
//# sourceMappingURL=CustomVoiceService.js.map