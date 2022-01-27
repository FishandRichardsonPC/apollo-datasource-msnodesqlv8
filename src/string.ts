import { SqlClient } from "msnodesqlv8";
import { MssqlParameter } from "./common";
const mssql = require("msnodesqlv8") as SqlClient;

const VarChar = mssql.VarChar.bind(mssql) as (value: string | null) => any;
const NVarChar = mssql.NVarChar.bind(mssql) as (value: string | null) => any;
const Char = mssql.Char.bind(mssql) as (value: string | null) => any;
const NChar = mssql.NChar.bind(mssql) as (value: string | null) => any;
const UniqueIdentifier = mssql.UniqueIdentifier.bind(mssql) as (value: string | null) => any;
const Xml = mssql.Xml.bind(mssql) as (value: string | null) => any;

export interface StringParameter extends MssqlParameter<string | null> {
	typeDescriptor: "VARCHAR" | "NVARCHAR" | "CHAR" | "NCHAR" | "UNIQUEIDENTIFIER" | "XML";
}

/**
 * Variable length 8 bit string
 * @param value the value of the param
 * @param length the static length of the param (required), if you want auto length variables use char
 */
export function varChar(value: string | null, length: number): StringParameter {
	return {
		typeDescriptor: "VARCHAR",
		toParam: VarChar,
		toParamText: (name) => `DECLARE @${name} AS VARCHAR(${length}) = ?`,
		value,
	};
}

/**
 * Max Length 8 bit string
 * @param value the value of the param
 */
export function varCharMax(value: string | null): StringParameter {
	return {
		typeDescriptor: "VARCHAR",
		toParam: VarChar,
		toParamText: (name) => `DECLARE @${name} AS VARCHAR(MAX) = ?`,
		value,
	};
}

/**
 * Variable length unicode string
 * @param value the value of the param
 * @param length the static length of the param (required), if you want auto length variables use nChar
 */
export function nVarChar(value: string | null, length: number): StringParameter {
	return {
		typeDescriptor: "NVARCHAR",
		toParam: NVarChar,
		toParamText: (name) => `DECLARE @${name} AS VARCHAR(${length}) = ?`,
		value,
	};
}

/**
 * Max length unicode string
 * @param value the value of the param
 */
export function nVarCharMax(value: string | null): StringParameter {
	return {
		typeDescriptor: "NVARCHAR",
		toParam: NVarChar,
		toParamText: (name) => `DECLARE @${name} AS VARCHAR(MAX) = ?`,
		value,
	};
}

/**
 * Static length 8 bit string
 * @param value the value of the param
 * @param length the length of the param, of not provided will be determined by the value
 */
export function char(value: string | null, length?: number): StringParameter {
	return {
		typeDescriptor: "CHAR",
		toParam: Char,
		toParamText: (name, value) =>
			`DECLARE @${name} AS CHAR(${Math.max(length ?? value?.length ?? 0, 1)}) = ?`,
		value,
	};
}

/**
 * Static length unicode string
 * @param value the value of the param
 * @param length the length of the param, of not provided will be determined by the value
 */
export function nChar(value: string | null, length?: number): StringParameter {
	return {
		typeDescriptor: "NCHAR",
		toParam: NChar,
		toParamText: (name, value) =>
			`DECLARE @${name} AS NCHAR(${Math.max(length ?? value?.length ?? 0, 1)}) = ?`,
		value,
	};
}

/**
 * @deprecated Use varCharMax instead
 */
export function text() {}
/**
 * @deprecated Use nVarCharMax instead
 */
export function nText() {}

const uuidEx = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export class UuidError extends Error {
	constructor() {
		super("Invalid UUID");
	}
}

export function uniqueIdentifier(value: string | null): StringParameter {
	if (value && !uuidEx.test(value)) {
		throw new UuidError();
	}
	return {
		typeDescriptor: "UNIQUEIDENTIFIER",
		toParam: UniqueIdentifier,
		toParamText: (name) => `DECLARE @${name} AS UNIQUEIDENTIFIER = ?`,
		value,
	};
}

export function xml(value: string | null): StringParameter {
	return {
		typeDescriptor: "XML",
		toParam: Xml,
		toParamText: (name) => `DECLARE @${name} AS XML = ?`,
		value,
	};
}
