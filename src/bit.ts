import { SqlClient } from "msnodesqlv8";
import { MssqlParameter } from "./common";
const mssql = require("msnodesqlv8") as SqlClient;

const mssqlBit = (value: boolean | null) =>
	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	mssql.Bit(value === true ? 1 : value === false ? 0 : (null as unknown as number));

export interface BitParameter extends MssqlParameter<boolean | null> {
	typeDescriptor: "BIT";
}

export function bit(value: boolean | null): BitParameter {
	return {
		typeDescriptor: "BIT",
		toParam: mssqlBit,
		toParamText: (name) => `DECLARE @${name} AS BIT = ?`,
		value,
	};
}
