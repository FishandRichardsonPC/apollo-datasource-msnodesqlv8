# Apollo msnodesqlv8 Data Source

## Documentation

View the [Apollo Server documentation for data sources](https://www.apollographql.com/docs/apollo-server/features/data-sources/) for more details.

You may also want to look at the [msnodesqlv8 documentation](https://github.com/TimelordUK/node-sqlserver-v8) for how to create a connection pool and how to install the driver. 

## Usage
To get started, install the `@fr/apollo-datasource-msnodesqlv8` package

```
yarn add @fr/apollo-datasource-msnodesqlv8
```

To define a datasource extend the MssqlDataSource class and implement methods as needed. Things to be aware of:
* When using this library it is recommended that you use typescript
* When you are ready to initialize the class the construction expects a single parameter containing a connection pool. This package uses the promise api
from msnodesqlv8 so it is recommended that you add `pool.on("error", () => {})`. This will allow the promises to properly
handle errors thrown by sql. Unfortunately this will swallow errors for non promise queries. See [this issue](https://github.com/TimelordUK/node-sqlserver-v8/issues/227)
for more details.
* The MssqlDataSource class provides a single protected method named query:
  * It accepts two type arguments:
    * The result type
      * If returning a single result set this should be RecordType[]
      * If returning multiple result sets this should be [RecordType1[], RecordType2[], ....]
    * The output type (if you are returning output parameters)
  * and three parameters
    * The query string
      * This can be any valid tsql query including calls to stored procedures
    * The parameters
      * This accepts an object which will expose all properties to your query via @PropertyName (case matching the property)
        and must contain the return value of one of the type functions exposed by this library which match the sql types:
        * Boolean Values
          * bit(value: boolean | null)
        * Binary Values
          * varBinary(value: Buffer | null, length: number)
          * varBinaryMax(value: Buffer | null)
        * Date and Time
          * Note: these methods take in either a JS Date object or a string value that the JS Date function can parse. See the documentation for your platform to determine what strings are supported
          * time(value: Date | string | null)
          * date(value: Date | string | null)
          * dateTime(value: Date | string | null)
          * dateTime2(value: Date | string | null)
          * smallDateTime(value: Date | string | null)
          * dateTimeOffset(value: Date | string | null)
        * Numbers
          * bigInt(value: number | null)
          * int(value: number | null)
          * money(value: number | null)
          * smallMoney(value: number | null)
          * tinyInt(value: number | null)
          * smallInt(value: number | null)
          * float(value: number | null, mantissa: number)
          * real(value: number | null, mantissa: number)
          * decimal(value: number | null, precision: number, scale: number)
          * numeric(value: number | null, precision: number, scale: number)
        * Variable Length Strings
          * varChar(value: string | null, length: number)
          * varCharMax(value: string | null)
          * nVarChar(value: string | null, length: number)
          * nVarCharMax(value: string | null)
          * uniqueIdentifier(value: string | null)
          * xml(value: string | null)
        * Static Length Strings
          * Note: For these if the length is not provided the length of the string will be used (minimum 1)
          * char(value: string | null, length?: number)
          * nChar(value: string | null, length?: number)
    * (optional) an object which can contain a few options.
      * timeoutMs: default 0 i.e. no timeout
      * raw: passed directly to msnodesqlv8
      * queryPrefix: Query text to add before the parameters
      * cacheKey: If provided will enable query result caching, this is the cache key that will be used
      * cacheTtl: The length of time to hold onto the cache, if not provided the default ttl will be used
* And will return an object containing:
  * elapsed: The number of ms it took the call to complete
  * meta: Metadata about the query
  * (if returning multiple result sets) results: A 2d array containing the results
  * (if returning a single result set) result: a 1d array containing the results
  * output: Output parameters if any
  * info: Strings printed from the query
  * counts: Update, insert, and delete counts
  * returns: Return code
  * errors: A list of errors returned by sql

## Developing

This repository uses yarn v2 with corepack, before installing make sure you [Install Corepack](https://yarnpkg.com/getting-started/install#install-corepack). Once complete simply run yarn. Once installed you can build the project by running `yarn build`  
