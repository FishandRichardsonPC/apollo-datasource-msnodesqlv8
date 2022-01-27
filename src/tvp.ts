// TODO: Add support for table valued parameters

// import mssql from "msnodesqlv8";
//
// export function tvp<T extends object>(value: T[], name: string, table: mssql.Table): TvpParameter {
//  value.forEach((v) => {
//   table.rows.add(
//    ...Object.entries(v)
//     .sort(([a], [b]) => a.localeCompare(b))
//     // eslint-disable-next-line @typescript-eslint/no-unsafe-return
//     .map(([, value]) => value)
//   );
//  });
//  return {
//   internalType: "TVP",
//   type: mssql.TVP(name),
//   value: table,
//  };
// }
// export function nVarCharTvp(value: string[]): TvpParameter {
//  const table = new mssql.Table();
//  table.columns.add("Value", mssql.NVarChar(Math.max(...value.map((v) => v.length))));
//  return tvp(
//   value.map((v) => ({ v })),
//   "NVarCharTvp",
//   table
//  );
// }
// export function uniqueIdentifierTvp(value: string[]): TvpParameter {
//  const table = new mssql.Table();
//  table.columns.add("Value", mssql.UniqueIdentifier());
//  return tvp(
//   value.map((v) => ({ v })),
//   "UniqueIdentifierTvp",
//   table
//  );
// }
export const temp = "";
