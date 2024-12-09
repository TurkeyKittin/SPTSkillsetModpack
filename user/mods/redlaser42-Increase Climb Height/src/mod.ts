import { DependencyContainer } from "tsyringe";

import { IPostDBLoadMod } from "@spt/models/external/IPostDBLoadMod";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";

import config from "./../config.json";

const cfMaxLength = config.InteractMaxLength;
const cfMaxHeight = config.InteractMaxHeight;
const cfMinDistantToInteract = config.MinDistantToInteract;
const cfMaxOneHandHeight = config.MaxOneHandAnimationHeight;
const cfMaxWithoutHandHeight = config.MaxWithoutHandHeight;
const cfBaseJumpPenalty = config.BaseJumpPenalty;
const cfVaultingInputTime = config.VaultingInputTime;
const cfSpeedRangeX = config.AnimationForwardSpeed;
const cfSpeedRangeY = config.AnimationVerticalSpeed;

const cfGridOffsetX = config.GridOffsetX;
const cfGridOffsetY = config.GridOffsetY;
const cfGridOffsetZ = config.GridOffsetZ;
const cfGridSizeX = config.GridSizeX;
const cfGridSizeY = config.GridSizeY;
const cfGridSizeZ = config.GridSizeZ;
const cfOffsetFactor = config.OffsetFactor;
const cfSteppingLengthX = config.SteppingLengthX;
const cfSteppingLengthY = config.SteppingLengthY;
const cfSteppingLengthZ = config.SteppingLengthZ;

class Mod implements IPostDBLoadMod {
    public postDBLoad(container: DependencyContainer): void {
        // get database from server
        const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");

        // Get all the in-memory json found in /assets/database
        const tables: IDatabaseTables = databaseServer.getTables();

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

export const mod = new Mod();