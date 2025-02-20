"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseClasses_1 = require("C:/snapshot/project/obj/models/enums/BaseClasses");
const LogTextColor_1 = require("C:/snapshot/project/obj/models/spt/logging/LogTextColor");
const debug_1 = require("./debug");
const barters_json_1 = __importDefault(require("../config/barters.json"));
const cases_json_1 = __importDefault(require("../config/cases.json"));
const ItemTpl_1 = require("C:/snapshot/project/obj/models/enums/ItemTpl");
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
const json5_1 = __importDefault(require("C:/snapshot/project/node_modules/json5"));
class Mod {
    newIdMap = {
        Golden_Key_Pouch: "661cb36922c9e10dc2d9514b",
        Golden_Keycard_Case: "661cb36f5441dc730e28bcb0",
        Golden_Keychain1: "661cb372e5eb56290da76c3e",
        Golden_Keychain2: "661cb3743bf00d3d145518b3",
        Golden_Keychain3: "661cb376b16226f648eb0cdc"
    };
    logger;
    modName;
    modVersion;
    container;
    profileHelper;
    itemHelper;
    vfs;
    config;
    constructor() {
        this.modName = "Gilded Key Storage";
    }
    preSptLoad(container) {
        this.container = container;
        const staticRouterModService = container.resolve("StaticRouterModService");
        const saveServer = container.resolve("SaveServer");
        const logger = container.resolve("WinstonLogger");
        this.profileHelper = container.resolve("ProfileHelper");
        this.itemHelper = container.resolve("ItemHelper");
        this.vfs = container.resolve("VFS");
        // Load our config
        this.loadConfig();
        // On game start, see if we need to fix issues from previous versions
        // Note: We do this as a method replacement so we can run _before_ SPT's gameStart
        container.afterResolution("GameController", (_, result) => {
            const originalGameStart = result.gameStart;
            result.gameStart = (url, info, sessionID, startTimeStampMS) => {
                // If there's a profile ID passed in, call our fixer method
                if (sessionID) {
                    this.fixProfile(sessionID);
                }
                // Call the original
                originalGameStart.apply(result, [url, info, sessionID, startTimeStampMS]);
            };
        });
        // Setup debugging if enabled
        const debugUtil = new debug_1.Debug(this.config.debug);
        debugUtil.giveProfileAllKeysAndGildedCases(staticRouterModService, saveServer, logger);
        debugUtil.removeAllDebugInstanceIdsFromProfile(staticRouterModService, saveServer);
    }
    postDBLoad(container) {
        this.logger = container.resolve("WinstonLogger");
        this.logger.log(`[${this.modName}] : Mod loading`, LogTextColor_1.LogTextColor.GREEN);
        const debugUtil = new debug_1.Debug(this.config.debug);
        const databaseServer = container.resolve("DatabaseServer");
        const dbTables = databaseServer.getTables();
        const restrInRaid = dbTables.globals.config.RestrictionsInRaid;
        const dbTemplates = dbTables.templates;
        const dbTraders = dbTables.traders;
        const dbItems = dbTemplates.items;
        const dbLocales = dbTables.locales.global.en;
        this.combatibilityThings(dbItems);
        for (const caseName of Object.keys(cases_json_1.default)) {
            this.createCase(container, cases_json_1.default[caseName], dbTables);
        }
        this.pushSupportiveBarters(dbTraders);
        this.adjustItemProperties(dbItems);
        this.setLabsCardInRaidLimit(restrInRaid, 9);
        debugUtil.logMissingKeys(this.logger, this.itemHelper, dbItems, dbLocales);
    }
    loadConfig() {
        const userConfigPath = path_1.default.resolve(__dirname, "../config/config.json5");
        const defaultConfigPath = path_1.default.resolve(__dirname, "../config/config.default.json5");
        // Copy the default config if the user config doesn't exist yet
        if (!(0, fs_1.existsSync)(userConfigPath)) {
            (0, fs_1.copyFileSync)(defaultConfigPath, userConfigPath);
        }
        this.config = json5_1.default.parse(this.vfs.readFile(userConfigPath));
    }
    pushSupportiveBarters(dbTraders) {
        for (const barter of Object.keys(barters_json_1.default)) {
            this.pushToTrader(barters_json_1.default[barter], barters_json_1.default[barter].id, dbTraders);
        }
    }
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    setLabsCardInRaidLimit(restrInRaid, limitAmount) {
        if (restrInRaid === undefined)
            return;
        //restrInRaid type set to any to shut the linter up because the type doesn't include MaxIn... props
        //set labs access card limit in raid to 9 so the keycard case can be filled while on pmc
        for (const restr in restrInRaid) {
            const thisRestriction = restrInRaid[restr];
            if (thisRestriction.TemplateId === "5c94bbff86f7747ee735c08f") {
                thisRestriction.MaxInLobby = limitAmount;
                thisRestriction.MaxInRaid = limitAmount;
            }
        }
    }
    adjustItemProperties(dbItems) {
        for (const [_, item] of Object.entries(dbItems)) {
            // Skip anything that isn't specifically an Item type item
            if (item._type !== "Item") {
                continue;
            }
            const itemProps = item._props;
            // Adjust key specific properties
            if (this.itemHelper.isOfBaseclass(item._id, BaseClasses_1.BaseClasses.KEY)) {
                if (this.config.weightless_keys) {
                    itemProps.Weight = 0.0;
                }
                itemProps.InsuranceDisabled = !this.config.key_insurance_enabled;
                // If keys are to be set to no limit, and we're either not using the finite keys list, or this key doesn't exist
                // in it, set the key max usage to 0 (infinite)
                if (this.config.no_key_use_limit &&
                    (!this.config.use_finite_keys_list || !this.config.finite_keys_list.includes(item._id))) {
                    itemProps.MaximumNumberOfUsage = 0;
                }
                if (this.config.keys_are_discardable) {
                    // BSG uses DiscordLimit == 0 to flag as not insurable, so we need to swap to the flag
                    if (itemProps.DiscardLimit === 0) {
                        itemProps.InsuranceDisabled = true;
                    }
                    itemProps.DiscardLimit = -1;
                }
            }
            // Remove keys from secure container exclude filter
            if (this.config.all_keys_in_secure && this.itemHelper.isOfBaseclass(item._id, BaseClasses_1.BaseClasses.MOB_CONTAINER) && itemProps?.Grids) {
                // Theta container has multiple grids, so we need to loop through all grids
                for (const grid of itemProps.Grids) {
                    const filter = grid?._props?.filters[0];
                    if (filter) {
                        // Exclude items with a base class of KEY. Have to check that it's an "Item" type first because isOfBaseClass only accepts Items
                        filter.ExcludedFilter = filter.ExcludedFilter.filter(itemTpl => this.itemHelper.getItem(itemTpl)[1]?._type !== "Item" || !this.itemHelper.isOfBaseclass(itemTpl, BaseClasses_1.BaseClasses.KEY));
                    }
                }
            }
        }
    }
    combatibilityThings(dbItems) {
        //do a compatibility correction to make this mod work with other mods with destructive code (cough, SVM, cough)
        //basically just add the filters element back to backpacks and secure containers if they've been removed by other mods
        const compatFiltersElement = [{ Filter: [BaseClasses_1.BaseClasses.ITEM], ExcludedFilter: [] }];
        for (const [_, item] of Object.entries(dbItems)) {
            // Skip non-items
            if (item._type !== "Item")
                continue;
            if (item._parent === BaseClasses_1.BaseClasses.BACKPACK ||
                item._parent === BaseClasses_1.BaseClasses.VEST ||
                (this.itemHelper.isOfBaseclass(item._id, BaseClasses_1.BaseClasses.MOB_CONTAINER) && item._id !== "5c0a794586f77461c458f892")) {
                for (const grid of item._props.Grids) {
                    if (grid._props.filters[0] === undefined) {
                        grid._props.filters = structuredClone(compatFiltersElement);
                    }
                }
            }
        }
    }
    createCase(container, caseConfig, tables) {
        const handbook = tables.templates.handbook;
        const locales = Object.values(tables.locales.global);
        const itemID = caseConfig.id;
        const itemPrefabPath = `CaseBundles/${itemID}.bundle`;
        const templateId = this.newIdMap[itemID];
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        let item;
        //clone a case
        if (caseConfig.case_type === "container") {
            item = structuredClone(tables.templates.items["5d235bb686f77443f4331278"]);
            item._props.IsAlwaysAvailableForInsurance = true;
            item._props.DiscardLimit = -1;
        }
        if (caseConfig.case_type === "slots") {
            item = structuredClone(tables.templates.items["5a9d6d00a2750c5c985b5305"]);
            item._props.IsAlwaysAvailableForInsurance = true;
            item._props.DiscardLimit = -1;
            item._props.ItemSound = caseConfig.sound;
        }
        item._id = templateId;
        item._props.Prefab.path = itemPrefabPath;
        //call methods to set the grid or slot cells up
        if (caseConfig.case_type === "container") {
            item._props.Grids = this.createGrid(container, templateId, caseConfig);
        }
        if (caseConfig.case_type === "slots") {
            item._props.Slots = this.createSlot(container, templateId, caseConfig);
        }
        //set external size of the container:
        item._props.Width = caseConfig.ExternalSize.width;
        item._props.Height = caseConfig.ExternalSize.height;
        tables.templates.items[templateId] = item;
        //add locales
        for (const locale of locales) {
            locale[`${templateId} Name`] = caseConfig.item_name;
            locale[`${templateId} ShortName`] = caseConfig.item_short_name;
            locale[`${templateId} Description`] = caseConfig.item_description;
        }
        item._props.CanSellOnRagfair = !caseConfig.flea_banned;
        item._props.InsuranceDisabled = !caseConfig.insurance_enabled;
        const price = caseConfig.flea_price;
        handbook.Items.push({
            Id: templateId,
            ParentId: "5b5f6fa186f77409407a7eb7",
            Price: price
        });
        //allow or disallow in secure containers, backpacks, other specific items per the config
        this.allowIntoContainers(templateId, tables.templates.items, caseConfig.allow_in_secure_containers, caseConfig.allow_in_backpacks, caseConfig.case_allowed_in, caseConfig.case_disallowed_in);
        this.pushToTrader(caseConfig, templateId, tables.traders);
    }
    pushToTrader(caseConfig, itemID, dbTraders) {
        const traderIDs = {
            mechanic: "5a7c2eca46aef81a7ca2145d",
            skier: "58330581ace78e27b8b10cee",
            peacekeeper: "5935c25fb3acc3127c3d8cd9",
            therapist: "54cb57776803fa99248b456e",
            prapor: "54cb50c76803fa8b248b4571",
            jaeger: "5c0647fdd443bc2504c2d371",
            ragman: "5ac3b934156ae10c4430e83c"
        };
        /*
        const currencyIDs = {
            "roubles": "5449016a4bdc2d6f028b456f",
            "euros": "569668774bdc2da2298b4568",
            "dollars": "5696686a4bdc2da3298b456a"
        };
        */
        //add to config trader's inventory
        let traderToPush = caseConfig.trader;
        for (const [key, val] of Object.entries(traderIDs)) {
            if (key === caseConfig.trader) {
                traderToPush = val;
            }
        }
        const trader = dbTraders[traderToPush];
        trader.assort.items.push({
            _id: itemID,
            _tpl: itemID,
            parentId: "hideout",
            slotId: "hideout",
            upd: {
                UnlimitedCount: caseConfig.unlimited_stock,
                StackObjectsCount: caseConfig.stock_amount
            }
        });
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const barterTrade = [];
        const configBarters = caseConfig.barter;
        for (const barter in configBarters) {
            barterTrade.push(configBarters[barter]);
        }
        trader.assort.barter_scheme[itemID] = [barterTrade];
        trader.assort.loyal_level_items[itemID] = caseConfig.trader_loyalty_level;
    }
    allowIntoContainers(itemID, items, secContainers, backpacks, addAllowedIn, addDisallowedIn) {
        for (const [_, item] of Object.entries(items)) {
            // Skip non-items
            if (item._type !== "Item")
                continue;
            //disallow in backpacks
            if (!backpacks) {
                this.allowOrDisallowIntoCaseByParent(itemID, "exclude", item, BaseClasses_1.BaseClasses.BACKPACK);
            }
            //allow in secure containers
            if (secContainers) {
                this.allowOrDisallowIntoCaseByParent(itemID, "include", item, BaseClasses_1.BaseClasses.MOB_CONTAINER);
            }
            //disallow in additional specific items
            for (const configItem in addDisallowedIn) {
                if (addDisallowedIn[configItem] === item._id) {
                    this.allowOrDisallowIntoCaseByID(itemID, "exclude", item);
                }
            }
            //allow in additional specific items
            for (const configItem in addAllowedIn) {
                if (addAllowedIn[configItem] === item._id) {
                    this.allowOrDisallowIntoCaseByID(itemID, "include", item);
                }
            }
        }
    }
    allowOrDisallowIntoCaseByParent(customItemID, includeOrExclude, currentItem, caseParent) {
        //exclude custom case in all items of caseToApplyTo parent
        if (includeOrExclude === "exclude") {
            for (const grid of currentItem._props.Grids) {
                if (currentItem._parent === caseParent && currentItem._id !== "5c0a794586f77461c458f892") {
                    if (grid._props.filters[0].ExcludedFilter === undefined) {
                        grid._props.filters[0].ExcludedFilter = [customItemID];
                    }
                    else {
                        grid._props.filters[0].ExcludedFilter.push(customItemID);
                    }
                }
            }
        }
        //include custom case in all items of caseToApplyTo parent
        if (includeOrExclude === "include") {
            if (currentItem._parent === caseParent && currentItem._id !== "5c0a794586f77461c458f892") {
                for (const grid of currentItem._props.Grids) {
                    if (grid._props.filters[0].Filter === undefined) {
                        grid._props.filters[0].Filter = [customItemID];
                    }
                    else {
                        grid._props.filters[0].Filter.push(customItemID);
                    }
                }
            }
        }
    }
    allowOrDisallowIntoCaseByID(customItemID, includeOrExclude, currentItem) {
        //exclude custom case in specific item of caseToApplyTo id
        if (includeOrExclude === "exclude") {
            for (const grid of currentItem._props.Grids) {
                if (grid._props.filters[0].ExcludedFilter === undefined) {
                    grid._props.filters[0].ExcludedFilter = [customItemID];
                }
                else {
                    grid._props.filters[0].ExcludedFilter.push(customItemID);
                }
            }
        }
        //include custom case in specific item of caseToApplyTo id
        if (includeOrExclude === "include") {
            for (const grid of currentItem._props.Grids) {
                if (grid._props.filters[0].Filter === undefined) {
                    grid._props.filters[0].Filter = [customItemID];
                }
                else {
                    grid._props.filters[0].Filter.push(customItemID);
                }
            }
        }
    }
    createGrid(container, itemID, config) {
        const grids = [];
        let cellHeight = config.InternalSize.vertical_cells;
        let cellWidth = config.InternalSize.horizontal_cells;
        const inFilt = this.replaceOldIdWithNewId(config.included_filter);
        const exFilt = this.replaceOldIdWithNewId(config.excluded_filter);
        const UCcellToApply = config.cell_to_apply_filters_to;
        const UCinFilt = this.replaceOldIdWithNewId(config.unique_included_filter);
        const UCexFilt = this.replaceOldIdWithNewId(config.unique_excluded_filter);
        //if inFilt is empty set it to the base item id so the case will accept all items
        if (inFilt.length === 1 && inFilt[0] === "") {
            inFilt[0] = BaseClasses_1.BaseClasses.ITEM;
        }
        if (UCinFilt.length === 1 && UCinFilt[0] === "") {
            UCinFilt[0] = BaseClasses_1.BaseClasses.ITEM;
        }
        //if num of width and height cells are not the same, set case to 1x1 and throw warning msg
        if (cellHeight.length !== cellWidth.length) {
            cellHeight = [1];
            cellWidth = [1];
            this.logger.log(`[${this.modName}] : WARNING: number of internal and vertical cells must be the same.`, LogTextColor_1.LogTextColor.RED);
            this.logger.log(`[${this.modName}] : WARNING: setting ${config.item_name} to be 1 1x1 cell.`, LogTextColor_1.LogTextColor.RED);
        }
        for (let i = 0; i < cellWidth.length; i++) {
            if ((i === UCcellToApply - 1) || (UCcellToApply[i] === "y" || UCcellToApply[i] === "Y")) {
                grids.push(this.generateGridColumn(container, itemID, `column${i}`, cellWidth[i], cellHeight[i], UCinFilt, UCexFilt));
            }
            else {
                grids.push(this.generateGridColumn(container, itemID, `column${i}`, cellWidth[i], cellHeight[i], inFilt, exFilt));
            }
        }
        return grids;
    }
    replaceOldIdWithNewId(entries) {
        const newIdKeys = Object.keys(this.newIdMap);
        for (let i = 0; i < entries.length; i++) {
            if (newIdKeys.includes(entries[i])) {
                entries[i] = this.newIdMap[entries[i]];
            }
        }
        return entries;
    }
    createSlot(container, itemID, config) {
        const slots = [];
        const configSlots = config.slot_ids;
        for (let i = 0; i < configSlots.length; i++) {
            slots.push(this.generateSlotColumn(container, itemID, `mod_mount_${i}`, configSlots[i]));
        }
        return slots;
    }
    generateGridColumn(container, itemID, name, cellH, cellV, inFilt, exFilt) {
        const hashUtil = container.resolve("HashUtil");
        return {
            _name: name,
            _id: hashUtil.generate(),
            _parent: itemID,
            _props: {
                filters: [
                    {
                        Filter: [...inFilt],
                        ExcludedFilter: [...exFilt]
                    }
                ],
                cellsH: cellH,
                cellsV: cellV,
                minCount: 0,
                maxCount: 0,
                maxWeight: 0,
                isSortingTable: false
            }
        };
    }
    generateSlotColumn(container, itemID, name, configSlot) {
        const hashUtil = container.resolve("HashUtil");
        return {
            _name: name,
            _id: hashUtil.generate(),
            _parent: itemID,
            _props: {
                filters: [
                    {
                        Filter: [configSlot],
                        ExcludedFilter: []
                    }
                ],
                _required: false,
                _mergeSlotWithChildren: false
            }
        };
    }
    // Handle updating the user profile between versions:
    // - Update the container IDs to the new MongoID format
    // - Look for any key cases in the user's inventory, and properly update the child key locations if we've moved them
    fixProfile(sessionId) {
        const databaseServer = this.container.resolve("DatabaseServer");
        const dbTables = databaseServer.getTables();
        const dbItems = dbTables.templates.items;
        const pmcProfile = this.profileHelper.getFullProfile(sessionId)?.characters?.pmc;
        // Do nothing if the profile isn't initialized
        if (!pmcProfile?.Inventory?.items)
            return;
        // Update the container IDs to the new MongoID format
        for (const item of pmcProfile.Inventory.items) {
            if (this.newIdMap[item._tpl]) {
                item._tpl = this.newIdMap[item._tpl];
            }
        }
        // Backup the PMC inventory
        const pmcInventory = structuredClone(pmcProfile.Inventory.items);
        // Look for any key cases in the user's inventory, and properly update the child key locations if we've moved them
        for (const caseName of Object.keys(cases_json_1.default)) {
            // Skip cases that aren't set slots
            const caseConfig = cases_json_1.default[caseName];
            if (caseConfig.case_type !== "slots")
                continue;
            const templateId = this.newIdMap[caseConfig.id];
            // Get the template for the case
            const caseTemplate = dbItems[templateId];
            // Try to find the case in the user's profile
            const inventoryCases = pmcProfile.Inventory.items.filter(x => x._tpl === templateId);
            for (const inventoryCase of inventoryCases) {
                const caseChildren = pmcProfile.Inventory.items.filter(x => x.parentId === inventoryCase._id);
                for (const child of caseChildren) {
                    // Skip if the current slot filter can hold the given item, and there aren't multiple items in it
                    const currentSlot = caseTemplate._props?.Slots?.find(x => x._name === child.slotId);
                    if (currentSlot._props?.filters[0]?.Filter[0] === child._tpl &&
                        // A release of GKS went out that may have stacked keycards, so check for any stacked items in one slot
                        caseChildren.filter(x => x.slotId === currentSlot._name).length === 1) {
                        continue;
                    }
                    // Find a new slot, if this is a labs access item, find the first empty compatible slot
                    const newSlot = caseTemplate._props?.Slots?.find(x => x._props?.filters[0]?.Filter[0] === child._tpl &&
                        // A release of GKS went out that may have stacked keycards, try to fix that
                        (child._tpl !== ItemTpl_1.ItemTpl.KEYCARD_TERRAGROUP_LABS_ACCESS ||
                            !caseChildren.find(y => y.slotId === x._name)));
                    // If we couldn't find a new slot for this key, something has gone horribly wrong, restore the inventory and exit
                    if (!newSlot) {
                        this.logger.error(`[${this.modName}] : ERROR: Unable to find new slot for ${child._tpl}. Restoring inventory and exiting`);
                        pmcProfile.Inventory.items = pmcInventory;
                        return;
                    }
                    if (newSlot._name !== child.slotId) {
                        this.logger.debug(`[${this.modName}] : Need to move ${child.slotId} to ${newSlot._name}`);
                        child.slotId = newSlot._name;
                    }
                }
            }
        }
    }
}
module.exports = { mod: new Mod() };
//# sourceMappingURL=mod.js.map