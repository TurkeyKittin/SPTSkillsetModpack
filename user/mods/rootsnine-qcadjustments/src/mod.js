"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mod = void 0;
const config_json_1 = __importDefault(require("../config/config.json"));
const Gunsmith_condition_ids_json_1 = __importDefault(require("../data/Gunsmith_condition_ids.json"));
const gunsmithQuestConditionFactory_1 = require("./utils/gunsmithQuestConditionFactory");
const QuestRewardType_1 = require("C:/snapshot/project/obj/models/enums/QuestRewardType");
var ConditionType;
(function (ConditionType) {
    ConditionType["Counter"] = "CounterCreator";
    ConditionType["Find"] = "FindItem";
    ConditionType["Handover"] = "HandoverItem";
    ConditionType["LeaveAt"] = "LeaveItemAtLocation";
    ConditionType["Sell"] = "SellItemToTrader";
})(ConditionType || (ConditionType = {}));
class QuestConditionAdjuster {
    DEFAULT_TASK_MULTIPLIER = 0.5;
    DEFAULT_GUNSMITH_KILLS = 10;
    postDBLoad(container) {
        // Log init
        const logger = container.resolve("WinstonLogger");
        const log = (msg) => logger.info(`[QCAdjustments] ${msg}`);
        // Db init
        const databaseService = container.resolve("DatabaseService");
        const quests = databaseService.getTables().templates.quests;
        // Config init
        const multipliers = {
            [ConditionType.Counter]: config_json_1.default.task_multipliers.counter > 0
                ? config_json_1.default.task_multipliers.counter
                : this.DEFAULT_TASK_MULTIPLIER,
            [ConditionType.Find]: config_json_1.default.task_multipliers.find_handover > 0
                ? config_json_1.default.task_multipliers.find_handover
                : this.DEFAULT_TASK_MULTIPLIER,
            [ConditionType.Handover]: config_json_1.default.task_multipliers.find_handover > 0
                ? config_json_1.default.task_multipliers.find_handover
                : this.DEFAULT_TASK_MULTIPLIER,
            [ConditionType.LeaveAt]: config_json_1.default.task_multipliers.leave_at > 0
                ? config_json_1.default.task_multipliers.leave_at
                : this.DEFAULT_TASK_MULTIPLIER,
            [ConditionType.Sell]: config_json_1.default.task_multipliers.sell > 0
                ? config_json_1.default.task_multipliers.sell
                : this.DEFAULT_TASK_MULTIPLIER,
        };
        const gunsmithKillCount = config_json_1.default.gunsmith_kills.kills > 0
            ? config_json_1.default.gunsmith_kills.kills
            : this.DEFAULT_GUNSMITH_KILLS;
        const replaceTask = config_json_1.default.gunsmith_kills.replace_task ?? false;
        const questBlacklist = config_json_1.default.quest_blacklist ?? [];
        const timer = config_json_1.default.task_multipliers.timer ?? 0.5;
        const xpMultiplier = config_json_1.default.task_multipliers.xp ?? 1.0;
        // Quest condition loop
        log("Adjusting quest conditions for kills, handover/FIR, leaveAt, and sell.");
        for (const quest of Object.values(quests)) {
            if (questBlacklist.includes(quest.QuestName)) {
                log("Skipping " + quest.QuestName);
                continue;
            }
            for (const condition of Object.values(quest.conditions.AvailableForFinish)) {
                this.adjustQuestCondition(condition, multipliers);
                this.adjustQuestPlacementTimer(condition, timer);
            }
            for (const reward of Object.values(quest.rewards.Success)) {
                this.adjustQuestXPReward(reward, xpMultiplier);
            }
        }
        // Gunsmith changes
        if (config_json_1.default.gunsmith_kills.enabled) {
            log("Adjusting Gunsmith conditions.");
            for (const questId in Gunsmith_condition_ids_json_1.default) {
                const quest = quests[questId];
                let newConditions = [];
                if (questBlacklist.includes(quest.QuestName)) {
                    log("Skipping " + quest.QuestName);
                    continue;
                }
                for (const [index, condition,] of quest.conditions.AvailableForFinish.entries()) {
                    const weapon = typeof condition.target === "string"
                        ? condition.target
                        : condition.target[0];
                    newConditions.push((0, gunsmithQuestConditionFactory_1.CreateGunsmithCondition)(Gunsmith_condition_ids_json_1.default[quest._id][index], weapon, gunsmithKillCount));
                }
                if (!replaceTask)
                    newConditions = [
                        ...quest.conditions.AvailableForFinish,
                        ...newConditions,
                    ];
                quest.conditions.AvailableForFinish = newConditions;
            }
            log(`${replaceTask ? "Replaced" : "Added"} Gunsmith conditions.`);
        }
        log("Adjusted quest conditions.");
    }
    adjustQuestCondition(condition, multipliers) {
        const multiplier = multipliers[condition.conditionType];
        if (typeof condition.value === "number" && multiplier) {
            condition.value = Math.ceil(condition.value * multiplier);
        }
    }
    adjustQuestPlacementTimer(condition, multiplier) {
        if (condition.plantTime && typeof condition.plantTime === "number") {
            condition.plantTime = Math.ceil(condition.plantTime * multiplier);
        }
    }
    adjustQuestXPReward(reward, multiplier) {
        if (reward.type === QuestRewardType_1.QuestRewardType.EXPERIENCE &&
            reward.value &&
            typeof reward.value === "number") {
            reward.value = Math.ceil(reward.value * multiplier);
        }
    }
}
exports.mod = new QuestConditionAdjuster();
//# sourceMappingURL=mod.js.map