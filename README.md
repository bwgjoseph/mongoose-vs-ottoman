# Setup

1. Run `docker-compose up -d`
2. Wait 5-10 sec for all services to fully initialized
3. Launch a command prompt and run `docker exec -it mo-couchbase bash`
4. Once inside the container, run `cd scripts` then `./setup-couchbase.sh`, type `y` if prompted. See details below
5. You can now access couchbase via `localhost:8091` and login using `admin:password`
6. You can now access mongo-express via `localhost:8881`

## setup-couchbase.sh

This script will initialize and setup couchbase node and cluster using the couchbase-cli, hence, no manual setup is required. It will:

1. Initialize the node with `admin:password` credentials
2. Initialize the cluster with only `data, index, query, fts` services enabled
3. Create `user:password` with `full admin` rights
4. Creates a bucket: `testBucket`
5. Enable `developer-preview` to enable `scope and collections` feature
6. Creates a scope: `testScope` under `testBucket`
7. Creates a collection: `testCollection` under `testScope`

> Note: Step 5-7 is disabled currently due to issue connecting to couchbase with scope and collections enabled

# Usage

Once the above is setup, run `npm test` to ensure current test pass

> Note: May need to run the command twice to get test pass for the very first run. Not sure the cause of it yet

You can now write test cases to verify the behavior of mongoose and ottoman

1. Write all test cases in `/test` directory
2. Create one file per feature test case (e.g. $in.test.js, save.test.js)

# Resource

- [couchbase-cli](https://docs.couchbase.com/server/current/cli/cbcli/couchbase-cli.html)
- [bentonam/couchbase-docker](https://github.com/bentonam/couchbase-docker)
- [manage-collections-with-cli](https://docs.couchbase.com/server/current/developer-preview/collections/manage-collections-with-cli.html)
- [migrating-from-mongodb-with-ottomanjs](https://www.slideshare.net/Couchbase/migrating-from-mongodb-with-ottomanjs)
- [Migrating from MongoDB with Ottoman.js – Couchbase Connect 2016](https://www.youtube.com/watch?v=wTvDKIQiVgE)
- [ottoman-demo](https://github.com/httpJunkie/ottoman-demo)
- [v2.ottomanjs](https://v2.ottomanjs.com/)
- [couchbase-getting-started-docker](https://docs.couchbase.com/server/current/install/getting-started-docker.html)
- [try-ottoman](https://github.com/couchbaselabs/try-ottoman)

# couchbase-cli commands

```
Create Bucket:

/opt/couchbase/bin/couchbase-cli bucket-create --cluster localhost:8091 --username admin --password password --bucket testBucket --bucket-type couchbase --bucket-ramsize 100

Grab buckets stats:

/opt/couchbase/bin/cbstats -u admin -p password localhost:11210 -b testBucket all | grep collections
/opt/couchbase/bin/cbstats -u admin -p password localhost:11210 -b testBucket all | grep scopes

To create scope:

/opt/couchbase/bin/couchbase-cli collection-manage --cluster http://localhost:8091 --username admin --password password --bucket testBucket --create-scope testScope

To list scopes:

/opt/couchbase/bin/couchbase-cli collection-manage --cluster http://localhost:8091 --username admin --password password --bucket testBucket --list-scopes

To create collection:

/opt/couchbase/bin/couchbase-cli collection-manage --cluster http://localhost:8091 --username admin --password password --bucket testBucket --create-collection testScope.testCollection

To list collections:

/opt/couchbase/bin/couchbase-cli collection-manage --cluster http://localhost:8091 --username admin --password password --bucket testBucket --list-collections testScope

/opt/couchbase/bin/cbstats -u admin -p password -b testBucket localhost:11210 collections
/opt/couchbase/bin/cbstats -u admin -p password -b testBucket localhost:11210 collections-details
```

## Questions

1. Does otterman support scope/collection now?
2. Is there a way for otterman to drop bucket/scope/collection? or drop multiple docs?