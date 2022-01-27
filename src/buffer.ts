import { SqlClient } from "msnodesqlv8";
import { MssqlParameter } from "./common";
const mssql = require("msnodesqlv8") as SqlClient;

const VarBinary = mssql.VarBinary.bind(mssql) as (value: Buffer | null) => any;

export interface BufferParameter extends MssqlParameter<Buffer | null> {
	typeDescriptor: "VARBINARY";
}

export function varBinary(value: Buffer | null, length: number): BufferParameter {
	return {
		typeDescriptor: "VARBINARY",
		toParam: VarBinary,
		toParamText: (name) => `DECLARE @${name} AS VARBINARY(${length}) = ?`,
		value,
	};
}
export function varBinaryMax(value: Buffer | null): BufferParameter {
	return {
		typeDescriptor: "VARBINARY",
		toParam: VarBinary,
		toParamText: (name) => `DECLARE @${name} AS VARBINARY(MAX) = ?`,
		value,
	};
}
