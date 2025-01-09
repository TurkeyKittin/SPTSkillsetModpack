"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = updateSpawnLocations;
const constants_1 = require("./constants");
const mapConfig_json_1 = __importDefault(require("../../config/mapConfig.json"));
function updateSpawnLocations(locationList, config) {
    for (let index = 0; index < locationList.length; index++) {
        const map = constants_1.configLocations[index];
        // console.log(map);
        const limit = mapConfig_json_1.default[map].spawnMinDistance;
        const InfiltrationList = [
            ...new Set(locationList[index].base.SpawnPointParams.filter(({ Infiltration }) => Infiltration).map(({ Infiltration }) => Infiltration)),
        ];
        // console.log(map, InfiltrationList);
        const getRandomInfil = () => InfiltrationList[Math.floor(Math.random() * InfiltrationList.length)];
        // console.log(InfiltrationList);
        // console.log("\n" + map);
        locationList[index].base.SpawnPointParams.forEach(({ ColliderParams, BotZoneName, DelayToCanSpawnSec, Categories, Sides, Infiltration, }, innerIndex) => {
            if (!Categories.includes("Boss") &&
                !BotZoneName?.toLowerCase().includes("snipe") &&
                DelayToCanSpawnSec < 41) {
                // Make it so players/pmcs can spawn anywhere.
                if (config.playerOpenZones &&
                    !!Infiltration &&
                    (Sides.includes("Pmc") || Sides.includes("All"))) {
                    locationList[index].base.SpawnPointParams[innerIndex].Categories = [
                        "Player",
                        "Coop",
                        innerIndex % 2 === 0 ? "Group" : "Opposite",
                    ];
                    locationList[index].base.SpawnPointParams[innerIndex].Sides = [
                        "Pmc",
                        "All",
                    ];
                    // console.log(
                    //   BotZoneName || "none",
                    //   locationList[index].base.SpawnPointParams[innerIndex].Categories,
                    //   locationList[index].base.SpawnPointParams[innerIndex].Sides
                    // );
                }
                if (!Infiltration) {
                    if (!config.allOpenZones &&
                        config.pmcOpenZones &&
                        Categories.includes("Bot") &&
                        Sides[0] === "Savage") {
                        // if (BotZoneName === "Zone_LongRoad") console.log("yes");
                        locationList[index].base.SpawnPointParams[innerIndex].Categories =
                            ["Player", "Bot"];
                        locationList[index].base.SpawnPointParams[innerIndex].Infiltration = getRandomInfil();
                    }
                    if (config.allOpenZones) {
                        locationList[index].base.SpawnPointParams[innerIndex].Categories =
                            [
                                "Bot",
                                "Player",
                                "Coop",
                                innerIndex % 2 === 0 ? "Group" : "Opposite",
                            ];
                        locationList[index].base.SpawnPointParams[innerIndex].Infiltration = getRandomInfil();
                        // console.log(
                        //   locationList[index].base.SpawnPointParams[innerIndex].Infiltration
                        // );
                        locationList[index].base.SpawnPointParams[innerIndex].Sides = [
                            "Pmc",
                            "Savage",
                            "All",
                        ];
                    }
                    if (config.bossOpenZones && Categories.includes("Bot")) {
                        locationList[index].base.SpawnPointParams[innerIndex].Categories.push("Boss");
                    }
                }
                if (ColliderParams?._props?.Radius !== undefined &&
                    ColliderParams?._props?.Radius < limit) {
                    locationList[index].base.SpawnPointParams[innerIndex].ColliderParams._props.Radius = limit;
                }
            }
            else {
                if (!Categories.includes("Boss") && DelayToCanSpawnSec > 40) {
                    locationList[index].base.SpawnPointParams[innerIndex].DelayToCanSpawnSec = Math.round(DelayToCanSpawnSec * Math.random() * Math.random() * 0.5);
                    // console.log(
                    //   BotZoneName,
                    //   DelayToCanSpawnSec,
                    //   locationList[index].base.SpawnPointParams[innerIndex]
                    //     .DelayToCanSpawnSec
                    // );
                }
            }
        });
    }
}
//# sourceMappingURL=updateSpawnLocations.js.map