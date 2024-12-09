"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateGunsmithCondition = CreateGunsmithCondition;
function CreateGunsmithCondition(conditionIds, weapon, kills) {
    return {
        id: conditionIds.id,
        conditionType: "CounterCreator",
        counter: {
            id: conditionIds.counter.id,
            conditions: [{
                    id: conditionIds.counter.conditions[0].id,
                    compareMethod: ">=",
                    conditionType: "Kills",
                    dynamicLocale: true,
                    resetOnSessionEnd: false,
                    target: "Any",
                    value: 1,
                    weapon: [weapon]
                }]
        },
        dynamicLocale: true,
        type: "Elimination",
        value: kills
    };
}
//# sourceMappingURL=gunsmithQuestConditionFactory.js.map