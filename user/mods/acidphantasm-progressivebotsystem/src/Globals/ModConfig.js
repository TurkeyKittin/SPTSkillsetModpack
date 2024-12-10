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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var ModConfig_1;
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ModConfig = void 0;
/* eslint-disable @typescript-eslint/naming-convention */
const VFS_1 = require("C:/snapshot/project/obj/utils/VFS");
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const jsonc_1 = __importDefault(require("C:/snapshot/project/node_modules/jsonc"));
const path_1 = __importDefault(require("path"));
const TierInformation_1 = require("./TierInformation");
const APBSLogger_1 = require("../Utils/APBSLogger");
const ILogger_1 = require("C:/snapshot/project/obj/models/spt/utils/ILogger");
let ModConfig = class ModConfig {
    static { ModConfig_1 = this; }
    apbsLogger;
    logger;
    tierInformation;
    vfs;
    static config;
    constructor(apbsLogger, logger, tierInformation, vfs) {
        this.apbsLogger = apbsLogger;
        this.logger = logger;
        this.tierInformation = tierInformation;
        this.vfs = vfs;
        ModConfig_1.config = jsonc_1.default.parse(this.vfs.readFile(path_1.default.resolve(__dirname, "../../config/config.jsonc")));
    }
    serverLogDetails() {
        this.logger.debug("[APBS] Mod Config - FOR SUPPORT FOLKS ❤❤");
        this.logger.debug(`[APBS] Import Mod Weapons: ${ModConfig_1.config.enableModdedWeapons} <- MUST BE FALSE FOR SUPPORT`);
        this.logger.debug(`[APBS] Import Mod Equipment: ${ModConfig_1.config.enableModdedEquipment} <- MUST BE FALSE FOR SUPPORT`);
        this.logger.debug(`[APBS] Import Mod Clothing: ${ModConfig_1.config.enableModdedClothing} <- MUST BE FALSE FOR SUPPORT`);
    }
};
exports.ModConfig = ModConfig;
exports.ModConfig = ModConfig = ModConfig_1 = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("APBSLogger")),
    __param(1, (0, tsyringe_1.inject)("PrimaryLogger")),
    __param(2, (0, tsyringe_1.inject)("TierInformation")),
    __param(3, (0, tsyringe_1.inject)("VFS")),
    __metadata("design:paramtypes", [typeof (_a = typeof APBSLogger_1.APBSLogger !== "undefined" && APBSLogger_1.APBSLogger) === "function" ? _a : Object, typeof (_b = typeof ILogger_1.ILogger !== "undefined" && ILogger_1.ILogger) === "function" ? _b : Object, typeof (_c = typeof TierInformation_1.TierInformation !== "undefined" && TierInformation_1.TierInformation) === "function" ? _c : Object, typeof (_d = typeof VFS_1.VFS !== "undefined" && VFS_1.VFS) === "function" ? _d : Object])
], ModConfig);
//# sourceMappingURL=ModConfig.js.map