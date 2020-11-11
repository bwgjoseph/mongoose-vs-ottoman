/* Demonstrate model and schema creation and persistence 
  of data with ottoman.save() */
  const ottoman = require('ottoman')
  const { model, Schema } = require('ottoman')
  
  ottoman.connect({
    connectionString: 'couchbase://localhost',
    bucketName: 'testBucket',
    username: 'user',
    password: 'password'
  })
  
  // Create a standard schema for airline Models
  const airlineSchema = new Schema({
    callsign: String,
    country: String,
    name: String
  })
  
  // Plugins and Hooks are middleware, think lifecycle hooks!
  // They must be created before the Model instance
  
  const pluginLog = (airlineSchema) => {
    airlineSchema.pre('save', (doc) => console.log(
      `Saving Document: ${doc.name}`
    ))
  
    airlineSchema.post('save', (doc) => 
      console.log(`Document: ${doc.id} has been saved`)
    )
  };
  
  airlineSchema.plugin(pluginLog)
  
  /* Create refdoc index (faster for retrieving docs with id)
    since name is unique we want to create a ref index on our name
    this is immediately consistent by creating a referential doc in db 
    in addition to our airline document. For purposes of lookup by key */
  airlineSchema.index.findByName = {
    by: 'name',
    type: 'refdoc'
  }
  
  // Compile our model using our schema
  const Airline = model('Airline', airlineSchema)
  
  // Constructing our document
  const cbAirlines = new Airline({
    callsign: 'Couchbase',
    country: 'United States',
    name: 'Couchbase Airlines'
  })
  
  // Persist the Couchbase Airlines document to Couchbase Server
  const saveDocument = async() => {
    try {
      // pre and post hooks will run
      await cbAirlines.save()
    } catch (error) {
      throw error
    }
  }
  
  // Ensure that all indexes exist on the server
  ottoman.ensureIndexes()
    // Next, let's save our document and print a success message 
    .then(async() => {
      saveDocument()
        .then(() => process.exit(0))
        .catch((error) => console.log(error))
    })