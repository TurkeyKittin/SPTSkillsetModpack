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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomInventoryItemEventRouter = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const Router_1 = require("C:/snapshot/project/obj/di/Router");
const EventOutputHolder_1 = require("C:/snapshot/project/obj/routers/EventOutputHolder");
const InventoryHelper_1 = require("C:/snapshot/project/obj/helpers/InventoryHelper");
const ILogger_1 = require("C:/snapshot/project/obj/models/spt/utils/ILogger");
let CustomInventoryItemEventRouter = class CustomInventoryItemEventRouter extends Router_1.ItemEventRouterDefinition {
    logger;
    eventOutputHolder;
    inventoryHelper;
    constructor(logger, eventOutputHolder, inventoryHelper) {
        super();
        this.logger = logger;
        this.eventOutputHolder = eventOutputHolder;
        this.inventoryHelper = inventoryHelper;
    }
    getHandledRoutes() {
        return [
            new Router_1.HandledRoute("Combine", false)
        ];
    }
    async handleItemEvent(url, pmcData, body, sessionID, output) {
        switch (url) {
            case "Combine":
                output = this.eventOutputHolder.getOutput(sessionID);
                this.HandleCombine(pmcData, body.sourceItem, body.targetItem, body.sourceAmount, body.targetAmount, body.type, sessionID, output);
                return output;
        }
        return output;
    }
    HandleCombine(pmcData, sourceItem, targetItem, sourceAmount, targetAmount, type, sessionID, output) {
        const sItem = pmcData.Inventory.items.find((item) => item._id === sourceItem);
        const tItem = pmcData.Inventory.items.find((item) => item._id === targetItem);
        if (!sItem || !tItem) {
            this.logger.error(`Could not find source or target item! Source: ${sourceItem}, Target: ${targetItem}`);
            return;
        }
        switch (type) {
            case "medical":
                if (sItem.upd?.MedKit && tItem.upd?.MedKit) {
                    sItem.upd.MedKit.HpResource = sourceAmount;
                    tItem.upd.MedKit.HpResource = targetAmount;
                }
                else {
                    this.logger.error("MedKit was missing on source or target item!");
                    return;
                }
                break;
            case "food":
                if (sItem.upd?.FoodDrink && tItem?.upd.FoodDrink) {
                    sItem.upd.FoodDrink.HpPercent = sourceAmount;
                    tItem.upd.FoodDrink.HpPercent = targetAmount;
                }
                else {
                    this.logger.error("FoodDrink was missing on source or target item!");
                    return;
                }
                break;
            default:
                this.logger.warning(`Unknown type: ${type}`);
                break;
        }
        if (sourceAmount == 0) {
            this.inventoryHelper.removeItem(pmcData, sourceItem, sessionID, output);
        }
    }
};
exports.CustomInventoryItemEventRouter = CustomInventoryItemEventRouter;
exports.CustomInventoryItemEventRouter = CustomInventoryItemEventRouter = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("WinstonLogger")),
    __param(1, (0, tsyringe_1.inject)("EventOutputHolder")),
    __param(2, (0, tsyringe_1.inject)("InventoryHelper")),
    __metadata("design:paramtypes", [typeof (_a = typeof ILogger_1.ILogger !== "undefined" && ILogger_1.ILogger) === "function" ? _a : Object, typeof (_b = typeof EventOutputHolder_1.EventOutputHolder !== "undefined" && EventOutputHolder_1.EventOutputHolder) === "function" ? _b : Object, typeof (_c = typeof InventoryHelper_1.InventoryHelper !== "undefined" && InventoryHelper_1.InventoryHelper) === "function" ? _c : Object])
], CustomInventoryItemEventRouter);
//# sourceMappingURL=CustomItemEventRouter.js.map