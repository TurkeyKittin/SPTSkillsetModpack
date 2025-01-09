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
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaidInformation = void 0;
const tsyringe_1 = require("C:/snapshot/project/node_modules/tsyringe");
const ModConfig_1 = require("./ModConfig");
let RaidInformation = class RaidInformation {
    constructor() { }
    freshProfile;
    location;
    currentTime;
    timeVariant;
    nightTime;
    sessionId;
    usingDefaultDB;
    mapWeights = {
        "bigmap": {
            "LongRange": 20,
            "ShortRange": 80
        },
        "RezervBase": {
            "LongRange": 20,
            "ShortRange": 80
        },
        "laboratory": {
            "LongRange": 5,
            "ShortRange": 95
        },
        "factory4_night": {
            "LongRange": 1,
            "ShortRange": 99
        },
        "factory4_day": {
            "LongRange": 1,
            "ShortRange": 99
        },
        "Interchange": {
            "LongRange": 20,
            "ShortRange": 80
        },
        "Sandbox": {
            "LongRange": 15,
            "ShortRange": 85
        },
        "Sandbox_high": {
            "LongRange": 15,
            "ShortRange": 85
        },
        "Woods": {
            "LongRange": 60,
            "ShortRange": 40
        },
        "Shoreline": {
            "LongRange": 50,
            "ShortRange": 50
        },
        "Lighthouse": {
            "LongRange": 30,
            "ShortRange": 70
        },
        "TarkovStreets": {
            "LongRange": 20,
            "ShortRange": 80
        }
    };
    alwaysDisabledBots = [
        "shooterbtr",
        "skier",
        "peacemaker",
        "gifter",
        "infectedassault",
        "infectedcivil",
        "infectedlaborant",
        "infectedpmc",
        "infectedtagilla",
        "bosslegion",
        "bosspunisher"
    ];
    isBotEnabled(botType) {
        botType = botType.toLowerCase();
        switch (botType) {
            case "pmcbear":
            case "pmcusec":
                if (ModConfig_1.ModConfig.config.disablePMCTierGeneration)
                    return false;
                return true;
            case "cursedassault":
            case "marksman":
            case "assault":
                if (ModConfig_1.ModConfig.config.disableScavTierGeneration)
                    return false;
                return true;
            case "arenafighterevent":
            case "exusec":
                if (ModConfig_1.ModConfig.config.disableRaiderRogueTierGeneration)
                    return false;
                return true;
            case "bossbully":
            case "bosstagilla":
            case "bosspartisan":
            case "bossgluhar":
            case "bosskilla":
            case "bosskojaniy":
            case "bosssanitar":
            case "bossknight":
            case "bosszryachiy":
            case "bosstest":
            case "bosskolontay":
            case "bossboar":
            case "bossboarSniper":
            case "sectantpriest":
                if (ModConfig_1.ModConfig.config.disableBossTierGeneration)
                    return false;
                return true;
            case "sectantwarrior":
            case "followerboarblose1":
            case "followerboarclose2":
            case "followerkolontayassault":
            case "followerkolontaysecurity":
            case "followerbully":
            case "followergluharassault":
            case "followergluharscout":
            case "followergluharsecurity":
            case "followergluharsnipe":
            case "followerkojaniy":
            case "followersanitar":
            case "followertagilla":
            case "followerbirdeye":
            case "followerbigpipe":
            case "followerzryachiy":
            case "followertest":
            case "followerboar":
                if (ModConfig_1.ModConfig.config.disableBossFollowerTierGeneration)
                    return false;
                return true;
            case "shooterbtr":
            case "skier":
            case "peacemaker":
            case "gifter":
            case "infectedassault":
            case "infectedcivil":
            case "infectedlaborant":
            case "infectedpmc":
            case "infectedtagilla":
            case "bosslegion":
            case "bosspunisher":
                return false;
            default:
                return false;
        }
    }
};
exports.RaidInformation = RaidInformation;
exports.RaidInformation = RaidInformation = __decorate([
    (0, tsyringe_1.injectable)(),
    __metadata("design:paramtypes", [])
], RaidInformation);
//# sourceMappingURL=RaidInformation.js.map