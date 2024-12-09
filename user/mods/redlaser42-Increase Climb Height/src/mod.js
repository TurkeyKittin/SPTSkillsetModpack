"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mod = void 0;
const config_json_1 = __importDefault(require("./../config.json"));
const cfMaxLength = config_json_1.default.InteractMaxLength;
const cfMaxHeight = config_json_1.default.InteractMaxHeight;
const cfMinDistantToInteract = config_json_1.default.MinDistantToInteract;
const cfMaxOneHandHeight = config_json_1.default.MaxOneHandAnimationHeight;
const cfMaxWithoutHandHeight = config_json_1.default.MaxWithoutHandHeight;
const cfBaseJumpPenalty = config_json_1.default.BaseJumpPenalty;
const cfVaultingInputTime = config_json_1.default.VaultingInputTime;
const cfSpeedRangeX = config_json_1.default.AnimationForwardSpeed;
const cfSpeedRangeY = config_json_1.default.AnimationVerticalSpeed;
const cfGridOffsetX = config_json_1.default.GridOffsetX;
const cfGridOffsetY = config_json_1.default.GridOffsetY;
const cfGridOffsetZ = config_json_1.default.GridOffsetZ;
const cfGridSizeX = config_json_1.default.GridSizeX;
const cfGridSizeY = config_json_1.default.GridSizeY;
const cfGridSizeZ = config_json_1.default.GridSizeZ;
const cfOffsetFactor = config_json_1.default.OffsetFactor;
const cfSteppingLengthX = config_json_1.default.SteppingLengthX;
const cfSteppingLengthY = config_json_1.default.SteppingLengthY;
const cfSteppingLengthZ = config_json_1.default.SteppingLengthZ;
class Mod {
    postDBLoad(container) {
        // get database from server
        const databaseServer = container.resolve("DatabaseServer");
        // Get all the in-memory json found in /assets/database
        const tables = databaseServer.getTables();
        tables.globals.config.VaultingSettings.MovesSettings.ClimbSettings.MoveRestrictions.MaxLength = cfMaxLength;
        tables.globals.config.VaultingSettings.MovesSettings.ClimbSettings.MoveRestrictions.MaxHeight = cfMaxHeight;
        tables.globals.config.VaultingSettings.MovesSettings.ClimbSettings.MoveRestrictions.MinDistantToInteract = cfMinDistantToInteract;
        tables.globals.config.VaultingSettings.MovesSettings.ClimbSettings.AutoMoveRestrictions.MaxLength = cfMaxLength;
        tables.globals.config.VaultingSettings.MovesSettings.ClimbSettings.AutoMoveRestrictions.MaxHeight = cfMaxHeight;
        tables.globals.config.VaultingSettings.MovesSettings.ClimbSettings.AutoMoveRestrictions.MinDistantToInteract = cfMinDistantToInteract;
        tables.globals.config.VaultingSettings.MovesSettings.ClimbSettings.SpeedRange.x = cfSpeedRangeX;
        tables.globals.config.VaultingSettings.MovesSettings.ClimbSettings.SpeedRange.y = cfSpeedRangeY;
        tables.globals.config.VaultingSettings.MovesSettings.ClimbSettings.MaxOneHandHeight = cfMaxOneHandHeight;
        tables.globals.config.VaultingSettings.MovesSettings.ClimbSettings.MaxWithoutHandHeight = cfMaxWithoutHandHeight;
        tables.globals.config.Inertia.BaseJumpPenalty = cfBaseJumpPenalty;
        tables.globals.config.VaultingSettings.GridSettings.SteppingLengthY = cfSteppingLengthY;
        tables.globals.config.VaultingSettings.GridSettings.SteppingLengthX = cfSteppingLengthX;
        tables.globals.config.VaultingSettings.GridSettings.SteppingLengthZ = cfSteppingLengthZ;
        tables.globals.config.VaultingSettings.GridSettings.GridOffsetY = cfGridOffsetY;
        tables.globals.config.VaultingSettings.GridSettings.GridOffsetX = cfGridOffsetX;
        tables.globals.config.VaultingSettings.GridSettings.GridOffsetZ = cfGridOffsetZ;
        tables.globals.config.VaultingSettings.GridSettings.GridSizeY = cfGridSizeY;
        tables.globals.config.VaultingSettings.GridSettings.GridSizeX = cfGridSizeX;
        tables.globals.config.VaultingSettings.GridSettings.GridSizeZ = cfGridSizeZ;
        tables.globals.config.VaultingSettings.GridSettings.OffsetFactor = cfOffsetFactor;
        tables.globals.config.VaultingSettings.VaultingInputTime = cfVaultingInputTime;
    }
}
exports.mod = new Mod();
//# sourceMappingURL=mod.js.map