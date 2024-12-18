import { ILocation } from "@spt/models/eft/common/ILocation";
import _config from "../../config/config.json";
import mapConfig from "../../config/mapConfig.json";
import {
  bossesToRemoveFromPool,
  defaultEscapeTimes,
  defaultHostility,
} from "./constants";
import { buildPmcWaves, MapSettings, shuffle } from "./utils";
import { saveToFile } from "../utils";

export default function buildPmcs(
  config: typeof _config,
  locationList: ILocation[]
) {
  for (let index = 0; index < locationList.length; index++) {
    const mapSettingsList = Object.keys(mapConfig) as Array<
      keyof typeof mapConfig
    >;
    const map = mapSettingsList[index];

    locationList[index].base.BotLocationModifier.AdditionalHostilitySettings =
      defaultHostility;

    const { pmcHotZones = [] } = (mapConfig?.[map] as MapSettings) || {};

    const pmcZones = shuffle<string[]>([
      ...new Set(
        [...locationList[index].base.SpawnPointParams]
          .filter(
            ({ Categories, BotZoneName }) =>
              !!BotZoneName &&
              Categories.includes("Player") &&
              !BotZoneName.includes("snipe")
          )
          .map(({ BotZoneName }) => BotZoneName)
      ),
      ...pmcHotZones,
    ]);

    // console.log(pmcZones);

    // const pmcZones = shuffle<string[]>([
    //   ...new Set(
    //     [...locationList[index].base.BossLocationSpawn]
    //       .filter(
    //         ({ BossName }) =>
    //           BossName && ["pmcBEAR", "pmcUSEC"].includes(BossName)
    //       )
    //       .map(({ BossZone }) => BossZone)
    //   ),
    //   ...pmcHotZones,
    // ]);

    const timeLimit = locationList[index].base.EscapeTimeLimit * 60;

    const { pmcWaveCount } = mapConfig[map];

    const escapeTimeLimitRatio = Math.round(
      locationList[index].base.EscapeTimeLimit / defaultEscapeTimes[map]
    );

    const totalWaves = Math.round(
      pmcWaveCount * config.pmcWaveQuantity * escapeTimeLimitRatio
    );

    if (config.debug) {
      console.log(`${map} PMC count ${totalWaves} \n`);

      escapeTimeLimitRatio !== 1 &&
        console.log(
          `${map} PMC wave count changed from ${pmcWaveCount} to ${totalWaves} due to escapeTimeLimit adjustment`
        );
    }

    const waves = buildPmcWaves(pmcWaveCount, timeLimit, config, pmcZones);

    // apply our new waves
    locationList[index].base.BossLocationSpawn = [
      ...waves,
      ...locationList[index].base.BossLocationSpawn,
    ];
  }
}
