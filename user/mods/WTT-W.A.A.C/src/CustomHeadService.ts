/* eslint-disable @typescript-eslint/naming-convention */
import type { ICustomizationItem } from "@spt/models/eft/common/tables/ICustomizationItem";
import type { WTTInstanceManager } from "./WTTInstanceManager";
import fs from "node:fs";
import path from "node:path";
import type { HeadConfig } from "./references/configConsts";

export class CustomHeadService 
{
    private instanceManager: WTTInstanceManager;

    public preSptLoad(instanceManager: WTTInstanceManager): void 
    {
        this.instanceManager = instanceManager;
    }

    public postDBLoad(): void 
    {
        const headsJsonPath = path.join(__dirname, "../db/heads");

        const configFiles = fs
            .readdirSync(headsJsonPath)
    
    
        for (const file of configFiles) {
            const filePath = path.join(headsJsonPath, file);
    
            try {
                const fileContents = fs.readFileSync(filePath, "utf-8");
                const config = JSON.parse(fileContents);
    
                for (const headId in config) {
                    const headConfig: HeadConfig = config[headId];
                    this.processHeadConfigs(headId, headConfig);
                }
            }
            catch (error) {
                console.log(error);
            }
        }


    }

    private processHeadConfigs(headId: string, headConfig: HeadConfig) 
    {
        const iCustomizationHead = this.generateHeadSpecificConfig(headId, headConfig);

        const addHeadToPlayer = headConfig.addHeadToPlayer;
        this.addHeadToTemplates(headId, iCustomizationHead, addHeadToPlayer);
        this.handleLocale(headConfig, headId);
    }

    private generateHeadSpecificConfig(headId: string, headConfig: HeadConfig): ICustomizationItem 
    {
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

    private addHeadToTemplates(
        headId: string,
        iCustomizationHead: ICustomizationItem,
        addHeadToPlayer: boolean
    ) 
    {
        const templates = this.instanceManager.database.templates;
        templates.customization[headId] = iCustomizationHead as ICustomizationItem;
        
        if (addHeadToPlayer) 
        {
            templates.character.push(headId);
        }
    }


    private handleLocale(headConfig: HeadConfig, headId: string): void 
{
    for (const localeID in this.instanceManager.database.locales.global) 
    {
        if (this.instanceManager.debug) 
        {
            console.log("Processing localeID:", localeID);
        }
        try 
        {
            const itemName = `${headId} Name`;

            // Check if the locale exists, else fallback to 'en'
            const localeValue = headConfig.locales[localeID] || headConfig.locales["en"];
            
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

}
