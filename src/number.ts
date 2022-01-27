import { SqlClient } from "msnodesqlv8";
import { MssqlParameter } from "./common";
const mssql = require("msnodesqlv8") as SqlClient;

const BigInt = mssql.BigInt.bind(mssql) as (value: number | null) => any;
const Int = mssql.Int.bind(mssql) as (value: number | null) => any;
const TinyInt = mssql.TinyInt.bind(mssql) as (value: number | null) => any;
const SmallInt = mssql.SmallInt.bind(mssql) as (value: number | null) => any;
const Float = mssql.Float.bind(mssql) as (value: number | null) => any;
const Numeric = mssql.Numeric.bind(mssql) as (value: number | null) => any;
const Money = mssql.Money.bind(mssql) as (value: number | null) => any;
const SmallMoney = mssql.SmallMoney.bind(mssql) as (value: number | null) => any;
const Decimal = mssql.Decimal.bind(mssql) as (value: number | null) => any;
const Real = mssql.Real.bind(mssql) as (value: number | null) => any;

export interface NumberParameter extends MssqlParameter<number | null> {
	typeDescriptor:
		| "BIGINT"
		| "INT"
		| "TINYINT"
		| "SMALLINT"
		| "FLOAT"
		| "REAL"
		| "DECIMAL"
		| "NUMERIC"
		| "MONEY"
		| "SMALLMONEY";
}

export function bigInt(value: number | null): NumberParameter {
	return {
		typeDescriptor: "BIGINT",
		toParam: BigInt,
		toParamText: (name) => `DECLARE @${name} AS BIGINT = ?`,
		value,
	};
}
export function int(value: number | null): NumberParameter {
	return {
		typeDescriptor: "INT",
		toParam: Int,
		toParamText: (name) => `DECLARE @${name} AS INT = ?`,
		value,
	};
}

export function money(value: number | null): NumberParameter {
	return {
		typeDescriptor: "MONEY",
		toParam: Money,
		toParamText: (name) => `DECLARE @${name} AS MONEY = ?`,
		value,
	};
}
export function smallMoney(value: number | null): NumberParameter {
	return {
		typeDescriptor: "SMALLMONEY",
		toParam: SmallMoney,
		toParamText: (name) => `DECLARE @${name} AS SMALLMONEY = ?`,
		value,
	};
}
export function tinyInt(value: number | null): NumberParameter {
	return {
		typeDescriptor: "TINYINT",
		toParam: TinyInt,
		toParamText: (name) => `DECLARE @${name} AS TINYINT = ?`,
		value,
	};
}
export function smallInt(value: number | null): NumberParameter {
	return {
		typeDescriptor: "SMALLINT",
		toParam: SmallInt,
		toParamText: (name) => `DECLARE @${name} AS SMALLINT = ?`,
		value,
	};
}
export function float(value: number | null, mantissa: number): NumberParameter {
	return {
		typeDescriptor: "FLOAT",
		toParam: Float,
		toParamText: (name) => `DECLARE @${name} AS FLOAT(${mantissa}) = ?`,
		value,
	};
}
export function real(value: number | null, mantissa: number): NumberParameter {
	return {
		typeDescriptor: "REAL",
		toParam: Real,
		toParamText: (name) => `DECLARE @${name} AS REAL(${mantissa}) = ?`,
		value,
	};
}
export function decimal(value: number | null, precision: number, scale: number): NumberParameter {
	return {
		typeDescriptor: "DECIMAL",
		toParam: Decimal,
		toParamText: (name) => `DECLARE @${name} AS DECIMAL(${precision}, ${scale}) = ?`,
		value,
	};
}
export function numeric(value: number | null, precision: number, scale: number): NumberParameter {
	return {
		typeDescriptor: "NUMERIC",
		toParam: Numeric,
		toParamText: (name) => `DECLARE @${name} AS NUMERIC(${precision}, ${scale}) = ?`,
		value,
	};
}
