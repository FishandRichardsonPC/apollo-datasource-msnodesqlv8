import { DataSource, DataSourceConfig } from "apollo-datasource";
import {Pool, Meta, Error, QueryAggregatorOptions} from "msnodesqlv8";
import { MssqlParameter } from "./common";

import {KeyValueCache, InMemoryLRUCache, PrefixingKeyValueCache, KeyValueCacheSetOptions} from "apollo-server-caching";

export * from "./bit";
export * from "./buffer";
export * from "./common";
export * from "./date";
export * from "./number";
export * from "./string";
export * from "./tvp";

export interface SqlParameters {
	[name: string]: MssqlParameter<any>;
}

export interface Result<TResult extends any[], TOutput extends any[] = any[]> {
	/** elapsed ms for call to complete */
	elapsed: number;
	/** array of meta for each query */
	meta: Meta[][];
	/** array of result items */
	result: TResult;
	/** Output params if any */
	output: TOutput;
	/** prints from procedure collected */
	info: string[];
	/** row counts returned from update, insert, delete statements. */
	counts: number[];
	/** return code from procedure */
	returns: any;
	/** errors collected by running sql (up to promise reject) */
	errors: Error[];
}

export interface Results<TResults extends any[][], TOutput extends any[] = any[]> {
	/** elapsed ms for call to complete */
	elapsed: number;
	/** array of meta for each query */
	meta: Meta[][];
	/** array of result items */
	results: TResults;
	/** Output params if any */
	output: TOutput;
	/** prints from procedure collected */
	info: string[];
	/** row counts returned from update, insert, delete statements. */
	counts: number[];
	/** return code from procedure */
	returns: any;
	/** errors collected by running sql (up to promise reject) */
	errors: Error[];
}

export type QueryResult<TResult extends any[] = unknown[], TOutput extends any[] = unknown[]> = TResult extends any[][]
	? Results<TResult, TOutput>
	: Result<TResult, TOutput>

export class MssqlDataSource<TContext = any> extends DataSource {
	private keyValueCache: KeyValueCache | undefined;
	protected context: TContext | undefined;

	constructor(private pool: Pool) {
		super();
	}

	override initialize(config: DataSourceConfig<TContext>): void {
		this.context = config.context;
		this.keyValueCache = new PrefixingKeyValueCache(
			config.cache ?? new InMemoryLRUCache(),
			"mssqlcache:"
		);
	}

	protected query<TResult extends any[] = unknown[], TOutput extends any[] = unknown[]>(
		query: string,
		parameters: SqlParameters = {},
		options: {
			/** default 0 i.e. no timeout */
			timeoutMs?: number;
			/** results as arrays or objects with column names */
			raw?: boolean;
			/** Query text to add before the parameters */
			queryPrefix?: string;
			/** The cache key to use, does not cache if not provided */
			cacheKey?: string;
			/** Cache time to live */
			cacheTtl?: number;
		} = {}
	): Promise<QueryResult<TResult, TOutput>> {
		if (options.cacheKey) {
			return this.keyValueCache!.get(options.cacheKey)
				.then((cacheValue) => {
					if (cacheValue) {
						return Promise.resolve(JSON.parse(cacheValue) as QueryResult<TResult, TOutput>);
					}

					const newOpts = { ...options };
					delete newOpts.cacheKey;
					return this.query<TResult, TOutput>(query, parameters, newOpts);
				})
				.then((result) => {
					this.keyValueCache?.set(options.cacheKey!, JSON.stringify(result), {ttl: options.cacheTtl} as KeyValueCacheSetOptions);
					// eslint-disable-next-line @typescript-eslint/no-unsafe-return
					return result;
				});
		} else {
			const params = Object.entries(parameters);

			const queryText = `
				${options.queryPrefix ?? ""}
				${params.map(([key, value]) => value.toParamText(key, value.value)).join(";\n")}
				${query}
			`;

			return this.pool.promises
				.query(
					queryText,
					// eslint-disable-next-line @typescript-eslint/no-unsafe-return
					params.map(([, v]) => v.toParam(v.value)),
					{
						timeoutMs: options.timeoutMs,
						raw: options.raw,
					} as QueryAggregatorOptions
				)
				.then(({ first, ...rest }): Results<TResult, TOutput> & Result<TResult, TOutput> => {
					// eslint-disable-next-line @typescript-eslint/no-unsafe-return
					return {
						result: first,
						...rest,
					} as any;
				}) as Promise<QueryResult<TResult, TOutput>>;
		}
	}
}
