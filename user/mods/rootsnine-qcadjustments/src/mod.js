"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mod = void 0;
const config_json_1 = __importDefault(require("../config/config.json"));
const Gunsmith_condition_ids_json_1 = __importDefault(require("../data/Gunsmith_condition_ids.json"));
const gunsmithQuestConditionFactory_1 = require("./utils/gunsmithQuestConditionFactory");
var ConditionType;
(function (ConditionType) {
    ConditionType["Counter"] = "CounterCreator";
    ConditionType["Find"] = "FindItem";
    ConditionType["Handover"] = "HandoverItem";
    ConditionType["LeaveAt"] = "LeaveItemAtLocation";
    ConditionType["Sell"] = "SellItemToTrader";
})(ConditionType || (ConditionType = {}));
class QuestConditionAdjuster {
    DEFAULT_TASK_WEIGHT = 0.5;
    DEFAULT_GUNSMITH_KILLS = 10;
    postDBLoad(container) {
        // Log init
        const logger = container.resolve("WinstonLogger");
        const log = (msg) => logger.info(`[QCAdjustments] ${msg}`);
        // Db init
        const databaseService = container.resolve("DatabaseService");
        const quests = databaseService.getTables().templates.quests;
        // Config init
        const weights = {
            [ConditionType.Counter]: (config_json_1.default.task_weight.counter > 0) ? config_json_1.default.task_weight.counter : this.DEFAULT_TASK_WEIGHT,
            [ConditionType.Find]: (config_json_1.default.task_weight.find_handover > 0) ? config_json_1.default.task_weight.find_handover : this.DEFAULT_TASK_WEIGHT,
            [ConditionType.Handover]: (config_json_1.default.task_weight.find_handover > 0) ? config_json_1.default.task_weight.find_handover : this.DEFAULT_TASK_WEIGHT,
            [ConditionType.LeaveAt]: (config_json_1.default.task_weight.leave_at > 0) ? config_json_1.default.task_weight.leave_at : this.DEFAULT_TASK_WEIGHT,
            [ConditionType.Sell]: (config_json_1.default.task_weight.sell > 0) ? config_json_1.default.task_weight.sell : this.DEFAULT_TASK_WEIGHT
        };
        const replaceTask = config_json_1.default.gunsmith_kills.replace_task ?? false;
        const questBlacklist = config_json_1.default.quest_blacklist ?? [];
        log("Adjusting quest conditions for kills, handover/FIR, leaveAt, and sell.");
        for (const quest of Object.values(quests)) {
            if (questBlacklist.includes(quest.QuestName)) {
                log("Skipping " + quest.QuestName);
                continue;
            }
            for (const condition of Object.values(quest.conditions.AvailableForFinish)) {
                this.adjustQuestCondition(condition, weights);
            }
        }
        if (config_json_1.default.gunsmith_kills.enabled) {
            log("Adjusting Gunsmith conditions.");
            const gunsmithKillCount = (config_json_1.default.gunsmith_kills.kills > 0) ? config_json_1.default.gunsmith_kills.kills : this.DEFAULT_GUNSMITH_KILLS;
            for (const questId in Gunsmith_condition_ids_json_1.default) {
                let quest = quests[questId];
                let newConditions = [];
                if (questBlacklist.includes(quest.QuestName)) {
                    log("Skipping " + quest.QuestName);
                    continue;
                }
                for (const [index, condition] of quest.conditions.AvailableForFinish.entries()) {
                    let target = (typeof condition.target === 'string') ? condition.target : condition.target[0];
                    newConditions.push((0, gunsmithQuestConditionFactory_1.CreateGunsmithCondition)(Gunsmith_condition_ids_json_1.default[quest._id][index], target, gunsmithKillCount));
                }
                if (replaceTask) {
                    quest.conditions.AvailableForFinish = newConditions;
                }
                else {
                    quest.conditions.AvailableForFinish = [...quest.conditions.AvailableForFinish, ...newConditions];
                }
            }
            if (replaceTask) {
                log("Replaced Gunsmith conditions.");
            }
            else {
                log("Added Gunsmith conditions.");
            }
        }
        log("Adjusted quest conditions.");
    }
    adjustQuestCondition(condition, weights) {
        const weight = weights[condition.conditionType];
        if (typeof condition.value === "number" && weight) {
            condition.value = Math.ceil(condition.value * weight);
        }
    }
}
exports.mod = new QuestConditionAdjuster();
//# sourceMappingURL=mod.js.map