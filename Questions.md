# 11 Nov 2020

1. In my current setup, I have enabled developer preview for scope and collection. See [setup-couchbase.sh](scripts/setup-couchbase.sh). Now, using the demo code taken from [01-create-and-save](https://github.com/httpJunkie/ottoman-demo/blob/master/scripts/01-create-and-save.js) which is current saved as `index.js`. It will throw error as shown below

```
$ node index.js
Saving Document: Couchbase Airlines
CollectionNotFoundError: collection not found
    at _getWrappedErr (Z:\mongoose-vs-ottoman\node_modules\couchbase\lib\errors.js:836:14)
    at Object.wrapLcbErr (Z:\mongoose-vs-ottoman\node_modules\couchbase\lib\errors.js:1009:20)
    at Z:\mongoose-vs-ottoman\node_modules\couchbase\lib\collection.js:572:24 {
  cause: LibcouchbaseError { code: 211 },
  context: KeyValueErrorContext {
    status_code: 4,
    opaque: 2,
    cas: CbCas { '0': <Buffer 00 00 00 00 00 00 00 00> },
    key: '_default$Airline::4a3b849f-6cb2-451e-b577-58afd7195f4a',
    bucket: 'testBucket',
    collection: 'Airline',
    scope: '_default',
    context: '',
    ref: ''
  }
}
```

However, if I did not enable the preview, it will save as expected

```
$ node index.js
Saving Document: Couchbase Airlines
Document: 6cbd3cbd-8f49-46ce-bdca-d9b71cb43734 has been saved
```

Any idea what could be causing it?

2. How do I specify in the connection to connect to a specific scope/collection? I see there is some [configurationOptions](https://v2.ottomanjs.com/guides/connections.html#global-config) but don't really understand what does each of them mean. Would it be better to explain those options in the doc, and/or have a link to somewhere if there is a explanation elsewhere?

3. Is there any way to drop a specific bucket/scope/collection? In `mongoose`, I have [dropDatabase](https://mongoosejs.com/docs/api/connection.html#connection_Connection-dropDatabase) and [dropCollection](https://mongoosejs.com/docs/api.html#connection_Connection-dropCollection)

4. In `mongoose`, I have [remove](https://mongoosejs.com/docs/api.html#model_Model.remove), [deleteOne](https://mongoosejs.com/docs/api.html#query_Query-deleteOne), [deleteMany](https://mongoosejs.com/docs/api.html#query_Query-deleteMany) to remove one or more document at one go. How can I do the same in `Otterman`? In the docs, I only see one sample which is using [remove](https://v2.ottomanjs.com/classes/document.html#remove)

5. I notice something weird but not sure what is the issue. Whenever I setup a fresh couchbase using `docker-compose up -d` (can follow the setup in [README](./README.md)), and after setting up, I set to run only `ottoman-create.test.js` test suite and then I ran `npm test`.

The first time, it throws:

```
$ npm test

> mongoose-vs-ottoman@1.0.0 test Z:\mongoose-vs-ottoman
> mocha test/*.js --exit



  test create function
    1) "before all" hook for "ottoman - should create new doc"


  0 passing (36ms)
  1 failing

  1) test create function
       "before all" hook for "ottoman - should create new doc":
     Uncaught Error: LCB_ERR_UNSUPPORTED_OPERATION (214): Unsupported operation
      at CbConnection.<anonymous> (node_modules\couchbase\lib\connection.js:315:37)
      at AsyncResource.runInAsyncScope (async_hooks.js:186:9)
      at Array.<anonymous> (node_modules\couchbase\lib\connection.js:219:13)
      at Connection._flushPendOps (node_modules\couchbase\lib\connection.js:187:23)
      at Object.<anonymous> (node_modules\couchbase\lib\connection.js:152:14)



npm ERR! Test failed.  See above for more details.
```

The second time I ran `npm test`, it throws

```
$ npm test

> mongoose-vs-ottoman@1.0.0 test Z:\mongoose-vs-ottoman
> mocha test/*.js --exit



  test create function
    1) "before all" hook for "ottoman - should create new doc"


  0 passing (2s)
  1 failing

  1) test create function
       "before all" hook for "ottoman - should create new doc":
     Error: Timeout of 2000ms exceeded. For async tests and hooks, ensure "done()" is called; if returning a Promise, ensure it resolves. (Z:\mongoose-vs-ottoman\test\ottoman-create.test.js)
      at listOnTimeout (internal/timers.js:549:17)
      at processTimers (internal/timers.js:492:7)



npm ERR! Test failed.  See above for more details.
```

Finally, the third time I ran `npm test`, it will pass

```
$ npm test

> mongoose-vs-ottoman@1.0.0 test Z:\mongoose-vs-ottoman
> mocha test/*.js --exit



  test create function
    √ ottoman - should create new doc


  1 passing (297ms)
```

Any subsequent `npm test` looks to be passing too. The logs doesn't seem to have anything as far as I can tell.

I am also able to replicate this issue by re-setup the couchbase (`docker-compose down -v and then docker-compose up -d`). Seem to be consistent behavior

![couchbase-logs-1](images/couchbase-logs-1.jpg)

6. For the `ottoman.connect`, is my only option to wait for the connection to be ready is to run `await ottoman.ensureIndexes()`? I don't seem to be able to run `await ottoman.connect` since it just returns a `ConnectionManager`. Is it `ottoman.start`?

7. You will find that in `ottoman-create.test.js` Line 42, it print the data using `Airline.find()`, but it will not print out any data even though the data has been created, and verified in the UI. However, if I were to run the same test again, and now, the log will shows that there is one result (where it have been two, and ui does have two data). Why does it seem like it is lagging behind one operation? Am I not using the API correctly? Did I missed out anything?

```
// first run, should have 1 row but none
{
  meta: {
    requestId: '6a9acb60-e66c-4e9a-b8ba-effe1974744e',
    clientContextId: 'e053649c8a595c58',
    status: 'success',
    signature: { '*': '*', _type: 'json' },
    profile: undefined,
    metrics: {
      elapsedTime: 2.0655,
      executionTime: 1.9989,
      sortCount: undefined,
      resultCount: 0,
      resultSize: 0,
      mutationCount: undefined,
      errorCount: undefined,
      warningCount: undefined
    }
  },
  rows: []
}

// second run, should have 2 row but only 1
{
  meta: {
    requestId: 'a0e45af2-48c7-4fad-a2a0-d27b81a34a67',
    clientContextId: '77bb3bbb8ab1701f',
    status: 'success',
    signature: { '*': '*', _type: 'json' },
    profile: undefined,
    metrics: {
      elapsedTime: 6.9238,
      executionTime: 6.872,
      sortCount: undefined,
      resultCount: 1,
      resultSize: 160,
      mutationCount: undefined,
      errorCount: undefined,
      warningCount: undefined
    }
  },
  rows: [
    _Model {
      _scope: '_default',
      _type: 'Airline',
      callsign: 'Couchbase',
      country: 'United States',
      id: '6dc26494-1ff7-4e65-99a6-666456ab7980',
      name: 'Couchbase Airlines'
    }
  ]
}
```

