/* eslint-disable @typescript-eslint/naming-convention */
import type { VoiceConfig } from "./references/configConsts";
import fs from "node:fs";
import path from "node:path";
import type { WTTInstanceManager } from "./WTTInstanceManager";
import type { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import type { IBotType } from "@spt/models/eft/common/tables/IBotType";


export class CustomVoiceService 
{
    private instanceManager: WTTInstanceManager;

    public preSptLoad(instanceManager: WTTInstanceManager): void 
    {
        this.instanceManager = instanceManager;
    }

    public postDBLoad(): void {
        if (this.instanceManager.debug) {
            console.log("Starting CustomVoiceService postDBLoad");
        }
    
        // Read the voice config files from the directory
        const configFiles = fs.readdirSync(path.join(__dirname, "../db/voices"))
            .filter(file => file.endsWith(".json"));
    
        // Process each file and each voice config separately
        for (const file of configFiles) {
            const configPath = path.join(__dirname, "../db/voices", file);
            try {
                const configFileContents = fs.readFileSync(configPath, "utf-8");
                const voiceConfig = JSON.parse(configFileContents) as VoiceConfig;
    
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
            } catch (error) {
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
    private processVoiceConfig(voiceConfig: VoiceConfig[string], voiceId: string): void
    {
        if (this.instanceManager.debug) 
        {
            console.log("Processing voice config:", voiceConfig);
        }
        let addVoiceToPlayer = false;
        if (voiceConfig.addVoiceToPlayer)
        {
            addVoiceToPlayer = true
        }
        if (this.instanceManager.debug) 
        {
            console.log("loading voice", voiceId);
            console.log("locales", voiceConfig.locales);
        }
        const sideSpecificVoice = voiceConfig.sideSpecificVoice;
        const name = voiceConfig.name;
        // create voice and add to player optionally
        this.createAndAddVoice(voiceId, name, addVoiceToPlayer, sideSpecificVoice)

        // Handle locale
        this.handleLocale(voiceConfig, voiceId);

        this.processBotVoices(voiceConfig, voiceId);

    }

    private handleLocale(voiceConfig: VoiceConfig[string], voiceId: string): void 
    {
        for (const localeID in this.instanceManager.database.locales.global) 
        {
            if (this.instanceManager.debug) 
            {
                console.log("Processing localeID:", localeID);
            }
            try 
            {
                const itemName = `${voiceId} Name`;
    
                // Check if the locale exists, else fallback to 'en'
                const localeValue = voiceConfig.locales[localeID] || voiceConfig.locales["en"];
                
                if (localeValue && this.instanceManager.database.locales.global[localeID]) 
                {
                    this.instanceManager.database.locales.global[localeID][itemName] = localeValue;
                }
            }
            catch (error) 
            {
                console.error(`Error handling locale for ${localeID}: ${error}`);
            }
        }
    }
    

    private createAndAddVoice(voiceId: string, name: string, addVoiceToPlayer: boolean, sideSpecificVoice?: string): void {
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
    

    private processBotVoices(voiceConfig: VoiceConfig[string], voiceId: string): void {

        if (voiceConfig.addToBotTypes != null) {
            for (const botType in voiceConfig.addToBotTypes) {
                const botTypeToLower = botType.toLowerCase();
                const weight: number = voiceConfig.addToBotTypes[botTypeToLower];
                
                const botDb: IBotType = this.instanceManager.database.bots.types[botTypeToLower];
                
                botDb.appearance.voice = botDb.appearance.voice || {};
                botDb.appearance.voice[voiceId] = weight;


            }
        } else {
            if (this.instanceManager.debug) {
                console.error('Invalid addToBotTypes structure:', voiceConfig.addToBotTypes);
            }
        }
    }
    
    
}
