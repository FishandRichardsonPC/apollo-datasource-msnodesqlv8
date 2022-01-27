import { SqlClient } from "msnodesqlv8";
import { MssqlParameter } from "./common";
const mssql = require("msnodesqlv8") as SqlClient;

const Time = mssql.Time.bind(mssql) as (value: Date | null) => any;
const sqlDate = mssql.Date.bind(mssql) as (value: Date | null) => any;
const DateTime = mssql.DateTime.bind(mssql) as (value: Date | null) => any;
const DateTime2 = mssql.DateTime2.bind(mssql) as (value: Date | null) => any;
const SmallDateTime = mssql.SmallDateTime.bind(mssql) as (value: Date | null) => any;
const DateTimeOffset = mssql.DateTimeOffset.bind(mssql) as (value: Date | null) => any;

export interface DateParameter extends MssqlParameter<Date | null> {
	typeDescriptor: "TIME" | "DATE" | "DATETIME" | "DATETIME2" | "SMALLDATETIME" | "DATETIMEOFFSET";
}

function asDate(value: Date | string | null): Date | null {
	return typeof value === "string" ? new Date(value) : value;
}

export function time(value: Date | string | null): DateParameter {
	return {
		typeDescriptor: "TIME",
		toParam: Time,
		toParamText: (name) => `DECLARE @${name} AS TIME = ?`,
		value: asDate(value),
	};
}

export function date(value: Date | string | null): DateParameter {
	return {
		typeDescriptor: "DATE",
		toParam: sqlDate,
		toParamText: (name) => `DECLARE @${name} AS DATE = ?`,
		value: asDate(value),
	};
}

export function dateTime(value: Date | string | null): DateParameter {
	return {
		typeDescriptor: "DATETIME",
		toParam: DateTime,
		toParamText: (name) => `DECLARE @${name} AS DATETIME = ?`,
		value: asDate(value),
	};
}

export function dateTime2(value: Date | string | null): DateParameter {
	return {
		typeDescriptor: "DATETIME2",
		toParam: DateTime2,
		toParamText: (name) => `DECLARE @${name} AS DATETIME2 = ?`,
		value: asDate(value),
	};
}

export function smallDateTime(value: Date | string | null): DateParameter {
	return {
		typeDescriptor: "SMALLDATETIME",
		toParam: SmallDateTime,
		toParamText: (name) => `DECLARE @${name} AS SMALLDATETIME = ?`,
		value: asDate(value),
	};
}

export function dateTimeOffset(value: Date | string | null): DateParameter {
	return {
		typeDescriptor: "DATETIMEOFFSET",
		toParam: DateTimeOffset,
		toParamText: (name) => `DECLARE @${name} AS DATETIMEOFFSET = ?`,
		value: asDate(value),
	};
}
