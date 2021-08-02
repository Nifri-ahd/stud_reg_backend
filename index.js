const { ApolloServer, PubSub } = require('apollo-server');
const pubsub = new PubSub();


const schema = require('./Schema/schema');
const resolvers = require('./Resolvers/resolvers');






//graphql creation
app.use(
  '/graphql', 
  graphqlHTTP({
  schema : require('./Schema/schema'), 
  graphiql: true})
  );





const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: (err) => {
   
    if (err.message.startsWith("errors is not defined")) {
      return new Error('Something is wrong with the username or credential');
    }

    return err;
  },
  context: ({ req }) => ({ req, pubsub }),
});



//localhost
app.listen(3000,() =>{
  console.log('Server connected to 3000');
  })
  