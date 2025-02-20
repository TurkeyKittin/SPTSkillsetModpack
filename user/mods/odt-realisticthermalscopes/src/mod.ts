/* eslint-disable @typescript-eslint/indent */
import { DependencyContainer } from "tsyringe";

import { IPostSptLoadMod } from "@spt/models/external/IPostSptLoadMod";
import { ILogger } from "@spt/models/spt/utils/ILogger";
import { DatabaseServer } from "@spt/servers/DatabaseServer";
import { IDatabaseTables } from "@spt/models/spt/server/IDatabaseTables";
import { ItemHelper } from "@spt/helpers/ItemHelper";
import { BaseClasses } from "@spt/models/enums/BaseClasses";

class Mod implements IPostSptLoadMod {
	public postSptLoad(container: DependencyContainer): void {
		// get database from server
		const databaseServer = container.resolve<DatabaseServer>("DatabaseServer");

		// Get all the in-memory json found in /assets/database
		const tables: IDatabaseTables = databaseServer.getTables();
		// get the logger from the server container
		const logger = container.resolve<ILogger>("WinstonLogger");

		const reapir = tables.templates.items["5a1eaa87fcdbcb001865f75e"];

		reapir._props.Zooms[0] = [9.6, 1.2]; //zoom displayed in lower right corner. True zoom is x5.8 - x0.7
		reapir._props.AimSensitivity[0] = [0.112, 0.93]; //sensitivity change. Calculated based on true zoom.

		logger.info("Realistic Thermal Scopes loaded");
	}
}

export const mod = new Mod();
