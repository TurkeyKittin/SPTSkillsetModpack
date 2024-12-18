import { ILocation } from "@spt/models/eft/common/ILocation";
import _config from "../../config/config.json";
import bossConfig from "../../config/bossConfig.json";
import mapConfig from "../../config/mapConfig.json";
import {
  bossesToRemoveFromPool,
  configLocations,
  mainBossNameList,
  originalMapList,
} from "./constants";
import { buildBossBasedWave, shuffle } from "./utils";
import { IBossLocationSpawn } from "@spt/models/eft/common/ILocationBase";
import { cloneDeep } from "../utils";

export function buildBossWaves(
  config: typeof _config,
  locationList: ILocation[]
) {
  let {
    randomRaiderGroup,
    randomRaiderGroupChance,
    randomRogueGroup,
    randomRogueGroupChance,
    mainBossChanceBuff,
    bossInvasion,
    bossInvasionSpawnChance,
    disableBosses,
    bossOpenZones,
    gradualBossInvasion,
  } = config;

  const bossList = mainBossNameList.filter(
    (bossName) => !["bossKnight"].includes(bossName)
  );

  // CreateBossList
  const bosses: Record<string, IBossLocationSpawn> = {};
  for (let indx = 0; indx < locationList.length; indx++) {
    // Disable Bosses
    if (disableBosses && !!locationList[indx].base?.BossLocationSpawn) {
      locationList[indx].base.BossLocationSpawn = [];
    } else {
      //Remove all other spawns from pool now that we have the spawns zone list
      locationList[indx].base.BossLocationSpawn = locationList[
        indx
      ].base.BossLocationSpawn.filter(
        (boss) => !bossesToRemoveFromPool.has(boss.BossName)
      );

      const location = locationList[indx];

      const defaultBossSettings =
        mapConfig?.[configLocations[indx]]?.defaultBossSettings;

      // Sets bosses spawn chance from settings
      if (
        location?.base?.BossLocationSpawn &&
        defaultBossSettings &&
        Object.keys(defaultBossSettings)?.length
      ) {
        const filteredBossList = Object.keys(defaultBossSettings).filter(
          (name) => defaultBossSettings[name]?.BossChance !== undefined
        );
        if (filteredBossList?.length) {
          filteredBossList.forEach((bossName) => {
            location.base.BossLocationSpawn =
              location.base.BossLocationSpawn.map((boss) => ({
                ...boss,
                ...(boss.BossName === bossName
                  ? { BossChance: defaultBossSettings[bossName].BossChance }
                  : {}),
              }));
          });
        }
      }

      if (randomRaiderGroup) {
        const raiderWave = buildBossBasedWave(
          randomRaiderGroupChance,
          "1,2,2,2,3",
          "pmcBot",
          "pmcBot",
          "",
          locationList[indx].base.EscapeTimeLimit
        );
        location.base.BossLocationSpawn.push(raiderWave);
      }

      if (randomRogueGroup) {
        const rogueWave = buildBossBasedWave(
          randomRogueGroupChance,
          "1,2,2,2,3",
          "exUsec",
          "exUsec",
          "",
          locationList[indx].base.EscapeTimeLimit
        );
        location.base.BossLocationSpawn.push(rogueWave);
      }

      //Add each boss from each map to bosses object
      const filteredBosses = location.base.BossLocationSpawn?.filter(
        ({ BossName }) => mainBossNameList.includes(BossName)
      );

      if (filteredBosses.length) {
        for (let index = 0; index < filteredBosses.length; index++) {
          const boss = filteredBosses[index];
          if (
            !bosses[boss.BossName] ||
            (bosses[boss.BossName] &&
              bosses[boss.BossName].BossChance < boss.BossChance)
          ) {
            bosses[boss.BossName] = { ...boss };
          }
        }
      }
    }
  }

  if (disableBosses) return;
  // Make boss Invasion
  if (bossInvasion) {
    if (bossInvasionSpawnChance) {
      bossList.forEach((bossName) => {
        if (bosses[bossName])
          bosses[bossName].BossChance = bossInvasionSpawnChance;
      });
    }

    for (let key = 0; key < locationList.length; key++) {
      //Gather bosses to avoid duplicating.
      let bossLocations = "";

      const duplicateBosses = [
        ...locationList[key].base.BossLocationSpawn.filter(
          ({ BossName, BossZone }) => {
            bossLocations += BossZone + ",";
            return bossList.includes(BossName);
          }
        ).map(({ BossName }) => BossName),
        "bossKnight", // So knight doesn't invade
      ];

      const uniqueBossZones = bossOpenZones
        ? ""
        : [
            ...new Set(
              bossLocations
                .split(",")
                .filter(
                  (zone) => !!zone && !zone.toLowerCase().includes("snipe")
                )
            ),
          ].join(",");

      //Build bosses to add
      const bossesToAdd = shuffle<IBossLocationSpawn[]>(Object.values(bosses))
        .filter(({ BossName }) => !duplicateBosses.includes(BossName))
        .map((boss, j) => ({
          ...boss,
          BossZone: uniqueBossZones,
          BossEscortAmount:
            boss.BossEscortAmount === "0" ? boss.BossEscortAmount : "1",
          ...(gradualBossInvasion ? { Time: j * 20 + 1 } : {}),
        }));

      // UpdateBosses
      locationList[key].base.BossLocationSpawn = [
        ...locationList[key].base.BossLocationSpawn,
        ...bossesToAdd,
      ];
    }
  }

  //   Object.keys(bosses).map((name) => ({
  //     name,
  //     chance: bosses[name].BossChance,
  //   }))
  // );

  configLocations.forEach((name, index) => {
    const bossLocationSpawn = locationList[index].base.BossLocationSpawn;
    const mapBossConfig = cloneDeep(bossConfig[name] || {});

    const adjusted = new Set<string>([]);

    bossLocationSpawn.forEach(({ BossName, BossChance }, bossIndex) => {
      if (typeof mapBossConfig[BossName] === "number") {
        locationList[index].base.BossLocationSpawn[bossIndex].BossChance =
          mapBossConfig[BossName];
        // console.log(name, BossName, mapBossConfig[BossName]);
        adjusted.add(BossName);
      }
    });

    const bossesToAdd = Object.keys(mapBossConfig)
      .filter((adjustName) => !adjusted.has(adjustName) && bosses[name])
      .map((name) => {
        const newBoss: IBossLocationSpawn = cloneDeep(bosses[name] || {});
        newBoss.BossChance = mapBossConfig[name];
        return newBoss;
      });

    if (bossOpenZones || mainBossChanceBuff) {
      locationList[index].base?.BossLocationSpawn?.forEach((boss, key) => {
        if (bossList.includes(boss.BossName)) {
          if (bossOpenZones) {
            locationList[index].base.BossLocationSpawn[key] = {
              ...locationList[index].base.BossLocationSpawn[key],
              BossZone: "",
            };
          }

          if (!!boss.BossChance && mainBossChanceBuff > 0) {
            locationList[index].base.BossLocationSpawn[key] = {
              ...locationList[index].base.BossLocationSpawn[key],
              BossChance:
                boss.BossChance + mainBossChanceBuff > 100
                  ? 100
                  : Math.round(boss.BossChance + mainBossChanceBuff),
            };
          }
        }
      });
    }

    locationList[index].base.BossLocationSpawn = [
      ...locationList[index].base.BossLocationSpawn,
      ...bossesToAdd,
    ];

    bossesToAdd.length &&
      console.log(
        `[MOAR] Adding the following bosses to map ${
          configLocations[index]
        }: ${bossesToAdd.map(({ BossName }) => BossName)}`
      );
  });
}
