"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = buildScavMarksmanWaves;
const mapConfig_json_1 = __importDefault(require("../../config/mapConfig.json"));
const constants_1 = require("./constants");
const utils_1 = require("./utils");
const ILocationBase_1 = require("C:/snapshot/project/obj/models/eft/common/ILocationBase");
function buildScavMarksmanWaves(config, locationList, botConfig) {
    let { debug, maxBotCap, scavWaveQuantity, scavWaveDistribution, snipersHaveFriends, maxBotPerZone, scavMaxGroupSize, scavDifficulty, moreScavGroups, } = config;
    for (let index = 0; index < locationList.length; index++) {
        const mapSettingsList = Object.keys(mapConfig_json_1.default);
        const map = mapSettingsList[index];
        locationList[index].base = {
            ...locationList[index].base,
            ...{
                NewSpawn: false,
                OcculsionCullingEnabled: true,
                OfflineNewSpawn: false,
                OfflineOldSpawn: true,
                OldSpawn: true,
                BotSpawnCountStep: 0,
            },
        };
        locationList[index].base.NonWaveGroupScenario.Enabled = false;
        locationList[index].base["BotStartPlayer"] = 0;
        if (locationList[index].base.BotStop <
            locationList[index].base.EscapeTimeLimit * 60) {
            locationList[index].base.BotStop =
                locationList[index].base.EscapeTimeLimit * 60;
        }
        const { maxBotPerZoneOverride, maxBotCapOverride, EscapeTimeLimit, scavHotZones, } = mapConfig_json_1.default?.[map] || {};
        // Set per map EscapeTimeLimit
        if (EscapeTimeLimit) {
            locationList[index].base.EscapeTimeLimit = EscapeTimeLimit;
            locationList[index].base.exit_access_time = EscapeTimeLimit + 1;
        }
        // Set default or per map maxBotCap
        if (maxBotCapOverride || maxBotCap) {
            const capToSet = maxBotCapOverride || maxBotCap;
            // console.log(map, capToSet, maxBotCapOverride, maxBotCap);
            locationList[index].base.BotMax = capToSet;
            locationList[index].base.BotMaxPvE = capToSet;
            botConfig.maxBotCap[constants_1.originalMapList[index]] = capToSet;
        }
        // Adjust botZone quantity
        if (maxBotPerZoneOverride || maxBotPerZone) {
            const BotPerZone = maxBotPerZoneOverride || maxBotPerZone;
            // console.log(map, BotPerZone, maxBotPerZoneOverride, maxBotPerZone);
            locationList[index].base.MaxBotPerZone = BotPerZone;
        }
        const sniperLocations = new Set([...locationList[index].base.SpawnPointParams]
            .filter(({ Categories, DelayToCanSpawnSec, BotZoneName, Sides }) => !Categories.includes("Boss") &&
            Sides[0] === "Savage" &&
            (BotZoneName?.toLowerCase().includes("snipe") ||
                DelayToCanSpawnSec > 40))
            .map(({ BotZoneName }) => BotZoneName || ""));
        if (sniperLocations.size) {
            locationList[index].base.MinMaxBots = [
                {
                    WildSpawnType: "marksman",
                    max: sniperLocations.size * 5,
                    min: sniperLocations.size,
                },
            ];
        }
        let scavZones = (0, utils_1.shuffle)([
            ...new Set([...locationList[index].base.SpawnPointParams]
                .filter(({ Categories, Sides, BotZoneName }) => !!BotZoneName &&
                Categories.includes("Bot") &&
                (Sides.includes("Savage") || Sides.includes("All")))
                .map(({ BotZoneName }) => BotZoneName)
                .filter((name) => !sniperLocations.has(name))),
        ]);
        const { scavWaveCount } = mapConfig_json_1.default[map];
        const escapeTimeLimitRatio = Math.round(locationList[index].base.EscapeTimeLimit / constants_1.defaultEscapeTimes[map]);
        // Scavs
        const scavTotalWaveCount = Math.round(scavWaveCount * scavWaveQuantity * escapeTimeLimitRatio);
        const numberOfZoneless = scavTotalWaveCount - scavZones.length;
        // console.log(numberOfZoneless);
        if (numberOfZoneless > 0) {
            const addEmpty = new Array(numberOfZoneless).fill("");
            scavZones = (0, utils_1.shuffle)([...scavZones, ...addEmpty]);
        }
        // console.log(scavZones);
        config.debug &&
            escapeTimeLimitRatio !== 1 &&
            console.log(`${map} Scav wave count changed from ${scavWaveCount} to ${scavTotalWaveCount} due to escapeTimeLimit adjustment`);
        const timeLimit = locationList[index].base.EscapeTimeLimit * 60;
        let snipers = (0, utils_1.waveBuilder)(sniperLocations.size, Math.round(timeLimit / 4), 0.5, ILocationBase_1.WildSpawnType.MARKSMAN, 0.7, false, 2, [], (0, utils_1.shuffle)([...sniperLocations]), 80, true, true);
        if (snipersHaveFriends)
            snipers = snipers.map((wave) => ({
                ...wave,
                ...(snipersHaveFriends && wave.slots_max < 2
                    ? { slots_min: 1, slots_max: 2 }
                    : {}),
            }));
        const scavWaves = (0, utils_1.waveBuilder)(scavTotalWaveCount, timeLimit, scavWaveDistribution, ILocationBase_1.WildSpawnType.ASSAULT, scavDifficulty, false, scavMaxGroupSize, map === "gzHigh" ? [] : scavZones, scavHotZones, 0, false, !!moreScavGroups);
        if (debug) {
            let totalscav = 0;
            scavWaves.forEach(({ slots_max }) => (totalscav += slots_max));
            console.log(constants_1.configLocations[index]);
            console.log("Scavs:", totalscav, "configVal", Math.round((totalscav / scavWaveCount) * 100) / 100, "configWaveCount", scavWaveCount, "waveCount", scavWaves.length, "\n");
        }
        // const finalSniperWaves = snipers?.map(({ ...rest }, snipKey) => ({
        //   ...rest,
        //   number: snipKey,
        //   time_min: snipKey * 120,
        //   time_max: snipKey * 120 + 120,
        // }));
        // if (map === "customs") saveToFile({ scavWaves }, "scavWaves.json");
        locationList[index].base.waves = [...snipers, ...scavWaves]
            .sort(({ time_min: a }, { time_min: b }) => a - b)
            .map((wave, i) => ({ ...wave, number: i + 1 }));
    }
}
//# sourceMappingURL=buildScavMarksmanWaves.js.map