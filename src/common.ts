export interface MssqlParameter<T> {
	/** String descriptor of data type, used for debugging */
	typeDescriptor: string;
	/** A call to one of the parameter creators */
	toParam(value: T): any;
	/**
	 * The sql text of the parameter
	 * DO NOT include the value directly, only passed here for access to other properties (like length)
	 * DO include the name directly, you don't need to worry about sql injection for the name
	 */
	toParamText(name: string, value: T): string;
	/** The value */
	value: T;
}
