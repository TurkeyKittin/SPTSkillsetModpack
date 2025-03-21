"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = updateSpawnLocations;
const constants_1 = require("./constants");
const utils_1 = require("./utils");
const advancedConfig_json_1 = __importDefault(require("../../config/advancedConfig.json"));
const GlobalValues_1 = require("../GlobalValues");
const spawnZoneUtils_1 = __importDefault(require("./spawnZoneUtils"));
function updateSpawnLocations(locationList, config) {
    for (let index = 0; index < locationList.length; index++) {
        const map = constants_1.configLocations[index];
        const mapSpawns = [...GlobalValues_1.globalValues.indexedMapSpawns[index]];
        const playerSpawns = mapSpawns.filter((point) => point?.["type"] === "player");
        const playerSpawn = (0, utils_1.getRandomInArray)(playerSpawns);
        GlobalValues_1.globalValues.playerSpawn = playerSpawn;
        const { x, y, z } = playerSpawn.Position;
        const sortedSpawnPointList = (0, spawnZoneUtils_1.default)(mapSpawns, x, y, z);
        const possibleSpawnList = [];
        sortedSpawnPointList.forEach((point) => {
            if (possibleSpawnList.length <= advancedConfig_json_1.default.SpawnpointAreaTarget &&
                point?.["type"] === "player") {
                possibleSpawnList.push(point);
            }
        });
        // const possibleSpawnListSet = new Set(possibleSpawnList.map(({ Id }) => Id));
        locationList[index].base.SpawnPointParams = [
            ...possibleSpawnList,
            ...sortedSpawnPointList.filter((point) => point["type"] !== "player"),
        ];
        //  {
        // if (point["type"] === "player" && !possibleSpawnListSet.has(point.Id)) {
        //   point.Categories = [];
        //   point.Sides = [];
        // }
        // return point;
        // }
        // console.log(
        //   map,
        //   locationList[index].base.SpawnPointParams.filter(
        //     (point) => point?.["type"] === "player"
        //   ).length,
        //   locationList[index].base.SpawnPointParams.filter(
        //     (point) => point?.Categories[0] === "Player"
        //   ).length
        // );
    }
}
//# sourceMappingURL=updateSpawnLocations.js.map