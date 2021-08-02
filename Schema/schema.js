const { gql } = require('apollo-server');

module.exports = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    age: String!
    country: String!
    username: String!
    password: String!
    profile_picture: String
  }
  input userData {
    name: String!
    username: String!
    age: String!
    country: String!
    email: String!
    password: String!
    profile_picture: Upload
  }
  type Query {
    getUser(username: String!): User!
    getAllUsers: [User]!
    files: [String]
  }

  type Mutation {
    register(userData: userData!): User!
    login(username: String!, password: String!): User!
    uploadFile(file: Upload!): Boolean
  }
`;